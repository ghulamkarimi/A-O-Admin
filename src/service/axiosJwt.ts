import axios from "axios";

const axiosJWT = axios.create({
  baseURL: "https://car-db.aundoautoservice.de ",
   //baseURL: "http://localhost:7004",
  withCredentials: true,
});
axiosJWT.interceptors.request.use;

export default axiosJWT;
