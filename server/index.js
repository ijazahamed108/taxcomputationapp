const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userInfoRoutes =require('./routes/userInfo')
const taxRoutes = require('./routes/taxRoutes')
const adminRoutes = require('./routes/adminRoutes')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // to configure cross origins
app.use(express.json());

// Establish connection to mongoDb
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/computetax', taxRoutes);
app.use('/api/admin', adminRoutes)

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
 