import { Button, Label } from "flowbite-react";
import LightRays from "../components/LightRays";
import AnimatedContent from "../components/AnimatedContent";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Navbar from "../components/Navbar";

export default function Register() {
    const navigate = useNavigate();
    const [alert, setAlert] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const triggerAlert = (message) => {
        setMessage(message);
        setAlert(true);
        const timeout = setTimeout(() => setAlert(false), 3000);
        return () => clearTimeout(timeout);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (password !== confirmPassword) {
            triggerAlert("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            await api.post("/auth/register", { name, email, password });
            navigate("/login", { state: { message: 'Register successfully, please login' } });
        } catch (error) {
            console.error('registerError', error);
            triggerAlert(error?.response?.data?.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: 'black' }}>
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
                    className="p-4.5 rounded-full w-fit absolute top-5 right-5 bg-black/20 shadow-lg shadow-black/20"
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
            <LightRays
                raysOrigin="top-center"
                raysColor="#fff"
                raysSpeed={1}
                lightSpread={1}
                rayLength={10}
                followMouse={true}
                mouseInfluence={0.1}
                noiseAmount={0.1}
                distortion={0.05}
                className="custom-rays"
            />
            <div className="absolute top-35 left-1/2 transform -translate-x-1/2 w-100 text-white  backdrop-blur-xl  shadow-lg shadow-black/30 border border-black/20 rounded-xl z-50">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-black/20 rounded-xl">
                    <h1 className="text-2xl font-bold">Register</h1>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="name">Name</Label>
                        </div>
                        <input className="bg-white/10 rounded-md p-2 w-full focus:outline-white focus:border-black/20"
                            id="name"
                            type="text"
                            autoComplete="off"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email">Email</Label>
                        </div>
                        <input className="bg-white/10 rounded-md p-2 w-full focus:outline-white focus:border-black/20"
                            id="email"
                            type="email"
                            autoComplete="off"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <input className="bg-white/10 rounded-md p-2 w-full focus:outline-white focus:border-black/20" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                        </div>
                        <input className="bg-white/10 rounded-md p-2 w-full focus:outline-white focus:border-black/20" id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" disabled={loading}>{loading ? "Loading..." : "Register"}</Button>
                </form>
            </div>
        </div>
    );
}
