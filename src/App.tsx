import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomSidebar from "./components/nav/Seidbar";
import ResponsiveNavbar from "./components/nav/ResponsiveNavbar";
import HomePage from "./pages/HomePage";
import OfferList from "./pages/OfferList ";
import UserList from "./pages/UserList ";
import CarRent from "./pages/CarRent";
import CarBuy from "./pages/CarBuy";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./feuture/store";
import { useEffect } from "react";
import { subscribeToSocketEvents } from "./feuture/reducers/offerSlice";
import { socket } from "./service";
import Register from "./pages/Register";
import Login from "./pages/Login";

const App = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!socket.connected) {
        socket.connect();  // Sichere Verbindung
    }

    subscribeToSocketEvents(dispatch);

    return () => {
        socket.off("offerCreated");
        socket.off("offerUpdated");
        socket.off("offerDeleted");
    };
}, [dispatch]);


  return (
    <Router>
      <div className="flex">
        {/* Sidebar für größere Bildschirme */}
        <CustomSidebar />

        {/* Navbar für mobile Bildschirme */}
        <ResponsiveNavbar />

        {/* Main Content */}
        <div className="flex-1 md:ml-52 p-8 mt-16 md:mt-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/offers" element={<OfferList />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/carBuy" element={<CarBuy />} />
            <Route path="/carRent" element={<CarRent />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
