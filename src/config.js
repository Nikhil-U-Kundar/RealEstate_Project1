const mongoose = require('mongoose');

const uri = "mongodb+srv://realestate:9945994323@cluster0.vfyccaa.mongodb.net";
// const uri ="mongodb+srv://nikhilukundar:9945994323@cluster0.bzxf1yq.mongodb.net"

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 // Increase the timeout to 30 seconds
})
    .then(() => {
        console.log("Database Connected Successfully");
    })
    .catch((error) => {
        console.error("Database cannot be Connected:", error);
    });

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Collection part
const collection = mongoose.model("users", Loginschema);

module.exports = collection;
