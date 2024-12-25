import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi"; // Installiere react-icons mit "npm install react-icons"

const ResponsiveNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const userId = localStorage.getItem("userId");

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="bg-gray-800 text-white fixed top-0 left-0 right-0 p-4 z-50 md:hidden">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <button onClick={toggleMenu} className="text-3xl">
                    <HiMenu />
                </button>
            </div>
            {isOpen && (
                <nav className="mt-4">
                    <ul className="space-y-4">
                        <li>
                            <Link to="/home" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-gray-700 rounded">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/offers" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-gray-700 rounded">
                                Angebote
                            </Link>
                        </li>
                        <li>
                            <Link to="/appointment" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-gray-700 rounded">
                                Termine
                            </Link>
                        </li>
                        <li>
                            <Link to="/users" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-gray-700 rounded">
                                Benutzer
                            </Link>
                        </li>
                        <li>
                            <Link to="/carRent" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-gray-700 rounded">
                                Fahrzeuge vermieten
                            </Link>
                        </li>
                        <li>
                            <Link to="/carBuy" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-gray-700 rounded">
                                Fahrzeuge verkaufen
                            </Link>
                        </li> 
                        <li>
                            <Link to="/forgetPassword" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-gray-700 rounded">
                                Passwort vergessen
                            </Link>
                        </li>
                        <li>
                            <Link 
                            
                            to="/login" onClick={() => setIsOpen(false)} 
                            className={` px-4 py-2 hover:bg-gray-700 rounded ${userId ? "hidden" : "block"}`}	
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/logout" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-gray-700 rounded">
                                Logout
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default ResponsiveNavbar;
