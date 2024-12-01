import { configureStore } from "@reduxjs/toolkit";
import offerReducer, { fetchOffers } from "../reducers/offerSlice";

export const store = configureStore({
    reducer: {
        offer: offerReducer,
    },
})

store.dispatch(fetchOffers());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;