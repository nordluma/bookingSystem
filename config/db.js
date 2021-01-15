const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        };
        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        console.log(`DB connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDb;
