import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';
import { IAppointment, TAppointment } from "../../interface";
import { blockAppointment, getAllsAppointment, unblockAppointment } from '../../service';
import { RootState } from '../store';


interface AppointmentState {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const appointmentAdapter = createEntityAdapter<IAppointment, string>({
    selectId: (appointment) => appointment._id || "",
})

const initialState: AppointmentState & EntityState<IAppointment, string> =
    appointmentAdapter.getInitialState({
        status: 'idle',
        error: null,
    })

export const fetchAppointments = createAsyncThunk('appointments/fetchAppointments', async () => {
    try {
        const response = await getAllsAppointment();
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch appointments");
    }
});

export const blockAppointments = createAsyncThunk('appointments/blockAppointments', async (appointment: TAppointment) => {
    try {
        const response = await blockAppointment(appointment);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to block appointment");
    }
});

export const unblockAppointments = createAsyncThunk('appointments/unblockAppointments', async (appointment: TAppointment) => {
    try {
        const response = await unblockAppointment(appointment)
        return response.data;
    } catch (error: any) {
        return error?.response?.data?.message || "Failed to unblock appointments";
    }
});

const appointmentSlice = createSlice({
    name: "appointment",
    initialState,
    reducers: {
        appointmentCreated: appointmentAdapter.addOne,
        appointmentUpdated: appointmentAdapter.updateOne,
        appointmentDeleted: appointmentAdapter.removeOne,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAppointments.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchAppointments.fulfilled, (state, action) => {
            state.status = 'succeeded';
            appointmentAdapter.setAll(state, action.payload);
        });
        builder.addCase(fetchAppointments.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || null;
        });
        builder.addCase(blockAppointments.fulfilled, (state, action) => {
            appointmentAdapter.addOne(state, action.payload);
        });
        builder.addCase(unblockAppointments.fulfilled, (state, action) => {
            appointmentAdapter.removeOne(state, action.payload);
        })
    }
})


export const { selectAll: displayAppointments, selectById: displayAppointmentById } = appointmentAdapter.getSelectors<RootState>((state) => state.appointment);
export default appointmentSlice.reducer;