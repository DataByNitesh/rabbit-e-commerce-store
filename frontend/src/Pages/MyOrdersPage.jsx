import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orders = [], loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!Array.isArray(orders)) {
    return <p>Unexpected data format received.</p>;
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">My Orders</h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Shipping Address</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="border-t border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <img
                      src={order.orderItems?.[0]?.image}
                      alt={order.orderItems?.[0]?.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-900">
                    #{order._id}
                  </td>

                  <td className="px-4 py-3">
                    {order.createdAt &&
                      new Date(order.createdAt).toLocaleDateString()}{" "}
                    {order.createdAt &&
                      new Date(order.createdAt).toLocaleTimeString()}
                  </td>

                  <td className="px-4 py-3">
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.country}
                  </td>

                  <td className="px-4 py-3">{order.orderItems?.length || 0}</td>

                  <td className="px-4 py-3 font-medium text-gray-900">
                    ₹{order.totalPrice}
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Paid
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  You Have No Orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;
