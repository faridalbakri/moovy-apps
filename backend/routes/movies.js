const express = require('express');
const axios = require('axios');

const router = express.Router();

const API_URL_MOVIE_POPULAR = process.env.API_URL_MOVIE_POPULAR;
const API_KEY = process.env.API_KEY;

router.get('/popular', async (req, res) => {
    try {
        const response = await axios.get(API_URL_MOVIE_POPULAR, {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                page: 1
            }
        });

        const movies = response.data.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path,
            voteAverage: movie.vote_average,
            overview: movie.overview,
            releaseDate: movie.release_date,
        }));

        return res.json({
            message: 'Popular movies fetched successfully',
            data: movies,
        });
    } catch (error) {
        console.error('Error in GET /api/movies/popular:', error.response?.data || error.message);
        return res.status(500).json({ message: 'Failed to fetch popular movies from TMDB' });
    }
});

router.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: API_KEY,
                language: 'en-US',
                page: 1,
                query: query,
                include_adult: false,
            }
        });

        const movies = response.data.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path,
            voteAverage: movie.vote_average,
            overview: movie.overview,
            releaseDate: movie.release_date,
        }));

        return res.json({
            message: 'Search movies fetched successfully',
            data: movies,
        });
    } catch (error) {
        console.error('Error in GET /api/movies/search:', error.response?.data || error.message);
        return res.status(500).json({ message: 'Failed to fetch search movies from TMDB' });
    }
});

module.exports = router;
