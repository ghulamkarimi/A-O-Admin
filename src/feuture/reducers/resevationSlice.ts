import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { IReservation, TReservation } from "../../interface";
import { getReservation, updateStatusReservation } from "../../service";
import { RootState } from "../store";


export interface IReservationState {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    reservationId: string | null
}



const reservationAdapter = createEntityAdapter<IReservation, string>({
    selectId: (reservation) => reservation?._id || "",
});

const initialState: IReservationState & EntityState<IReservation, string> = reservationAdapter.getInitialState({
    status: "idle",
    error: null,
    reservationId: ""
})


export const getReservationApi = createAsyncThunk("/reservation/getReservationApi", async () => {
    try {
        const response = await getReservation()
        return response.data

    } catch (error: any) {
        return error.message
    }
})

export const updateStatusReservationApi = createAsyncThunk(
    "/reservation/updateStatusReservationApi",
    async (reservation: TReservation, { rejectWithValue }) => {
        try {
            const response = await updateStatusReservation(reservation);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fehler beim Aktualisieren der Reservierung"
            );
        }
    }
);


const reservationSlice = createSlice({
    name: "reservation",
    initialState,
    reducers: {
        setReservationId: (state, action) => {
            state.reservationId = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getReservationApi.pending, (state) => {
            state.status = "loading";
        })
        builder.addCase(getReservationApi.fulfilled, (state, action) => {
           
            state.status = "succeeded";

            if (action.payload?.reservation) {
                reservationAdapter.setAll(state, action.payload.reservation);
            } else {
                console.error("Keine Reservierungen gefunden!");

            }
        })

        builder.addCase(getReservationApi.rejected, (state, action) => {
            state.status = "failed",
                state.error = action.error.message || "reservation loading failed"
        })
        builder.addCase(updateStatusReservationApi.fulfilled, (state, action) => {
            console.log("API Response Payload:", action.payload);
            if (action.payload && action.payload.reservation) {
                state.status = "succeeded";
                reservationAdapter.updateOne(state, {
                    id: action.payload.reservation._id,
                    changes: action.payload.reservation,
                });
            } else {
                console.error("Fehler: Ungültige API-Antwort", action.payload);
            }
        });

    }
})

export const { setReservationId } = reservationSlice.actions
export const { selectAll: AllReservation, selectById: getOneReservation } = reservationAdapter.getSelectors((state: RootState) => state.reservation)


export default reservationSlice.reducer