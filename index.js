const express = require('express');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const app = express();

const PORT = 5000;

//app.use(express.json());
app.use('/', authRoutes);
app.use('/', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});