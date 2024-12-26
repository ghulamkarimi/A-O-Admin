import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { ICarRent } from "../../interface";
import { createCarRent, getCarRents } from "../../service";
import { RootState } from "../store";

interface RentState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;

}

const rentAdapter = createEntityAdapter<ICarRent, string>({
    selectId: (rent) => rent._id || "",
});

const initialState: RentState & EntityState<ICarRent, string> = rentAdapter.getInitialState({
    status: 'idle',
    error: null,
});

export const getCarRentsApi = createAsyncThunk("/rent/getCarRentsApi", async () => {
    try {
        const response = await getCarRents();
        return response.data;
    } catch (error: any) {
        return error?.response?.data?.message || "Error fetching rents";

    }
})

export const createCarRentApi = createAsyncThunk("/rent/createCarRentApi", async (formData: FormData, { rejectWithValue }) => {
    try {
        const response = await createCarRent(formData);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || "Error creating rent");

    }
})


const rentSlice = createSlice({
    name: 'rent',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getCarRentsApi.pending, (state) => {
            state.status = 'loading';
        })
            .addCase(getCarRentsApi.fulfilled, (state, action) => {
                state.status = 'succeeded';
                rentAdapter.setAll(state, action.payload);
            })
            .addCase(getCarRentsApi.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(createCarRentApi.fulfilled, (state, action) => {
                rentAdapter.addOne(state, action.payload);
            })
    }
})

export default rentSlice.reducer;
export const { selectAll: displayRents, selectById: displayRentById } = rentAdapter.getSelectors<RootState>((state) => state.rent);