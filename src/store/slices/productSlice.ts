import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchProducts } from "@/lib/api";
import { Product, ProductsResponse } from "@/types/product";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  total: number;
  skip: number;
  limit: number;
}

const initialState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 10,
};

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (token: string) => {
    const response = await fetchProducts(token);
    return response;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      const exists = state.products.some(
        (product) => product.id === action.payload.id
      );
      if (!exists) {
        state.products.unshift(action.payload);
        state.total += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getProducts.fulfilled,
        (state, action: PayloadAction<ProductsResponse>) => {
          state.isLoading = false;
          state.products = action.payload.products;
          state.total = action.payload.total;
          state.skip = action.payload.skip;
          state.limit = action.payload.limit;
        }
      )
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export const { addProduct } = productSlice.actions;
export default productSlice.reducer;
