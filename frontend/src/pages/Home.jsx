import api from "../lib/api";
import TextType from "../components/TextType";
import LightRays from "../components/LightRays";
import DomeGallery from "../components/DomeGallery";
import Navbar from "../components/Navbar";
import CurvedLoop from "../components/CurvedLoop";
import { useState, useEffect } from "react";
import AnimatedContent from "../components/AnimatedContent";
import ChromaGrid from "../components/ChromaGrid";
import formatDate from "../utils/formatDate";
import { Button } from "flowbite-react";

const base_image_url = import.meta.env.VITE_BASE_URL_IMG;

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(false);
  const [loadingFavId, setLoadingFavId] = useState(null);

  const triggerAlert = (message) => {
    setMessage(message);
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 3000);
  };

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      triggerAlert("");
      return;
    }

    if (query.length < 3) {
      setSearchResults([]);
      triggerAlert("Search query must be at least 3 characters long");
      return;
    }

    setLoading(true);
    triggerAlert("");

    const timeoutId = setTimeout(async () => {
      try {
        const response = await api.get("/movies/search", {
          params: {
            query,
          },
        });
        setSearchResults(response.data.data || []);
        if (response.data.data.length === 0) {
          triggerAlert("No results found");
        }
        console.log();
      } catch (error) {
        console.error("Error fetching search results:", error);
        const message = error.response?.data?.message || "No results found";
        triggerAlert(message);
      }
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleAddFavorite = async (movie) => {
    setLoadingFavId(movie.id);

    try {
      await api.post("/favorites", {
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.posterPath,
        voteAverage: movie.voteAverage,
      });
      triggerAlert(`${movie.title} added to favorites`);
    } catch (error) {
      console.error(error);
      const message = error.response.data.message || "Failed to add favorite";
      triggerAlert(message);
    } finally {
      setLoadingFavId(null);
    }
  };

  return (
    <div className="bg-black overflow-hidden">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clipRule="evenodd"
              />
            </svg>
            {message}
          </div>
        </AnimatedContent>
      )}
      <div style={{ width: "100%", height: "100vh", position: "relative" }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>
      <Navbar />
      <TextType
        text={[
          "Welcome to MoovyApp",
          "Your one-stop destination for all your movie needs",
        ]}
        typingSpeed={75}
        pauseDuration={1500}
        showCursor={true}
        cursorCharacter="|"
        className="absolute top-70 left-0 text-white text-6xl font-bold w-2/3 px-10"
      />
      <div
        style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}
      >
        <DomeGallery />
      </div>
      <CurvedLoop marqueeText="Search all movies ※" />
      <div className="flex justify-center items-center my-15">
        <input
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search"
          className="w-1/3 p-4 bg-white/10 border border-white rounded-full focus:outline-none focus:ring-2 focus:ring-white shadow-lg shadow-black/20"
        />
      </div>
      {loading && (
        <div className="flex justify-center items-center h-10">
          <div className="w-10 h-10 border-2 border-white rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && searchResults.length > 0 && (
        <div className="flex flex-wrap justify-center gap-8">
          {searchResults.map((movie) => (
            <div
              key={movie.id}
              style={{
                height: "100%",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <ChromaGrid
                items={[
                  {
                    image: movie.posterPath
                      ? `${base_image_url}${movie.posterPath}`
                      : "/poster.png",
                    title:
                      movie.title.length > 25
                        ? movie.title.slice(0, 25) + "..."
                        : movie.title,
                    subtitle: formatDate(movie.releaseDate),
                    handle: movie.voteAverage.toFixed(1),
                    borderColor: "#3B82F6",
                    gradient: "linear-gradient(145deg, #3B82F6, #000)",
                  },
                ]}
                radius={500}
                damping={1}
                fadeOut={0.3}
                ease="power3.out"
              />
              <Button
                onClick={() => handleAddFavorite(movie)}
                className="absolute bottom-1 right-0 z-50 focus:ring-0 cursor-pointer"
                color="info"
                size="sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M2 6.342a3.375 3.375 0 0 1 6-2.088 3.375 3.375 0 0 1 5.997 2.26c-.063 2.134-1.618 3.76-2.955 4.784a14.437 14.437 0 0 1-2.676 1.61c-.02.01-.038.017-.05.022l-.014.006-.004.002h-.002a.75.75 0 0 1-.592.001h-.002l-.004-.003-.015-.006a5.528 5.528 0 0 1-.232-.107 14.395 14.395 0 0 1-2.535-1.557C3.564 10.22 1.999 8.558 1.999 6.38L2 6.342Z" />
                </svg>
                {loadingFavId === movie.id ? "Adding..." : "Add to Favorite"}
              </Button>
            </div>
          ))}
        </div>
      )}

      {!loading && searchResults.length === 0 && query && (
        <p className="text-white text-2xl font-bold text-center">
          No results found for "${query}"
        </p>
      )}
    </div>
  );
}
