require('node:dns/promises').setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://yadavpardhu44_db_user:HATOONw3ZfZDfxVe@helloworld.4auiqer.mongodb.net/devTinder");
}

module.exports = {connectDB};