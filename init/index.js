const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require('dotenv').config();

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  
  // Add owner to each listing and preserve all other fields including category
  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "68b540bd50b247caf68fec33"
  }));
  
  // Debug: Check first few listings before insertion
  console.log("First 3 listings before insertion:");
  listingsWithOwner.slice(0, 3).forEach((listing, index) => {
    console.log(`${index + 1}. ${listing.title}: ${listing.category}`);
  });
  
  // Insert listings one by one to better handle any errors
  console.log("Inserting listings...");
  for (let i = 0; i < listingsWithOwner.length; i++) {
    try {
      const listing = new Listing(listingsWithOwner[i]);
      await listing.save();
      console.log(`Inserted: ${listing.title} (${listing.category})`);
    } catch (error) {
      console.error(`Error inserting listing ${i + 1}:`, error.message);
    }
  }
  
  // Verify insertion
  const totalCount = await Listing.countDocuments({});
  const categories = await Listing.distinct('category');
  console.log(`Total listings inserted: ${totalCount}`);
  console.log(`Categories in database: ${categories}`);
  
  console.log("data was initialized");
};

initDB();