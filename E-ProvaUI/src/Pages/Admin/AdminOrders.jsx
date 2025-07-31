import { useState, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Select } from "flowbite-react";
import { OrderContext } from "../../Func/context/OrderContextProvider";
import Loader from "../../Components/Loader";
import CantFetch from "../../Components/CantFetch";

export default function AdminOrders() {
  const [filter, setFilter] = useState("");
  const { GetOrder } = useContext(OrderContext);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getOrders"],
    queryFn: () => GetOrder(),
  });

  const orders = data?.data?.data || [];

  const filteredOrders = filter
    ? orders.filter((order) => order.status?.toLowerCase() === filter.toLowerCase())
    : orders;

  const handleStatusChange = (orderId, newStatus) => {
    // Update the cache
    queryClient.setQueryData(["getOrders"], (oldData) => {
      const newData = {
        ...oldData,
        data: {
          ...oldData.data,
          data: oldData.data.data.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          ),
        },
      };
      return newData;
    });
  };

  if (isLoading) return <div className="p-6 text-blue-500"><Loader /></div>;
  if (isError) return <div className="p-6 text-red-500"><CantFetch /></div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Admin Order Management</h1>
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-[200px] bg-gray-100 text-gray-900"
        >
          <option value="">All</option>
          <option value="Pending" className="text-yellow-500">Pending</option>
          <option value="Shipped" className="text-green-500">Shipped</option>
          <option value="Delivered" className="text-blue-500">Delivered</option>
          <option value="Cancelled" className="text-red-500">Cancelled</option>
        </Select>
      </div>
      <div className="overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600 font-semibold">No orders yet</p>
            {filter && (
              <p className="text-sm text-gray-500 mt-2">
                No orders found with status: {filter}
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-w-[320px]">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="p-2 sm:p-4 shadow-md bg-white rounded-lg">
                <h5 className="text-base sm:text-lg font-semibold text-blue-600">
                  Order ID: {order._id}
                </h5>
                <p className="text-sm sm:text-base text-gray-900">
                  Customer: {order.customerId?.username || "N/A"}
                </p>
                <p className="text-sm sm:text-base text-gray-900">
                  E-Mail: {order.customerId?.email || "N/A"}
                </p>

                <p className="text-sm sm:text-base text-gray-900">
                  Total Price: ${order.totalOrderPrice?.toFixed(2) || "0.00"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base text-gray-900">
                    Status:
                  </span>
                  <span className={
                    order.status === "Pending" ? "text-yellow-500 font-semibold" :
                    order.status === "Shipped" ? "text-green-500 font-semibold" :
                    order.status === "Delivered" ? "text-blue-500 font-semibold" :
                    order.status === "Cancelled" ? "text-red-500 font-semibold" :
                    "font-semibold"
                  }>
                    {order.status}
                  </span>
                  <Select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="w-[120px] bg-gray-100 text-gray-900"
                  >
                    <option value="Pending" className="text-yellow-500">Pending</option>
                    <option value="Shipped" className="text-green-500">Shipped</option>
                    <option value="Delivered" className="text-blue-500">Delivered</option>
                    <option value="Cancelled" className="text-red-500">Cancelled</option>
                  </Select>
                </div>
                <p className="text-sm sm:text-base text-gray-900">
                  Created At:{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-sm sm:text-base text-gray-900">Phone: {order.phone || "N/A"}</p>
                <p className="font-semibold mt-2 text-sm sm:text-base text-gray-900">
                  Shipping Address:
                </p>
                <p className="text-sm sm:text-base text-gray-900">
                  {order.shippingAddress || "N/A"}
                </p>
                <div className="flex gap-2 justify-between items-center ">
                  <p className="text-green-600 text-lg">{order.paymentMethod || "N/A"}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

