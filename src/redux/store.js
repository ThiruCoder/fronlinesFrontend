import { configureStore } from "@reduxjs/toolkit";
import companiesReducer from "./companySlice.js";

export const store = configureStore({
    reducer: {
        companies: companiesReducer
    }
});
