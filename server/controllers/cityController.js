import City from "../models/City.js";

export const getCities = async (req, res) => {
  try {
    const { stateId, search, limit = 50 } = req.query;
    const query = {};

    // Filter by state if provided
    if (stateId) {
      query.stateId = stateId;
    }

    // Search by city name if provided
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const cities = await City.find(query)
      .populate("stateId", "name code")
      .limit(parseInt(limit))
      .sort({ name: 1 });

    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id).populate("stateId", "name code");
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

