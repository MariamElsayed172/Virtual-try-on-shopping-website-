import { useContext, useEffect, useState } from "react";
import { OrderContext } from "../../Func/context/OrderContextProvider";
import Loader from "../../Components/Loader";
import NoData from "../../Components/NoData";

export default function Cust_Orders() {
  const { GetOrder, CancelOrder } = useContext(OrderContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState({}); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await GetOrder();
        if (response?.data?.data) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [GetOrder]);

  const handleCancel = async (orderId) => {
    setCancelLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      await CancelOrder(orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setCancelLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  if (loading) {
    return <div className="text-center p-4"><Loader /></div>;
  }

  if (!orders || orders.length === 0) {
    return <div className="text-center p-4"><NoData /></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold">Order ID: {order._id}</p>
                <p>Status: <span className="capitalize">
                  {order.status === "cancelled" ? (
                    <span className="text-red-500 font-bold">Cancelled</span>
                  ) : order.status}
                </span></p>
                <p>Payment Method: <span className="capitalize">{order.paymentMethod}</span></p>
                <p>Shipping Address: {order.shippingAddress}</p>
                <p>Phone: {order.phone}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">Total: ${order.totalOrderPrice.toFixed(2)}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                {order.status === "pending" && (
                  <button
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
                    onClick={() => handleCancel(order._id)}
                    disabled={!!cancelLoading[order._id]}
                  >
                    {cancelLoading[order._id] ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Products:</h3>
              <div className="space-y-2">
                {order.products.map((product) => (
                  <div key={product._id} className="flex justify-between items-center border-t pt-2">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Price: ${product.priceAtPurchase.toFixed(2)}</p>
                      <p className="font-medium">Total: ${product.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
