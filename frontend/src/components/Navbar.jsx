
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";


export default function Navbar() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    return (
        <div className="fixed w-1/2 top-5 left-1/2 transform -translate-x-1/2 text-white bg-black/20 backdrop-blur-xl shadow-lg shadow-black/30 px-8 py-4 border border-black/20 rounded-full overflow-hidden z-50">
            <div className="flex justify-between">
                <Link className="text-xl font-bold" to="/">MoovyApp</Link>
                <div className="flex gap-10">
                    {!user ? (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/">Home</Link>
                            <Link to="/movies">Movies</Link>
                            <Link to="/favorites">Favorites</Link>
                            <Link to="#" onClick={logout}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
                            </svg>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}