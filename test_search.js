const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function testSearch() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
    
    // Test different search queries
    const testQueries = [
      "beach",
      "mountain",
      "villa",
      "cottage",
      "tokyo",
      "bali",
      "luxury"
    ];
    
    console.log("\n=== Testing Search Functionality ===");
    
    for (const query of testQueries) {
      console.log(`\nSearching for: "${query}"`);
      
      const results = await Listing.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } },
          { country: { $regex: query, $options: 'i' } }
        ]
      });
      
      console.log(`Found ${results.length} results:`);
      results.forEach((listing, index) => {
        console.log(`  ${index + 1}. ${listing.title} - ${listing.location}, ${listing.country}`);
      });
    }
    
    // Test empty search
    console.log(`\nTesting empty search:`);
    const emptyResults = await Listing.find({});
    console.log(`Total listings in database: ${emptyResults.length}`);
    
    mongoose.connection.close();
    console.log("\nDatabase connection closed");
    console.log("\n=== Search Test Complete ===");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

testSearch();