import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AllPagesState {
    pages: any[];
    selectedPage: number;
}

const initialState: AllPagesState = {
    pages: [
        {
            id: 1,
            name: "Page 1",
            content: "Content of Page 1",
        },
    ],
    selectedPage: 1,
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