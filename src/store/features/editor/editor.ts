import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
    selectedElementId: number | null;
    selectedElementIds: number[];
    elementsList: any[]
}

const initialState: EditorState = {
    selectedElementId: null,
    selectedElementIds: [],
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
            // Also update the multi-selection array to keep them in sync if needed,
            // or we might decide to manage them separately. For now, selecting one clears others.
            if (action.payload) {
                state.selectedElementIds = [action.payload];
            } else {
                state.selectedElementIds = [];
            }
        },
        setSelectedElementIds: (state, action: PayloadAction<number[]>) => {
            state.selectedElementIds = action.payload;
            // If only one is selected, sync with selectedElementId
            if (action.payload.length === 1) {
                state.selectedElementId = action.payload[0];
            } else {
                state.selectedElementId = null; // Or keep it as the 'primary' selection? Let's disable primary for now.
            }
        },
        addToSelection: (state, action: PayloadAction<number>) => {
            if (!state.selectedElementIds.includes(action.payload)) {
                state.selectedElementIds.push(action.payload);
            }
        },
        removeFromSelection: (state, action: PayloadAction<number>) => {
            state.selectedElementIds = state.selectedElementIds.filter(id => id !== action.payload);
        },
        clearSelection: (state) => {
            state.selectedElementIds = [];
            state.selectedElementId = null;
        }
    },
});

export const { updateEditor, setSelectedElementId, setSelectedElementIds, addToSelection, removeFromSelection, clearSelection } = editorSlice.actions;

export default editorSlice.reducer;