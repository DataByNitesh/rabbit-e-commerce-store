import React from "react";
import { useDispatch } from "react-redux";
import { RiDeleteBin3Line } from "react-icons/ri";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "@/redux/slices/cartSlice";

const CartContent = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Increase or decrease quantity
  const handleUpdateQuantity = (product, delta) => {
    const newQuantity = product.quantity + delta;

    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId: product.productId,
          quantity: newQuantity,
          userId,
          guestId,
          size: product.size,
          color: product.color,
        }),
      );
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = (product) => {
    dispatch(
      removeFromCart({
        productId: product.productId,
        userId,
        guestId,
        size: product.size,
        color: product.color,
      }),
    );
  };

  // Safety check
  if (!cart?.products || cart.products.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500">Your cart is empty.</div>
    );
  }

  return (
    <div>
      {cart.products.map((product) => (
        <div
          key={`${product.productId}-${product.size}-${product.color}`}
          className="flex items-start justify-between py-4 border-b"
        >
          {/* Left Section */}
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded"
            />

            <div>
              <h3 className="font-medium">{product.name}</h3>

              <p className="text-sm text-gray-500">
                Size: {product.size} | Color: {product.color}
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center mt-2">
                <button
                  onClick={() => handleUpdateQuantity(product, -1)}
                  className="border rounded py-1 px-2 text-xl font-medium"
                >
                  -
                </button>

                <span className="mx-4">{product.quantity}</span>

                <button
                  onClick={() => handleUpdateQuantity(product, 1)}
                  className="border rounded py-1 px-2 text-xl font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="text-right">
            <p className="font-medium">₹{product.price.toLocaleString()}</p>

            <button
              onClick={() => handleRemoveFromCart(product)}
              className="mt-2"
            >
              <RiDeleteBin3Line className="h-6 w-6 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContent;
