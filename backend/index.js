const dotenv = require('dotenv');
dotenv.config();


const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');
const favoritesRoutes = require('./routes/favorites');
const authMiddleware = require('./middleware/authMiddleware');


const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({ message: 'Database connection successful' });
    } catch (error) {
        console.error('Error in health check:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/favorites', authMiddleware, favoritesRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



