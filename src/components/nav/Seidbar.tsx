import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const CustomSidebar = () => {
    const location = useLocation();
    const userId = localStorage.getItem("userAdmin") === "true";

    const [isCarRentDropdownOpen, setIsCarRentDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsCarRentDropdownOpen(!isCarRentDropdownOpen);
    };

    return (
        <div className="hidden md:flex min-h-screen h-full w-52 bg-gray-800 text-white flex-col fixed">

            {/* Sidebar Header */}
            <div className="p-6 bg-gray-900">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/home"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/" ? "bg-gray-700" : ""}`}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/offers"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/offers" ? "bg-gray-700" : ""}`}
                        >
                            Angebote
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/appointment"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/appointment" ? "bg-gray-700" : ""}`}
                        >
                            Termine
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/users"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/users" ? "bg-gray-700" : ""}`}
                        >
                            Benutzer
                        </Link>
                    </li>

                    {/* Dropdown für Autovermietung */}
                    <li>
                        <div
                            className={`block px-4 py-2 rounded hover:bg-gray-700 cursor-pointer ${isCarRentDropdownOpen ? "bg-gray-700" : ""}`}
                            onClick={toggleDropdown}
                        >
                            <span className="flex justify-between items-center">
                            <span>Autovermietung</span> 
                            <span><IoIosArrowDropdownCircle className={`text-xl transition-transform duration-300 ${isCarRentDropdownOpen ? "rotate-180" : ""}`}/></span>
                            </span>
                        </div>
                        {isCarRentDropdownOpen && (
                            <ul className="ml-3 space-y-1">
                                <li>
                                    <Link
                                        to="/carRentsList"
                                        className={`block px-4 mt-2 py-2 rounded hover:bg-yellow-500 ${location.pathname === "/carRentsList" ? "bg-orange-500" : ""}`}
                                    >
                                        Autoliste
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/createCarRent"
                                        className={`block px-4 py-2 rounded hover:bg-yellow-500 ${location.pathname === "/createCarRent" ? "bg-orange-500" : ""}`}
                                    >
                                        Auto hinzufügen
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <Link
                            to="/carBuy"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/carBuy" ? "bg-gray-700" : ""}`}
                        >
                            Auto An- & Verkaufen
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/login"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/login" ? "bg-gray-700" : ""} ${userId ? "hidden" : "block"}`}
                        >
                            Login
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/logout"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/logout" ? "bg-gray-700" : ""}`}
                        >
                            Logout
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 bg-gray-900 flex items-center gap-4">
                <p className="text-xs text-gray-400">Admin Panel © 2024</p>
                <img src="/logo.png" alt="Logo" className="w-10 h-10 mb-4 rounded-full mt-4 " />
            </div>
        </div>
    );
};

export default CustomSidebar;
