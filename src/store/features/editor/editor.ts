import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
    selectedElementId: number | null;
    elementsList: any[]
}

const initialState: EditorState = {
    selectedElementId: null,
    elementsList: [],
};

export const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        updateEditor: (state, action: PayloadAction<any[]>) => {
            state.elementsList = action.payload;
        },
        setSelectedElementId: (state, action: PayloadAction<number>) => {
            state.selectedElementId = action.payload;
        },
    },
});

export const { updateEditor, setSelectedElementId } = editorSlice.actions;

export default editorSlice.reducer;