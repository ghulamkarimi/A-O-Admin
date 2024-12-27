import axios from "axios";

const axiosJWT = axios.create({
  baseURL: "https://car-db.aundoautoservice.de ",
  withCredentials: true,
});
axiosJWT.interceptors.request.use;

export default axiosJWT;
