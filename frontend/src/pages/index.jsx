const API_URL_MOVIE_POPULAR = import.meta.env.VITE_API_URL_MOVIE_POPULAR;
const READ_ACCESS_TOKEN = import.meta.env.VITE_READ_ACCESS_TOKEN;

export async function getMovieList() {
    try {
        const response = await fetch(API_URL_MOVIE_POPULAR, {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${READ_ACCESS_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        return data.results;
    } catch (err) {
        console.error("Gagal memuat daftar film:", err);
        return [];
    }
}

export async function getPopularMovies() {
    try {
        const response = await fetch(API_URL_MOVIE_POPULAR, {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${READ_ACCESS_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch popular movies${response.status}`);
        }

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        return [];
    }
}