import City from "../models/City.js";

export const planBudget = async (req, res) => {
  try {
    const { budget, days, travelType, comfortLevel, startingCityId } = req.body;
    
    // Mock budget calculation logic
    const dailyBudget = budget / days;
    
    // Cost estimation based on comfort level
    const costMultipliers = {
      budget: 0.7,
      "mid-range": 1.0,
      luxury: 1.5
    };
    
    const multiplier = costMultipliers[comfortLevel] || 1.0;
    const adjustedDailyBudget = dailyBudget * multiplier;
    
    // Get cities (for now, return all cities as eligible)
    const cities = await City.find();
    
    // Mock breakdown
    const breakdown = {
      stay: adjustedDailyBudget * 0.4,
      food: adjustedDailyBudget * 0.3,
      travel: adjustedDailyBudget * 0.2,
      misc: adjustedDailyBudget * 0.1
    };
    
    // Select eligible cities (mock - return first 5)
    const eligibleCities = cities.slice(0, 5).map(city => ({
      city: city,
      estimatedCost: adjustedDailyBudget * days,
      breakdown
    }));
    
    res.json({
      eligibleCities,
      totalBudget: budget,
      days,
      dailyBudget: adjustedDailyBudget,
      breakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAIExplanation = async (req, res) => {
  try {
    // Stub for Gemini API integration
    res.json({
      message: "AI explanation feature coming soon",
      explanation: "This will use Gemini API to provide detailed explanations"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

