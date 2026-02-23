const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");

const products = require("./data/products");

dotenv.config();

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Function to seed data
const seedData = async () => {
  try {
    // 1️⃣ Connect to DB
    await connectDB();

    // 2️⃣ Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    console.log("Existing data cleared!");

    // 3️⃣ Create a default admin user
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    // 4️⃣ Assign the admin user ID to each product
    const userID = createdUser._id;
    const sampleProducts = products.map((product) => {
      return { ...product, user: userID };
    });

    // 5️⃣ Insert the products into the database
    await Product.insertMany(sampleProducts);
    console.log("Product data seeded successfully!");

    process.exit();
  } catch (error) {
    console.error("Error seeding the data", error);
    process.exit(1);
  }
};

seedData();
