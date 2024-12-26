import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { IoIosArrowDropdownCircle } from "react-icons/io";  // Dropdown Icon

const ResponsiveNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // Zustand für Dropdown
    const userId = localStorage.getItem("userAdmin") === "true";

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
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

                        {/* Dropdown für Fahrzeuge vermieten */}
                        <li>
                            <div
                                onClick={toggleDropdown}
                                className="flex items-center justify-between px-4 py-2 rounded hover:bg-gray-700 cursor-pointer"
                            >
                                <span>Fahrzeuge vermieten</span>
                                <IoIosArrowDropdownCircle
                                    className={`text-xl transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </div>
                            {isDropdownOpen && (
                                <ul className="ml-5 space-y-2 mt-2">
                                    <li>
                                        <Link
                                            to="/carRentsList"
                                            onClick={() => {
                                                setIsOpen(false);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`block px-4 py-2 rounded hover:bg-yellow-500 ${location.pathname === "/carRentsList" ? "bg-orange-500" : ""}`}
                                        >
                                            Autoliste
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/createCarRent"
                                            onClick={() => {
                                                setIsOpen(false);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`block px-4 py-2 rounded hover:bg-yellow-500 ${location.pathname === "/createCarRent" ? "bg-orange-500" : ""}`}
                                        >
                                            Auto hinzufügen
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li>
                            <Link to="/carBuy" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:bg-gray-700 rounded">
                                Fahrzeuge verkaufen
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-2 hover:bg-gray-700 rounded ${userId ? "hidden" : "block"}`}
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
