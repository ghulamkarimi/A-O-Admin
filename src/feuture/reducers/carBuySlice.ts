import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { ICarBuy} from "../../interface";
import {  RootState } from "../store/index";
import { createBuyCar, getCarBuys } from '../../service/index';

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
            .addCase(createCarBuyApi.fulfilled,(state,action)=> {
                carBuyAdapter.addOne(state, action.payload);
                state.status = 'succeeded';
            })
          

    }
})


export const { selectAll: displayCarBuys, selectById: displayCarBuyById } = carBuyAdapter.getSelectors<RootState>((state) => state.carBuys);
export default carBuySlice.reducer;


