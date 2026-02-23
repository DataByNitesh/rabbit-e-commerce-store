import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ================================
   Local Storage Helpers
================================ */

const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { products: [] };
  } catch (error) {
    console.error("Failed to load cart from storage", error);
    return { products: [] };
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart", error);
  }
};

/* ================================
   Async Thunks
================================ */

// Fetch Cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { params: { userId, guestId } },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch cart" },
      );
    }
  },
);

// Add To Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity, size, color, guestId, userId },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { productId, quantity, size, color, guestId, userId },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to add item" },
      );
    }
  },
);

// Update Quantity
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    { productId, quantity, guestId, userId, size, color },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { productId, quantity, guestId, userId, size, color },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update quantity" },
      );
    }
  },
);

// Remove From Cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          data: { productId, guestId, userId, size, color },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to remove item" },
      );
    }
  },
);

// Merge Guest Cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId, user }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        { guestId, user },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to merge cart" },
      );
    }
  },
);

/* ================================
   Slice
================================ */

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(), // { products: [] }
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ADD
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // UPDATE
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // REMOVE
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // MERGE
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
