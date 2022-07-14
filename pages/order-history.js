import { useEffect, useState } from "react";
import axios from "axios";
import { getError } from "./../utils/error";
import Layout from "./../components/Layout";
import Link from "next/link";

export default function OrderHistoryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get("/api/orders/history");
        setOrders(data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(getError(err));
      }
    };

    fetchOrder();
  }, []);

  return (
    <Layout title="Order History">
      <h1 className="primaryHeading h-10 border-b-2  border-blue-500 ">
        Order History
      </h1>
      {isLoading ? (
        <div>
          <center>Loading...</center>
        </div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : !orders.length ? (
        <center>
          <h2 className="text-xl text-gray-500">📪Order History is Empty</h2>
        </center>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="px-5 text-left">ID</th>
                <th className="p-5 text-left">DATE</th>
                <th className="p-5 text-left">TOTAL</th>
                <th className="p-5 text-left">PAID</th>
                <th className="p-5 text-left">DELIVERED</th>
                <th className="p-5 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const {
                  _id,
                  createdAt,
                  totalPrice,
                  isPaid,
                  isDelivered,
                  deliveredAt,
                } = order;

                return (
                  <tr key={_id} className="border-b">
                    <td className="p-5">{_id.slice(20, 24)}</td>
                    <td className="p-5">{createdAt.slice(0, 10)}</td>
                    <td className="p-5">{totalPrice}</td>
                    <td className="p-5">
                      {isPaid ? `${paidAt.slice(0, 10)}` : "not paid"}
                    </td>
                    <td className="p-5">
                      {isDelivered
                        ? `${deliveredAt.slice(0, 10)}`
                        : "not delivered"}
                    </td>
                    <td className="p-5 pl-2">
                      <Link href={`/order/${_id}`}>
                        <a className=" text-left font-medium primary-button">
                          Details
                        </a>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
OrderHistoryPage.auth = true;
