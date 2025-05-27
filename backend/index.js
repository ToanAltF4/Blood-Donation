const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';


const authRoutes = require('./routes/auth');

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/auth',authRoutes);








app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on ${HOST} ${PORT}`);
});

//routes -> tro api
//controllers -> code thuat toan
//models -> code ket noi db
