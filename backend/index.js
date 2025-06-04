const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const authenticateToken = require('./middlewares/authenticate');

const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const adminRoutes = require('./routes/admin');
app.use(express.json());
app.use(cors());
// app.use(authenticateToken); // Middleware xác thực token cho tất cả các route
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/admin', adminRoutes); 







app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on ${HOST} ${PORT}`);
});

//routes -> tro api
//controllers -> code thuat toan
//models -> code ket noi db
