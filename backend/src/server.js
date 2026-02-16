require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

app.get('/health', (req, res) => {
  res.status(200).send('URL Shortener API is running');
});
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
