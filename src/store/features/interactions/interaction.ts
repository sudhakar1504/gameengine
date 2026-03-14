import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { defaultInteractionConfig } from "@/utils/config/defaults";


interface InteractionState {
    elementIndex: number | null;
    data: typeof defaultInteractionConfig;
    triggerSelectionMode: boolean;
    pendingTriggerElementId: string | number | null;
}

const initialState: InteractionState = {
    elementIndex: null,
    data: defaultInteractionConfig,
    triggerSelectionMode: false,
    pendingTriggerElementId: null,
};

export const interactionSlice = createSlice({
    name: 'interaction',
    initialState,
    reducers: {
        setElementIndex: (state, action: PayloadAction<number | null>) => {
            state.elementIndex = action.payload;
        },
        setInteractionsData: (state, action: PayloadAction<typeof defaultInteractionConfig>) => {
            state.data = action.payload;
        },
        setTriggerSelectionMode: (state, action: PayloadAction<boolean>) => {
            state.triggerSelectionMode = action.payload;
        },
        setPendingTriggerElementId: (state, action: PayloadAction<string | number | null>) => {
            state.pendingTriggerElementId = action.payload;
        },
    },
});

export const { setElementIndex, setInteractionsData, setTriggerSelectionMode, setPendingTriggerElementId } = interactionSlice.actions;
export default interactionSlice.reducer;