import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { ICarBuy } from "../../interface";
import { RootState } from "../store/index";
import { createBuyCar, getCarBuys, updateCarBuy, deleteCarBuy } from '../../service/index';

interface carBuyState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;

}

const carBuyAdapter = createEntityAdapter<ICarBuy, string>({
    selectId: (carBuy) => carBuy._id || "",
})

const initialState: carBuyState & EntityState<ICarBuy, string> =
    carBuyAdapter.getInitialState({
        status: 'idle',
        error: null,

    })

export const fetchCarBuys = createAsyncThunk("carBuys/fetchCarBuys", async () => {
    try {
        const response = await getCarBuys();
        return response.data;
    } catch (error: any) {
        return error?.response?.data?.message || "Error fetching carBuys";

    }
})

export const createCarBuyApi = createAsyncThunk("carBuy/createCarBuyApi", async (formData: FormData, { rejectWithValue }) => {
    try {
        const response = await createBuyCar(formData);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || "Error creating carBuy");
    }
})

export const updateCarBuyApi = createAsyncThunk("carBuy/updateCarBuyApi", async (formData: FormData, { rejectWithValue }) => {
    try {
        const response = await updateCarBuy(formData);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || "Error updating carBuy");
    }
})

export const deleteCarBuyApi = createAsyncThunk(
    "carBuy/deleteCarBuyApi",
    async ({ userId, carBuyId }: { userId: string, carBuyId: string }, { rejectWithValue }) => {
        try {
            const response = await deleteCarBuy(userId, carBuyId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Error deleting carBuy");
        }
    }
);


const carBuySlice = createSlice({
    name: 'carBuy',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCarBuys.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCarBuys.fulfilled, (state, action) => {
                carBuyAdapter.setAll(state, action.payload);
                state.status = 'succeeded';

            })
            .addCase(fetchCarBuys.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string || "Error fetching carBuys";
            })
            .addCase(createCarBuyApi.fulfilled, (state, action) => {
                carBuyAdapter.addOne(state, action.payload);
                state.status = 'succeeded';
            })
            builder.addCase(deleteCarBuyApi.fulfilled, (state, action) => {
                const carId = action.meta.arg.carBuyId
                carBuyAdapter.removeOne(state, carId);
                state.status = "succeeded";
            });
            


    }
})


export const { selectAll: displayCarBuys, selectById: displayCarBuyById } = carBuyAdapter.getSelectors<RootState>((state) => state.carBuys);
export default carBuySlice.reducer;


