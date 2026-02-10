import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AllPagesState {
    pages: any[];
    selectedPage: number;
}

const initialState: AllPagesState = {
    pages: [],
    selectedPage: 0,
};

export const allPagesSlice = createSlice({
    name: "allpages",
    initialState,
    reducers: {
        updateAllPages: (state, action: PayloadAction<any[]>) => {
            state.pages = action.payload;
        },
        setSelectedPage: (state, action: PayloadAction<number>) => {
            state.selectedPage = action.payload;
        },
    },
});

export const { updateAllPages, setSelectedPage } = allPagesSlice.actions;

export default allPagesSlice.reducer;