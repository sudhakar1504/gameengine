import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { defaultDragDropConfig, DragDropConfig } from "@/utils/config/defaults";

interface DragDropState {
    elementIndex: number | null;
    data: DragDropConfig;
    targetSelectionMode: boolean;
    pendingTargetElementId: string | number | null;
}

const initialState: DragDropState = {
    elementIndex: null,
    data: defaultDragDropConfig,
    targetSelectionMode: false,
    pendingTargetElementId: null,
};

export const dragDropSlice = createSlice({
    name: 'dragDrop',
    initialState,
    reducers: {
        setDragDropElementIndex: (state, action: PayloadAction<number | null>) => {
            state.elementIndex = action.payload;
        },
        setDragDropData: (state, action: PayloadAction<DragDropConfig | null>) => {
            state.data = action.payload ?? defaultDragDropConfig;
        },
        setDragDropTargetSelectionMode: (state, action: PayloadAction<boolean>) => {
            state.targetSelectionMode = action.payload;
        },
        setPendingDragDropTargetId: (state, action: PayloadAction<string | number | null>) => {
            state.pendingTargetElementId = action.payload;
        },
    },
});

export const {
    setDragDropElementIndex,
    setDragDropData,
    setDragDropTargetSelectionMode,
    setPendingDragDropTargetId,
} = dragDropSlice.actions;

export default dragDropSlice.reducer;
