import { useEffect, useState } from "react";
import api from "../lib/api";

export default function usePopularMovies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const response = await api.get("/movies/popular");
            setMovies(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    return { movies, loading, refetch: fetchMovies };
}   