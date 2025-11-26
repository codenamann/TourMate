import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import State from "../models/State.js";
import City from "../models/City.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const seedIndiaCities = async () => {
  try {
    // Check if data already exists
    const stateCount = await State.countDocuments();
    const cityCount = await City.countDocuments();
    
    if (stateCount > 0 && cityCount > 0) {
      console.log("India states and cities already seeded. Skipping...");
      return;
    }

    console.log("Loading India dataset...");
    
    // Load JSON file
    const datasetPath = join(__dirname, "../dataset/countries+states+cities.json");
    const rawData = readFileSync(datasetPath, "utf-8");
    const countries = JSON.parse(rawData);

    // Find India
    const india = countries.find(c => c.name === "India");
    
    if (!india || !india.states) {
      console.error("India data not found in dataset");
      return;
    }

    console.log(`Found ${india.states.length} states for India`);

    // Clear existing data if partial
    if (stateCount === 0 || cityCount === 0) {
      await State.deleteMany({});
      await City.deleteMany({});
    }

    // Insert states
    const stateMap = new Map();
    const statesToInsert = india.states.map(state => {
      const stateDoc = {
        name: state.name,
        code: state.iso2 || state.name.substring(0, 3).toUpperCase(),
        country: "India"
      };
      stateMap.set(state.name, stateDoc);
      return stateDoc;
    });

    await State.insertMany(statesToInsert);
    console.log(`Inserted ${statesToInsert.length} states`);

    // Fetch states from DB to get IDs
    const dbStates = await State.find({});
    const stateNameToId = new Map();
    dbStates.forEach(state => {
      stateNameToId.set(state.name, state._id);
    });

    // Insert cities
    const citiesToInsert = [];
    let totalCities = 0;

    for (const state of india.states) {
      if (!state.cities || state.cities.length === 0) continue;

      const stateId = stateNameToId.get(state.name);
      if (!stateId) continue;

      for (const city of state.cities) {
        citiesToInsert.push({
          name: city.name,
          stateId: stateId,
          latitude: city.latitude || null,
          longitude: city.longitude || null
        });
        totalCities++;

        // Batch insert every 1000 cities for performance
        if (citiesToInsert.length >= 1000) {
          await City.insertMany(citiesToInsert);
          console.log(`Inserted ${citiesToInsert.length} cities (total: ${totalCities})`);
          citiesToInsert.length = 0;
        }
      }
    }

    // Insert remaining cities
    if (citiesToInsert.length > 0) {
      await City.insertMany(citiesToInsert);
      console.log(`Inserted ${citiesToInsert.length} cities (total: ${totalCities})`);
    }

    console.log(`✅ India cities seeded successfully: ${totalCities} cities across ${statesToInsert.length} states`);
  } catch (error) {
    console.error("Error seeding India cities:", error);
    throw error;
  }
};

