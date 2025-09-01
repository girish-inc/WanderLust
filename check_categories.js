const mongoose = require('mongoose');
const Listing = require('./models/listing');
const initData = require('./init/data.js');
require('dotenv').config();

async function debugCategories() {
    try {
        await mongoose.connect(process.env.ATLASDB_URL);
        console.log('Connected to database');
        
        // Check what categories are in the sample data
        console.log('\n=== Sample Data Categories ===');
        const sampleCategories = [...new Set(initData.data.map(item => item.category))];
        console.log('Categories in sample data:', sampleCategories);
        
        // Check first few items from sample data
        console.log('\n=== First 3 Sample Items ===');
        initData.data.slice(0, 3).forEach((item, index) => {
            console.log(`${index + 1}. ${item.title}: ${item.category}`);
        });
        
        // Check what's actually in the database
        console.log('\n=== Database Analysis ===');
        const totalListings = await Listing.countDocuments({});
        console.log(`Total listings in DB: ${totalListings}`);
        
        const dbCategories = await Listing.distinct('category');
        console.log('Categories in database:', dbCategories);
        
        // Check category distribution
        for (let cat of dbCategories) {
            const count = await Listing.countDocuments({category: cat});
            console.log(`${cat}: ${count} listings`);
        }
        
        // Check some actual database records
        console.log('\n=== Sample DB Records ===');
        const sampleDbListings = await Listing.find({}).limit(5).select('title category');
        sampleDbListings.forEach((listing, index) => {
            console.log(`${index + 1}. ${listing.title}: ${listing.category}`);
        });
        
        // Test creating a single listing manually
        console.log('\n=== Manual Test Insert ===');
        const testListing = new Listing({
            title: "Test Listing",
            description: "Test description",
            image: {
                filename: "test",
                url: "https://example.com/test.jpg"
            },
            price: 100,
            location: "Test Location",
            country: "Test Country",
            category: "Mountains",
            owner: "68b540bd50b247caf68fec33"
        });
        
        await testListing.save();
        console.log('Test listing saved with category:', testListing.category);
        
        // Clean up test listing
        await Listing.deleteOne({title: "Test Listing"});
        console.log('Test listing cleaned up');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}

debugCategories();