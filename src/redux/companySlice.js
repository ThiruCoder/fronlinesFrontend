import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCompanies = createAsyncThunk(
    'companies/fetchCompanies',
    async () => {
        const response = await axios.get('https://frontlines-backend.vercel.app/api/companies');
        return response?.data?.data;
    }
);

const companiesSlice = createSlice({
    name: 'companies',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompanies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanies.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchCompanies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default companiesSlice.reducer;
