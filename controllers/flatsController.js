
const Flat = require('../models/Flat');

exports.createFlat = async (req, res) => {
  try {
    const flat = new Flat(req.body);
    await flat.save();
    res.status(201).json(flat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllFlats = async (req, res) => {
  try {
    const flats = await Flat.find();
    res.json(flats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFlatById = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: 'Flat not found' });
    res.json(flat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFlat = async (req, res) => {
  try {
    const flat = await Flat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flat) return res.status(404).json({ message: 'Flat not found' });
    res.json(flat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteFlat = async (req, res) => {
  try {
    const flat = await Flat.findByIdAndDelete(req.params.id);
    if (!flat) return res.status(404).json({ message: 'Flat not found' });
    res.json({ message: 'Flat deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
