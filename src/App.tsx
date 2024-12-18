import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomSidebar from "./components/nav/Seidbar";
import ResponsiveNavbar from "./components/nav/ResponsiveNavbar";
import HomePage from "./pages/HomePage";
import OfferList from "./pages/OfferList ";
import UserList from "./pages/UserList ";
import CarRent from "./pages/CarRent";
import CarBuy from "./pages/CarBuy";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRouteProps "; 
import PasswordResetPage from "./pages/PasswordResetPage";
import LogoutComponent from "./components/LogoutComponent";
import Appointment from "./pages/Appointment";
import UserDetails from "./pages/UserDetails";
import CreateCarBuy from "./pages/CreateCarBuy";
import UpdateCarBuy from "./pages/UpdateCarBuy";



const App = () => {


  

  return (
    <Router>
      <div className="flex">
        <CustomSidebar />
        <ResponsiveNavbar />
        <div className="flex-1 md:ml-52 p-8 mt-16 md:mt-0">
<Routes>
  <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
  <Route path="/offers" element={<ProtectedRoute><OfferList /></ProtectedRoute>} />
  <Route path="/appointment" element={<ProtectedRoute><Appointment /></ProtectedRoute>} />
  <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
  <Route path="/user-details/:userId" element={<ProtectedRoute><UserDetails  /></ProtectedRoute>} />
  <Route path="/carBuy" element={<ProtectedRoute><CarBuy /></ProtectedRoute>} />
  <Route path="/create-car" element={<ProtectedRoute><CreateCarBuy /></ProtectedRoute>} />
  <Route path="/edit-car/:id" element={<ProtectedRoute><UpdateCarBuy /></ProtectedRoute>} />
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
