import { createCheckout } from "@/redux/slices/checkoutSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  // CREATE CHECKOUT
  const handleCreateOrder = async (e) => {
    e.preventDefault();

    if (!cart || cart.products.length === 0) return;

    try {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "Gpay",
          totalPrice: cart.totalPrice,
        }),
      ).unwrap();

      if (res && res._id) {
        setCheckoutId(res._id);
      }
    } catch (err) {
      console.error("Checkout creation failed:", err);
    }
  };

  // PAYMENT HANDLER
  const handlePayment = async () => {
    if (!checkoutId) return;

    try {
      // 1. Create Razorpay order on backend
      const { data: order } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/create-razorpay-order`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: "Rabbit.inc",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify Payment Signature
          try {
            const verifyRes = await axios.put(
              `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
              }
            );

            if (verifyRes.status === 200) {
              await handleFinalizeCheckout(checkoutId);
            }
          } catch (error) {
            console.error("Payment verification failed", error);
            alert("Payment Verification Failed. Contact Support.");
          }
        },
        prefill: {
          name: `${user?.name || "Customer"}`,
          email: `${user?.email || "customer@example.com"}`,
          contact: shippingAddress.phone || "9999999999",
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.description);
      });
      rzp1.open();

    } catch (err) {
      console.error("Payment setup failed:", err);
      alert("Something went wrong with setting up the payment.");
    }
  };

  // FINALIZE ORDER
  const handleFinalizeCheckout = async (id) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${id}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      if (response.status === 201) {
        navigate(`/order-confirmation`);
      }
    } catch (err) {
      console.error("Finalize failed:", err);
    }
  };

  // UI STATES
  if (loading) return <p>Loading Cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h2 className="text-2xl uppercase mb-6">Checkout</h2>

      <form onSubmit={handleCreateOrder} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={shippingAddress.firstName}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                firstName: e.target.value,
              })
            }
            className="border p-2"
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            value={shippingAddress.lastName}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                lastName: e.target.value,
              })
            }
            className="border p-2"
            required
          />
        </div>

        <input
          type="text"
          placeholder="Address"
          value={shippingAddress.address}
          onChange={(e) =>
            setShippingAddress({
              ...shippingAddress,
              address: e.target.value,
            })
          }
          className="border p-2 w-full"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="City"
            value={shippingAddress.city}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                city: e.target.value,
              })
            }
            className="border p-2"
            required
          />

          <input
            type="text"
            placeholder="Postal Code"
            value={shippingAddress.postalCode}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                postalCode: e.target.value,
              })
            }
            className="border p-2"
            required
          />
        </div>

        <input
          type="text"
          placeholder="Country"
          value={shippingAddress.country}
          onChange={(e) =>
            setShippingAddress({
              ...shippingAddress,
              country: e.target.value,
            })
          }
          className="border p-2 w-full"
          required
        />

        <input
          type="tel"
          placeholder="Phone"
          value={shippingAddress.phone}
          onChange={(e) =>
            setShippingAddress({
              ...shippingAddress,
              phone: e.target.value,
            })
          }
          className="border p-2 w-full"
          required
        />

        {/* BUTTON SWITCH */}
        {!checkoutId ? (
          <button
            type="submit"
            className="w-full bg-black text-white py-3 hover:bg-gray-800"
          >
            Continue to Payment
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePayment}
            className="w-full bg-green-600 text-white py-3 hover:bg-green-700"
          >
            Pay with UPI (GPay / PhonePe)
          </button>
        )}
      </form>
    </div>
  );
};

export default Checkout;
