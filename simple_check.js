const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
    
    // Get all distinct categories
    const categories = await Listing.distinct("category");
    console.log("\nDistinct categories:", categories);
    
    // Count listings per category
    for (const category of categories) {
      const count = await Listing.countDocuments({ category });
      console.log(`${category}: ${count} listings`);
    }
    
    // Total count
    const total = await Listing.countDocuments();
    console.log(`\nTotal listings: ${total}`);
    
    mongoose.connection.close();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();