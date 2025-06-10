import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://premyadavptts:YzQn0VdB3rBHIz2t@cluster0.x7q1w4a.mongodb.net/lms1", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1); // Exit with failure
    }
};

export default connectDB;