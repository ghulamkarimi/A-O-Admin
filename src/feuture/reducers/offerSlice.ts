import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { IOffer, TOffer } from "../../interface";
import { RootState, AppDispatch } from "../store/index";
import { getOffers, createOffer as createOfferService, deleteOffer, editOffer, API_URL } from "../../service";




import { io, Socket } from "socket.io-client";
 

export const socket: Socket = io(API_URL, {
    autoConnect: false,
  });

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

export const createOffer = createAsyncThunk(
    "/offer/createOffer",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await createOfferService(formData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Error creating offer");
        }
    }
);
export const deleteOfferApi = createAsyncThunk(
    "/offer/deleteOffer",
    async ({ userId, offerId }: { userId: string, offerId: string }, { rejectWithValue }) => {
        try {
            const response = await deleteOffer(userId, offerId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Fehler beim Löschen des Angebots");
        }
    }
);

export const editOfferApi = createAsyncThunk(
    'offers/editOfferApi',
    async ({ offer, imageFile }: { offer: TOffer, imageFile?: File }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            if (!offer.offerId || !offer.userId) {
                throw new Error("Angebots-ID oder Benutzer-ID fehlt");
            }
            // Füge die Felder aus dem Angebot und der Datei zur FormData hinzu
            formData.append('title', offer.title || "");
            formData.append('description', offer.description || "");
            formData.append('oldPrice', (offer.oldPrice ?? 0).toString());
            formData.append('newPrice', (offer.newPrice ?? 0).toString());
            formData.append('discountPercentage', (offer.discountPercentage ?? 0).toString());
            formData.append('userId', offer.userId || "");
            formData.append('offerId', offer.offerId || "");

            // Wenn ein Bild hochgeladen wurde, füge es der FormData hinzu
            if (imageFile) {
                formData.append('offerImage', imageFile);
            } else {
                formData.append('offerImage', offer.imageUrl || "");  // Verwende das alte Bild, falls kein neues hochgeladen wurde
            }

            // API-Aufruf zur Bearbeitung des Angebots
            const updatedOffer = await editOffer(formData);
            return updatedOffer;
        } catch (error) {
            return rejectWithValue((error as any).message); // Fehlerbehandlung
        }
    }
);

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
            })
            .addCase(createOffer.fulfilled, (state, action) => {
                offerAdapter.addOne(state, action.payload);
            })
            .addCase(deleteOfferApi.fulfilled, (state, action) => {
                offerAdapter.removeOne(state, action.payload.offerId);
            })
            builder.addCase(offerUpdated, (state, action) => {
                const { id, changes } = action.payload;
                const existingOffer = offerAdapter.getSelectors().selectById(state, id);
                if (existingOffer) {
                    Object.assign(existingOffer, changes);
                }
            });
            
    },
});

export const { offerCreated, offerUpdated, offerDeleted } = offerSlice.actions;

export const { selectAll: displayOffers, selectById: displayOfferById } = offerAdapter.getSelectors<RootState>((state) => state.offer);
export default offerSlice.reducer;


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
