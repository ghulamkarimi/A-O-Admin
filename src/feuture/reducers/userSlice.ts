import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    EntityState,
} from "@reduxjs/toolkit";
import { userLogin, userRegister, getAllUsers} from '../../service/index';
import { RootState } from "../store/index";
import { IUser, IUserInfo, TUser } from "../../interface";



interface IUserState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    token: string;
    userId: string;
    file: File | null;
    userInfo: IUserInfo;
    message?: string;
}

const userAdapter = createEntityAdapter<IUser, string>({
    selectId: (user) => (user?._id ? user._id : ""),
});


export const userRegisterApi = createAsyncThunk(
    "users/userRegisterApi",
    async (initialUser: TUser, { rejectWithValue }) => {
        try {
            const response = await userRegister(initialUser);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Error in user registration");
        }
    }
);

export const userLoginApi = createAsyncThunk(
    "users/userLoginApi",
    async (initialUser: TUser, { rejectWithValue }) => {
        try {
            const response = await userLogin(initialUser);
            console.log("login UserSlice:", response.data);
            localStorage.setItem("userId", response.data.userInfo.userId)
            localStorage.setItem("exp", response.data.userInfo.exp)
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Error in user login");
        }
    }
);

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
    try {
        const response = await getAllUsers();
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || "Error fetching users");
    }
});

 

const initialState: IUserState & EntityState<IUser, string> =
    userAdapter.getInitialState({
        status: "idle",
        error: null,
        file: null,
        userId: "",
        token: "",
        userInfo: {
            userId: "",
            firstName: "",
            lastName: "",
            email: "",
            profile_photo: "",
            password: "",
            confirmPassword: "",
            isAdmin: false,
            exp: 0,
            iat: 0,
        },
    });

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        clearUserInfos: (state) => {
            state.userInfo = initialState.userInfo;
            state.token = "";
            state.userId = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userRegisterApi.pending, (state) => {
                state.status = "loading";
            })
            .addCase(userRegisterApi.fulfilled, (state, action) => {
                userAdapter.addOne(state, action.payload.user);
                state.status = "succeeded";
            })
            .addCase(userLoginApi.fulfilled, (state, action) => {
                userAdapter.setOne(state, action.payload.userInfo);
                state.userInfo = action.payload.userInfo;
                state.token = action.payload.token;
                state.status = "succeeded";
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                userAdapter.setAll(state, action.payload);
                state.status = "succeeded";
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch users";
            })
             
    }
});

export const { selectAll: displayUsers, selectById: displayUserById } = userAdapter.getSelectors((state: RootState) => state.users);
export const { setToken, setUserInfo } = userSlice.actions;

export default userSlice.reducer;
