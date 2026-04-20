import TablePoker from '../models/TablePoker.js';

export const getTables = async (req, res) => {
  try {
    const tables = await TablePoker.findAll();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
