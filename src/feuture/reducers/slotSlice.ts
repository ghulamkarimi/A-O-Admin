import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSlots, blockSlot, unblockSlot, confirmSlot, socket } from "../../service/index";
import { AppDispatch } from "../store";

// Initialer Zustand
interface SlotState {
    slots: any[];
    loading: boolean;
    error: string | null;
}

const initialState: SlotState = {
    slots: [],
    loading: false,
    error: null,
};

// Thunks
export const fetchAllSlots = createAsyncThunk("slots/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const response = await fetchSlots();
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Fehler beim Abrufen der Slots");
    }
});

export const blockSlotById = createAsyncThunk("slots/block", async (slotId: string, { rejectWithValue }) => {
    try {
        const response = await blockSlot(slotId);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Fehler beim Blockieren des Slots");
    }
});

export const unblockSlotById = createAsyncThunk("slots/unblock", async (slotId: string, { rejectWithValue }) => {
    try {
        const response = await unblockSlot(slotId);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Fehler beim Freigeben des Slots");
    }
});

export const confirmSlotById = createAsyncThunk("slots/confirm", async (slotId: string, { rejectWithValue }) => {
    try {
        const response = await confirmSlot(slotId);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Fehler beim Bestätigen des Slots");
    }
});


export const subscribeToSlotSocketEvents = (dispatch: AppDispatch) => {
    socket.on("slotUpdated", (updatedSlot: any) => {
        dispatch(updateSlot(updatedSlot));
    });
};

// Slice
const slotSlice = createSlice({
    name: "slots",
    initialState,
    reducers: {
        // WebSocket-Updates
        updateSlot(state, action) {
            const updatedSlot = action.payload;
            state.slots = state.slots.map((slot) =>
                slot._id === updatedSlot._id ? updatedSlot : slot
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSlots.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllSlots.fulfilled, (state, action) => {
                state.loading = false;
                state.slots = action.payload;
            })
            .addCase(fetchAllSlots.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(blockSlotById.fulfilled, (state, action) => {
                state.slots = state.slots.map((slot) =>
                    slot._id === action.payload._id ? action.payload : slot
                );
            })
            .addCase(unblockSlotById.fulfilled, (state, action) => {
                state.slots = state.slots.map((slot) =>
                    slot._id === action.payload._id ? action.payload : slot
                );
            })
            .addCase(confirmSlotById.fulfilled, (state, action) => {
                state.slots = state.slots.map((slot) =>
                    slot._id === action.payload._id ? action.payload : slot
                );
            });
    },
});

export const { updateSlot } = slotSlice.actions;

export default slotSlice.reducer;
