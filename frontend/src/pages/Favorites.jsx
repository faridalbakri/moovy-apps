import { Button } from "flowbite-react";
import Navbar from "../components/Navbar";
import formatDate from "../utils/formatDate";
import ChromaGrid from "../components/ChromaGrid";
import AnimatedContent from "../components/AnimatedContent";
import useFavoritesMovie from "../hooks/useFavoritesMovie";

const base_image_url = import.meta.env.VITE_BASE_URL_IMG;

export default function Favorites() {
    const { favorites, loading, alert, message, removeFavId, handleRemoveFavorite } = useFavoritesMovie();

    return (
        <div className="bg-black">
            {alert && (
                <AnimatedContent
                    distance={150}
                    direction="horizontal"
                    reverse={false}
                    duration={1.2}
                    ease="power3.out"
                    initialOpacity={0.2}
                    animateOpacity
                    scale={1.1}
                    threshold={0.2}
                    delay={0.3}
                    className="p-4.5 rounded-full w-fit fixed top-5 right-5 bg-black/20 shadow-lg shadow-black/20 backdrop-blur-lg z-50"
                >
                    <div className="flex gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
                        </svg>
                        {message}
                    </div>
                </AnimatedContent>
            )}
            <Navbar />
            <h1 className="pt-30 pb-15 text-2xl font-bold text-white text-center">Favorites Movies</h1>
            {!loading && favorites.length === 0 && (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-white text-center">You have no favorites</p>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-8">

                    {favorites.map((favorite) => (
                        <div key={favorite.id} style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                            <ChromaGrid
                                items={[
                                    {
                                        image: `${base_image_url}${favorite.posterPath}`,
                                        title: favorite.title.length > 25 ? favorite.title.slice(0, 25) + '...' : favorite.title,
                                        subtitle: formatDate(favorite.releaseDate),
                                        handle: favorite.voteAverage.toFixed(1),
                                        borderColor: "#3B82F6",
                                        gradient: "linear-gradient(145deg, #3B82F6, #000)",
                                    }
                                ]}
                                radius={500}
                                damping={1}
                                fadeOut={0.3}
                                ease="power3.out"
                            />
                            <Button onClick={() => handleRemoveFavorite(favorite.id)} className="absolute bottom-1 right-0 z-50 focus:ring-0 cursor-pointer" color="info" size="sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                <path d="M2 6.342a3.375 3.375 0 0 1 6-2.088 3.375 3.375 0 0 1 5.997 2.26c-.063 2.134-1.618 3.76-2.955 4.784a14.437 14.437 0 0 1-2.676 1.61c-.02.01-.038.017-.05.022l-.014.006-.004.002h-.002a.75.75 0 0 1-.592.001h-.002l-.004-.003-.015-.006a5.528 5.528 0 0 1-.232-.107 14.395 14.395 0 0 1-2.535-1.557C3.564 10.22 1.999 8.558 1.999 6.38L2 6.342Z" />
                            </svg>
                                {loading === favorite.id ? 'Removing...' : 'Remove from Favorite'}</Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}