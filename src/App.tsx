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
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRouteProps "; 
import PasswordResetPage from "./pages/PasswordResetPage";
import LogoutComponent from "./components/LogoutComponent";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect(); // Sichere Verbindung
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
  <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
  <Route path="/offers" element={<ProtectedRoute><OfferList /></ProtectedRoute>} />
  <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
  <Route path="/carBuy" element={<ProtectedRoute><CarBuy /></ProtectedRoute>} />
  <Route path="/carRent" element={<ProtectedRoute><CarRent /></ProtectedRoute>} />
   <Route path="/forgetPassword" element={<PasswordResetPage />} />
   <Route path="/logout" element={<LogoutComponent />} />
  <Route path="/login" element={<Login />} />
</Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
