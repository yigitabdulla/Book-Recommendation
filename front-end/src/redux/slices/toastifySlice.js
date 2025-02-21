import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const toastifySlice = createSlice({
  name: 'toastify',
  initialState: {
    message: '',
    type: 'info', // default type
  },
  reducers: {
    showToast: (state, action) => {
      const { message, type } = action.payload;
      state.message = message;
      state.type = type;

      toast[type](message); // Display the toast
    },
  },
});

export const { showToast } = toastifySlice.actions;
export default toastifySlice.reducer;