const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');
const migrator = require('./migrations/migrator');
const backup = require('./backups/backup');
require('dotenv').config();

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB}`);
// Parse JSON bodies
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
const permitRoutes = require('./Routes/permitRoutes');
const roleRoutes = require('./Routes/roleRoutes');
const userRoutes = require('./Routes/userRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const subCategoryRoutes = require('./Routes/subCategoryRoutes');

app.use('/permit', permitRoutes);
app.use('/role', roleRoutes);
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/subcategory', subCategoryRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    status: false,
    msg: err.message
  };

  res.status(statusCode).json(response);
});

const defaultRun = async () => {
  // migrator.userSeeder();
  // await migrator.roleAndPermissionSeeder();
  // backup.backUpUser();
}
defaultRun();

app.use((req, res, next) => {
  res.status(404).json({ error: '404 Not Found' });
});

app.listen(3000, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});