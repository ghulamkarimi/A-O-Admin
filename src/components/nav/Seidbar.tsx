import { Link, useLocation } from "react-router-dom";

const CustomSidebar = () => {
    const location = useLocation();
    const userId = localStorage.getItem("userId");

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
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/" ? "bg-gray-700" : ""
                                }`}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/offers"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/offers" ? "bg-gray-700" : ""
                                }`}
                        >
                            Angebote
                        </Link>
                    </li>


                    <li>
                        <Link
                            to="/appointment"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/appointment" ? "bg-gray-700" : ""
                                }`}
                        >
                            Termine
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/users"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/users" ? "bg-gray-700" : ""
                                }`}
                        >
                            Benutzer
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/carRent"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/cars" ? "bg-gray-700" : ""
                                }`}
                        >
                            Autovermietung
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/carBuy"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/cars" ? "bg-gray-700" : ""
                                }`}
                        >
                            Auto An- & Verkaufen
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/forgetPassword"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/cars" ? "bg-gray-700" : ""
                                }`}
                        >
                            Passwort vergessen
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/login"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/cars" ? "bg-gray-700" : ""
                                } ${userId ? "hidden" : "block"}
                                
                                `}
                        >
                            Login
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/logout"
                            className={`block px-4 py-2 rounded hover:bg-gray-700 ${location.pathname === "/cars" ? "bg-gray-700" : ""
                                }`}
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
        </div >
    );
};

export default CustomSidebar;
