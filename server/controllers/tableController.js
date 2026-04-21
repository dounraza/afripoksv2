import TablePoker from '../models/TablePoker.js';
import { tableManager } from '../logic/TableManager.js';

export const getTables = async (req, res) => {
  try {
    const tables = await TablePoker.findAll();
    
    // Enrich table data with real-time player counts
    const enrichedTables = tables.map(table => {
      const activeTable = tableManager.getTable(table.id);
      return {
        ...table.toJSON(),
        currentPlayers: activeTable ? activeTable.players.length : 0
      };
    });

    res.json(enrichedTables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
