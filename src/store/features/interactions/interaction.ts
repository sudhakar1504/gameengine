import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { defaultInteractionConfig } from "@/utils/config/defaults";


interface InteractionState {
    elementIndex: number | null;
    data: typeof defaultInteractionConfig;
}

const initialState: InteractionState = {
    elementIndex: null,
    data: defaultInteractionConfig,
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
    },
});

export const { setElementIndex, setInteractionsData } = interactionSlice.actions;
export default interactionSlice.reducer;