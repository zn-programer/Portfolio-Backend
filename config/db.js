const mongoose = require("mongoose");

async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to database successfully");
    } catch (error) {
        console.log("Connection failed to MongoDB!", error);    
    }
}


module.exports = connectToDb;
