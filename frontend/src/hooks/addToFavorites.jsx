import { useEffect, useState } from "react";
import api from "../lib/api";

export default function addToFavorites(movieId) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const addToFavorites = async () => {
        setLoading(true);
        setMessage(null);
        try {
            await api.post("/favorite", {
                movieId: movieId,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
            });
            setMessage(`Added ${movie.title} to favorite`);
        } catch (error) {
            console.error(error);
            setMessage(error.response.data.message || "Failed to add to favorite");
        } finally {
            setLoading(false);
        }
    };

    return { addToFavorites, loading, message };
}