import Solde from '../models/Solde.js';

export const getSolde = async (req, res) => {
  try {
    const userId = req.user.id; // Sécurisé par le middleware
    const solde = await Solde.findOne({ where: { userId } });
    
    if (!solde) {
        // Créer un solde par défaut si inexistant
        const newSolde = await Solde.create({ userId, montant: 1000.00 });
        return res.json({ montant: newSolde.montant });
    }
    
    res.json({ montant: solde.montant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
