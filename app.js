const express = require('express');
const app = express();
const accountRoutes = require('./routes/accountRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Use JSON middleware
app.use(express.json());

// Use routes
app.use('/api/account', accountRoutes);
app.use('/api/settings', settingsRoutes);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
