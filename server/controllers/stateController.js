import State from "../models/State.js";

export const getStates = async (req, res) => {
  try {
    const states = await State.find().sort({ name: 1 });
    res.json(states);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStateById = async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

