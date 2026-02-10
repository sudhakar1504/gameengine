import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    id: string | null;
    name: string | null;
    email: string | null;
    isAuthenticated: boolean;
}

const initialState: UserState = {
    id: null,
    name: "dsjhfjksdhfj",
    email: "[EMAIL_ADDRESS]",
    isAuthenticated: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Omit<UserState, 'isAuthenticated'>>) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state.id = null;
            state.name = null;
            state.email = null;
            state.isAuthenticated = false;
        },
        updateUser: (state, action: PayloadAction<Partial<Omit<UserState, 'isAuthenticated'>>>) => {
            if (action.payload.id !== undefined) state.id = action.payload.id;
            if (action.payload.name !== undefined) state.name = action.payload.name;
            if (action.payload.email !== undefined) state.email = action.payload.email;
        },
    },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
