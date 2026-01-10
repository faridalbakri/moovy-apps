import { useEffect, useState } from "react";
import api from "../lib/api";

export default function useFavoritesMovie() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [removeFavId, setRemoveFavId] = useState(null);

    const triggerAlert = (message) => {
        setMessage(message);
        setAlert(true);
        setTimeout(() => setAlert(false), 3000);
    };

    const fetchFavorites = async () => {
        setLoading(true);

        try {
            const response = await api.get('/favorites');
            setFavorites(response.data.data || []);
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Failed to fetch favorites";
            triggerAlert(message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (favoriteId) => {
        setRemoveFavId(favoriteId);

        try {
            await api.delete(`/favorites/${favoriteId}`);
            setFavorites((prevFavorites) =>
                prevFavorites.filter((fav) => fav.id !== favoriteId)
            );
            triggerAlert('Movie removed from favorites');
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Failed to remove favorite";
            triggerAlert(message);
        } finally {
            setRemoveFavId(null);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return {
        favorites,
        loading,
        alert,
        message,
        removeFavId,
        refetch: fetchFavorites,
        handleRemoveFavorite,
    };
};
