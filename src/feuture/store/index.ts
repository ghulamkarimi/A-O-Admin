import { configureStore } from "@reduxjs/toolkit";
import offerReducer, { fetchOffers } from "../reducers/offerSlice";
import userReducer, { fetchUsers } from "../reducers/userSlice";
import slotReducer , {fetchAllSlots} from "../reducers/slotSlice";
import axiosJWT from "../../service/axiosJwt";
import {  refreshToken } from "../../service";
import { jwtDecode } from "jwt-decode";


interface DecodedToken {
    exp: number;
    [key: string]: any;
  }

export const store = configureStore({
    reducer: {
        offer: offerReducer,
        users: userReducer,
        slots: slotReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
})
axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date().getTime();
      const exp = localStorage.getItem("exp");
  
      if (exp && Number(exp) * 1000 < currentDate) {
        const response = await refreshToken();
        console.log("Token refreshed", response.data.accessToken);
  
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        console.log("Token refreshed header", response.data.accessToken);
        const decodedToken = jwtDecode<DecodedToken>(response.data.accessToken);
        localStorage.setItem("exp", decodedToken.exp.toString());
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );
  

store.dispatch(fetchOffers());
store.dispatch(fetchUsers());
store.dispatch(fetchAllSlots())

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;