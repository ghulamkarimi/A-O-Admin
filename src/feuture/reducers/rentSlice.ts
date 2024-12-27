import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { ICarRent, TCarRent } from "../../interface";
import { createCarRent, deleteCarRent, editCarRent, getCarRents } from "../../service";
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

export const deleteCarRentApi = createAsyncThunk("/rent/deleteCarRentApi",
    async ({ userId, carId }: { userId: string, carId: string }, { rejectWithValue }) => {
        try {
            const response = await deleteCarRent(userId, carId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Error deleting rent");
        }
    })

export const updateCarRentApi = createAsyncThunk("/rent/updateCarRentApi",
    async ({ rent, imageFile }: { rent: TCarRent, imageFile?: File }, { rejectWithValue }) => {
        try {
            const formData = new FormData()
            if (!rent._id || !rent.user) {
                throw new Error("Rent id or user is missing")
            }
            formData.append("carId", rent._id || "")
            formData.append("userId", rent.user || "")
            formData.append("carName", rent.carName || "")
            formData.append("carAC", rent.carAC ? "true" : "false")
            formData.append("carGear", rent.carGear || "")
            formData.append("carPrice", rent.carPrice || "")
            formData.append("carDoors", rent.carDoors || "")
            formData.append("carPeople", rent.carPeople || "")
            formData.append("isBooked", rent.isBooked ? "true" : "false")
            if (imageFile) {
                formData.append("carImage", imageFile)
            } else {
                formData.append("carImage", rent.carImage || "")
            }
            const updateRent = await editCarRent(formData)

            return updateRent.data
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Error updating rent");

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
            .addCase(deleteCarRentApi.fulfilled, (state, action) => {
                rentAdapter.removeOne(state, action.meta.arg.carId);
            })
            .addCase(updateCarRentApi.fulfilled, (stata, action) => {
                const { _id, changes } = action.payload;
                const existingRent = rentAdapter.getSelectors().selectById(stata, _id);
                if (existingRent) {
                    Object.assign(existingRent, changes);
                }
            }

            )
    }
})

export default rentSlice.reducer;
export const { selectAll: displayRents, selectById: displayRentById } = rentAdapter.getSelectors<RootState>((state) => state.rent);