require('dotenv').config(); // must be on top

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000 // wait up to 10s before timeout
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Test route
app.get('/', (req, res) => res.send("FetchIt API Running ✅"));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
