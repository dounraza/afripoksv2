import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { tableManager } from './logic/TableManager.js';
import sequelize from './config/database.js';
import { connectDB } from './config/database.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import soldeRoutes from './routes/soldeRoutes.js';
import TablePoker from './models/TablePoker.js';
import User from './models/User.js';
import Solde from './models/Solde.js';

const app = express();
app.use(cors());
app.use(express.json()); 
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/solde', soldeRoutes);

// Initialiser la connexion DB et synchroniser les modèles
connectDB().then(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Modèles synchronisés avec la base de données.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation des modèles :', error);
  }
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

function broadcastTableState(table) {
  table.players.forEach(p => {
    io.to(p.id).emit('tableUpdated', table.getStateForPlayer(p.id));
  });
}

io.on('connection', (socket) => {
  console.log('Un joueur s\'est connecté :', socket.id);

  socket.on('joinTable', async ({ tableId, playerName, buyIn }) => {
    let table = tableManager.getTable(tableId);

    if (!table) {
      try {
        const tableData = await TablePoker.findOne({ where: { name: tableId } });
        if (tableData) {
          table = tableManager.createTable(tableId, {
            smallBlind: parseFloat(tableData.smallBlind),
            bigBlind: parseFloat(tableData.bigBlind),
            minBuyIn: parseFloat(tableData.cave)
          });
          console.log(`Nouvelle table logique créée : ${tableId}`);
        } else if (tableId === 'default-table') {
          table = tableManager.getTable('default-table');
        }
      } catch (err) {
        console.error('Erreur lors de la recherche de la table:', err);
      }
    }

    if (!table) {
      console.log(`Table non trouvée: ${tableId}`);
      return socket.emit('error', { message: 'Table non trouvée' });
    }

    try {
      // FIX: use 'name' instead of 'username' to match User model
      const user = await User.findOne({ 
        where: { name: playerName },
        include: [{ model: Solde }] 
      });

      if (!user) {
        console.log(`Utilisateur non trouvé: ${playerName}`);
        return socket.emit('error', { message: 'Utilisateur non trouvé' });
      }

      // Check if player is already at the table
      const existingPlayer = table.players.find(p => p.name === playerName);
      if (existingPlayer) {
        console.log(`Reconnexion de ${playerName} (Mise à jour Socket ID)`);
        existingPlayer.id = socket.id;
        socket.join(tableId);
        broadcastTableState(table);
        return;
      }

      if (!user.Solde) {
        console.log(`Solde non trouvé pour l'utilisateur: ${playerName}`);
        return socket.emit('error', { message: 'Compte solde non trouvé' });
      }

      const initialChips = parseInt(buyIn) || 0;
      if (initialChips < table.minBuyIn) {
        return socket.emit('error', { message: `Le montant minimum pour cette table est de ${table.minBuyIn} MGA` });
      }

      if (parseFloat(user.Solde.montant) < initialChips) {
        return socket.emit('error', { message: `Solde insuffisant. Vous avez ${user.Solde.montant} MGA` });
      }

      // Déduire le montant du solde
      user.Solde.montant = parseFloat(user.Solde.montant) - initialChips;
      await user.Solde.save();
      console.log(`Solde mis à jour pour ${playerName}: -${initialChips} MGA (Nouveau: ${user.Solde.montant})`);

      if (!table.onUpdate) {
        table.setUpdateCallback(() => broadcastTableState(table));
      }

      const player = table.addPlayer(socket.id, playerName, initialChips);
      if (player.error) {
        user.Solde.montant = parseFloat(user.Solde.montant) + initialChips;
        await user.Solde.save();
        console.log(`Erreur joinTable: ${player.error}. Remboursement.`);
        return socket.emit('error', { message: player.error });
      }

      socket.join(tableId);
      console.log(`${playerName} a rejoint la table ${tableId}`);

      io.to(tableId).emit('tableUpdated', table.getStateForPlayer(null));

      if (table.players.length >= 2 && table.gameState === 'waiting') {
        table.startHand();
        broadcastTableState(table);
      }
    } catch (err) {
      console.error('Détails de l\'erreur joinTable:', err);
      socket.emit('error', { message: `Erreur serveur: ${err.message}` });
    }
  });

  socket.on('leaveTable', ({ tableId }) => {
    const table = tableManager.getTable(tableId);
    if (table) {
      table.removePlayer(socket.id);
      socket.leave(tableId);
      console.log(`Joueur ${socket.id} a quitté la table ${tableId}`);
      io.to(tableId).emit('tableUpdated', table.getStateForPlayer(null));
    }
  });

  socket.on('playerAction', ({ tableId, action, amount }) => {
    const table = tableManager.getTable(tableId);
    if (!table) return;

    const result = table.handleAction(socket.id, action, amount);
    if (result.error) {
      return socket.emit('error', { message: result.error });
    }

    broadcastTableState(table);
  });

  socket.on('disconnect', () => {
    console.log('Joueur déconnecté :', socket.id);
    tableManager.getAllTables().forEach(table => {
      table.removePlayer(socket.id);
      io.to(table.id).emit('tableUpdated', table.getStateForPlayer(null));
    });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Serveur Poker lancé sur http://localhost:${PORT}`);
});
