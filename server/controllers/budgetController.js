import City from "../models/City.js";
import Destination from "../models/Destination.js";
import Hotel from "../models/Hotel.js";

export const planBudget = async (req, res) => {
  try {
    const { budget, days, travelType, comfortLevel, startingCityId } = req.body;
    
    if (!budget || !days) {
      return res.status(400).json({ message: "Budget and days are required" });
    }
    
    const dailyBudget = budget / days;
    
    // Cost estimation based on comfort level
    const costMultipliers = {
      budget: 0.7,
      "mid-range": 1.0,
      luxury: 1.5
    };
    
    const multiplier = costMultipliers[comfortLevel] || 1.0;
    const adjustedDailyBudget = dailyBudget * multiplier;
    
    // Get all cities
    const cities = await City.find();
    
    // Calculate breakdown percentages based on comfort level
    const breakdownPercentages = {
      budget: { stay: 0.35, food: 0.35, travel: 0.25, misc: 0.05 },
      "mid-range": { stay: 0.40, food: 0.30, travel: 0.20, misc: 0.10 },
      luxury: { stay: 0.50, food: 0.25, travel: 0.15, misc: 0.10 }
    };
    
    const percentages = breakdownPercentages[comfortLevel] || breakdownPercentages["mid-range"];
    
    const breakdown = {
      stay: Math.round(adjustedDailyBudget * percentages.stay),
      food: Math.round(adjustedDailyBudget * percentages.food),
      travel: Math.round(adjustedDailyBudget * percentages.travel),
      misc: Math.round(adjustedDailyBudget * percentages.misc)
    };
    
    // Calculate estimated transport cost based on travel type
    const transportCosts = {
      flight: 5000,
      train: 2000,
      bus: 1000,
      car: 3000
    };
    const estimatedTransport = transportCosts[travelType] || 2000;
    
    // Calculate total trip cost per city (including transport)
    const eligibleCities = cities.map(city => {
      const totalCityCost = (adjustedDailyBudget * days) + estimatedTransport;
      
      return {
        city: city,
        estimatedCost: Math.round(totalCityCost),
        estimatedTransport: estimatedTransport,
        dailyBudget: Math.round(adjustedDailyBudget),
        breakdown: {
          ...breakdown,
          transport: estimatedTransport
        },
        affordability: totalCityCost <= budget ? "affordable" : "over-budget"
      };
    });
    
    // Sort by affordability and cost
    eligibleCities.sort((a, b) => {
      if (a.affordability !== b.affordability) {
        return a.affordability === "affordable" ? -1 : 1;
      }
      return a.estimatedCost - b.estimatedCost;
    });
    
    // Get top 10 suggestions
    const suggestedCities = eligibleCities.slice(0, 10);
    
    res.json({
      eligibleCities: suggestedCities,
      totalBudget: budget,
      days,
      dailyBudget: Math.round(adjustedDailyBudget),
      breakdown,
      estimatedTransport,
      travelType,
      comfortLevel
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

