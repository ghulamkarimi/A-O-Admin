import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { IOffer } from "../../interface";
import { RootState, AppDispatch } from "../store/index"; // AppDispatch importieren
import { getOffers } from "../../service";
import { socket } from "../../service"; // Verwende die korrekte Instanz von socket

interface OfferState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const offerAdapter = createEntityAdapter<IOffer, string>({
    selectId: (offer) => offer._id || "",
});

const initialState: OfferState & EntityState<IOffer, string> = offerAdapter.getInitialState({
    status: 'idle',
    error: null,
});

export const fetchOffers = createAsyncThunk("/offer/fetchOffers", async () => {
    try {
        const response = await getOffers();
        return response.data;
    } catch (error: any) {
        return error?.response?.data?.message || "Error fetching offers";
    }
});

const offerSlice = createSlice({
    name: "offer",
    initialState,
    reducers: {
        offerCreated: offerAdapter.addOne,
        offerUpdated: offerAdapter.updateOne,
        offerDeleted: offerAdapter.removeOne,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOffers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOffers.fulfilled, (state, action) => {
                offerAdapter.setAll(state, action.payload);
                state.status = 'succeeded';
            })
            .addCase(fetchOffers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string || "Error fetching offers";
            });
    }
});

export const { offerCreated, offerUpdated, offerDeleted } = offerSlice.actions;

export const { selectAll: displayOffers, selectById: displayOfferById } = offerAdapter.getSelectors<RootState>((state) => state.offer);
export default offerSlice.reducer;

// WebSocket-Ereignisse abonnieren und Aktionen dispatchen
export const subscribeToSocketEvents = (dispatch: AppDispatch) => {
    socket.on('offerCreated', (newOffer: IOffer) => {
        dispatch(offerCreated(newOffer));
    });

    socket.on('offerUpdated', (updatedOffer: IOffer) => {
        dispatch(offerUpdated({ id: updatedOffer._id, changes: updatedOffer }));
    });

    socket.on('offerDeleted', (deletedOfferId: string) => {
        dispatch(offerDeleted(deletedOfferId));
    });
};
