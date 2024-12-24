import { configureStore } from "@reduxjs/toolkit";
import offerReducer, { fetchOffers } from "../reducers/offerSlice";
import userReducer, { checkAccessTokenApi, fetchUsers, setToken } from "../reducers/userSlice";
import appointmentReducer, { fetchAppointments } from "../reducers/appointmentSlice";
import {  refreshToken } from "../../service";
import carBuyReducer, { fetchCarBuys } from "../reducers/carBuySlice";
import axiosJWT from "../../service/axiosJwt";
import reservationSlice, { getReservationApi } from "../reducers/resevationSlice"


export const store = configureStore({
  reducer: {
      offer: offerReducer,
      users: userReducer,
      carBuys: carBuyReducer,
      appointment: appointmentReducer,
      reservation: reservationSlice
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
})
axiosJWT.interceptors.request.use(
  async (config) => {
    const currentDate = new Date();
    const exp = localStorage.getItem("exp");
    console.log("exp",exp)
    if (Number(exp) * 1000 > currentDate.getDate()) {
      const response = await refreshToken();
      console.log("responseStore",response)
      config.headers.Authorization = `Bearer ${response.data.refreshToken}`;
      store.dispatch(setToken(response.data.refreshToken));
      // store.dispatch(setUserInfoRefresh(response.data.userInfo_refresh));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
Promise.all([
  store.dispatch(fetchUsers()),
  store.dispatch(fetchCarBuys()),
  store.dispatch(fetchOffers()),
  store.dispatch(fetchAppointments()),
  store.dispatch(getReservationApi()),
  store.dispatch(checkAccessTokenApi())
])
  .then(() => {
    console.log("Alle API-Aufrufe erfolgreich abgeschlossen.");
    // Weiterer Code hier
  })
  .catch((error) => {
    console.error("Fehler bei einem der API-Aufrufe:", error);
  });



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;