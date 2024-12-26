import { Routes, Route, useNavigate } from "react-router-dom";
import CustomSidebar from "./components/nav/Seidbar";
import ResponsiveNavbar from "./components/nav/ResponsiveNavbar";
import HomePage from "./pages/HomePage";
import OfferList from "./pages/OfferList ";
import UserList from "./pages/UserList ";

import CarBuy from "./pages/CarBuy";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRouteProps ";
import PasswordResetPage from "./pages/PasswordResetPage";
import LogoutComponent from "./components/LogoutComponent";
import Appointment from "./pages/Appointment";
import UserDetails from "./pages/UserDetails";
import CreateCarBuy from "./pages/CreateCarBuy";
import UpdateCarBuy from "./pages/UpdateCarBuy";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./feuture/store";
import { checkAccessTokenApi, setUserId } from "./feuture/reducers/userSlice";
import CarRentsList from "./pages/CarRentsList";
import CreateCarRents from "./pages/CreateCarrents";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
 
  const userAdmin = localStorage.getItem("userAdmin") === "true";

  useEffect(() => {
    const path = window.location.pathname;
    if (path !== "/forgetPassword") {
      const checkUserIsLogin = async () => {
        try {
          await dispatch(checkAccessTokenApi()).unwrap();
          
          // Wenn der User kein Admin ist, leite zum Login um
          if (!userAdmin) {
            navigate("/login");
          }
        } catch (error: any) {
          localStorage.clear();
          dispatch(setUserId(""));
          navigate("/login");
        }
      };
      checkUserIsLogin();
    }
  }, [dispatch, navigate, userAdmin]);


  return (
    <div className="flex w-full">
      {/* Sidebar und Navbar nur für Admins sichtbar */}
      <div className={`${userAdmin ? "block" : "hidden"} `}>
        <CustomSidebar />
      </div>

      <div className={`${userAdmin ? "block" : "hidden"} `}>
        <ResponsiveNavbar />
      </div>

      <div className={`${userAdmin ? "md:ml-52 flex-1 p-8 mt-16 md:mt-0 " : "flex-1 "}`}>
        <Routes>
          {/* Nur für Admins */}
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/offers" element={<ProtectedRoute><OfferList /></ProtectedRoute>} />
          <Route path="/appointment" element={<ProtectedRoute><Appointment /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="/user-details/:userId" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
          <Route path="/carBuy" element={<ProtectedRoute><CarBuy /></ProtectedRoute>} />
          <Route path="/create-car" element={<ProtectedRoute><CreateCarBuy /></ProtectedRoute>} />
          <Route path="/edit-car/:id" element={<ProtectedRoute><UpdateCarBuy /></ProtectedRoute>} />
          <Route path="/carRentsList" element={<ProtectedRoute><CarRentsList /></ProtectedRoute>} />
          <Route path="/createCarRent" element={<ProtectedRoute><CreateCarRents /></ProtectedRoute>} />

          {/* Öffentlich zugängliche Seiten */}
          <Route path="/forgetPassword" element={<PasswordResetPage />} />
          <Route path="/logout" element={<LogoutComponent />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
