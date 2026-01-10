const express = require('express');
const { FavoriteMovie } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const userId = req.userId;
        const favorites = await FavoriteMovie.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
        return res.json({ message: 'Favorites fetched successfully', data: favorites });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const userId = req.userId;
        const { movieId, title, posterPath, voteAverage } = req.body;

        if (!movieId || !title) {
            return res.status(400).json({ message: 'Movie ID and title are required' });
        }

        const existingFavorite = await FavoriteMovie.findOne({ where: { userId, movieId } });
        if (existingFavorite) {
            return res.status(400).json({ message: 'Movie already in favorites' });
        }

        const favoriteMovie = await FavoriteMovie.create({ userId, movieId, title, posterPath, voteAverage });
        return res.status(201).json({ message: 'Movie added to favorites', data: favoriteMovie });
    } catch (error) {
        console.error('Error creating favorite movie:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const deletedFavoriteMovie = await FavoriteMovie.destroy({ where: { id, userId } });
        if (deletedFavoriteMovie === 0) {
            return res.status(404).json({ message: 'Favorite movie not found' });
        }
        return res.json({ message: 'Movie removed from favorites' });
    } catch (error) {
        console.error('Error deleting favorite movie:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
