import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WindowEditMode {
    active: boolean;
    elementIndex: number | null;
    savedElements: any[];
    windowTitle: string;
}

interface EditorState {
    selectedElementId: number | null;
    selectedElementIds: number[];
    elementsList: any[];
    windowEditMode: WindowEditMode;
    clipboard: any | null;
}

const initialState: EditorState = {
    selectedElementId: null,
    selectedElementIds: [],
    elementsList: [],
    windowEditMode: {
        active: false,
        elementIndex: null,
        savedElements: [],
        windowTitle: '',
    },
    clipboard: null,
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
        },
        enterWindowEditMode: (state, action: PayloadAction<{ elementIndex: number; windowElements: any[]; windowTitle: string }>) => {
            state.windowEditMode = {
                active: true,
                elementIndex: action.payload.elementIndex,
                savedElements: [...state.elementsList],
                windowTitle: action.payload.windowTitle,
            };
            state.elementsList = action.payload.windowElements;
            state.selectedElementId = null;
            state.selectedElementIds = [];
        },
        copyElement: (state, action: PayloadAction<number>) => {
            const el = state.elementsList[action.payload];
            if (el) state.clipboard = el;
        },
        pasteElement: (state) => {
            if (!state.clipboard) return;
            const newEl = {
                ...state.clipboard,
                id: Date.now() + Math.random(),
                coords: {
                    ...state.clipboard.coords,
                    x: Math.min(state.clipboard.coords.x + 3, 90),
                    y: Math.min(state.clipboard.coords.y + 3, 90),
                },
            };
            state.elementsList = [...state.elementsList, newEl];
            state.selectedElementId = newEl.id;
            state.selectedElementIds = [newEl.id];
        },
        duplicateElement: (state, action: PayloadAction<number>) => {
            const el = state.elementsList[action.payload];
            if (!el) return;
            const newEl = {
                ...el,
                id: Date.now() + Math.random(),
                coords: {
                    ...el.coords,
                    x: Math.min(el.coords.x + 3, 90),
                    y: Math.min(el.coords.y + 3, 90),
                },
            };
            state.elementsList = [...state.elementsList, newEl];
            state.selectedElementId = newEl.id;
            state.selectedElementIds = [newEl.id];
        },
        exitWindowEditMode: (state) => {
            if (!state.windowEditMode.active || state.windowEditMode.elementIndex === null) return;
            const windowElements = [...state.elementsList];
            const savedElements = [...state.windowEditMode.savedElements];
            const idx = state.windowEditMode.elementIndex;
            savedElements[idx] = {
                ...savedElements[idx],
                interaction: {
                    ...savedElements[idx].interaction,
                    windowElements: windowElements,
                },
            };
            state.elementsList = savedElements;
            state.windowEditMode = { active: false, elementIndex: null, savedElements: [], windowTitle: '' };
            state.selectedElementId = null;
            state.selectedElementIds = [];
        },
    },
});

export const { updateEditor, setSelectedElementId, setSelectedElementIds, addToSelection, removeFromSelection, clearSelection, enterWindowEditMode, exitWindowEditMode, copyElement, pasteElement, duplicateElement } = editorSlice.actions;

export default editorSlice.reducer;