import useQueryAPI from "../../utils/useQueryAPI";
import Link from "next/link";
import Layout from "../../components/Layout";

export default function AdminOrdersPage() {
  const {
    data: orders,
    isFetching,
    isLoading,
    error,
  } = useQueryAPI("admin-orders", "/api/admin/orders");

  return (
    <Layout title="Admin Orders">
      <div className="grid lg:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">
                <a className="blueLink text-lg">Dashboard</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/orders">
                <a className="font-bold blueLink text-lg">Orders</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/products">
                <a className="blueLink text-lg">Products</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">
                <a className="blueLink text-lg">Users</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <h1 className="mb-4 text-xl font-medium">Admin Orders</h1>
          {isFetching && !window.navigator.onLine ? (
            <div className="alert-error">
              Your is Offline Please check your connection
            </div>
          ) : isLoading ? (
            <center>Loading...</center>
          ) : error ? (
            <div className="alert-error">{error.message}</div>
          ) : !orders.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">USER</th>
                    <th className="p-5 text-left">DATE</th>
                    <th className="p-5 text-left">TOTAL</th>
                    <th className="p-5 text-left">PAID</th>
                    <th className="p-5 text-left">DELIVERED</th>
                    <th className="p-5 text-left">ACTION</th>
                  </tr>
                </thead>
              </table>
              <center>
                <h2 className="text-xl p-4 text-gray-500">📪Order is Empty</h2>
              </center>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">USER</th>
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
                      user,
                      createdAt,
                      totalPrice,
                      paidAt,
                      isPaid,
                      isDelivered,
                      deliveredAt,
                    } = order;

                    return (
                      <tr key={_id} className="border-b">
                        <td className="p-5">{_id.slice(20, 24)}</td>
                        <td className="p-5">
                          {user ? user.name : "DELETED USER"}
                        </td>
                        <td className="p-5">{createdAt.slice(0, 10)}</td>
                        <td className="p-5">${totalPrice}</td>
                        <td className="p-5">
                          {isPaid ? `${paidAt.slice(0, 10)}` : "not paid"}
                        </td>
                        <td className="p-5">
                          {isDelivered
                            ? `${deliveredAt.slice(0, 10)}`
                            : "not paid"}
                        </td>
                        <td className="p-5">
                          <Link href={`/order/${_id}`}>
                            <a className="blueLink">Details</a>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminOrdersPage.auth = { isAdmin: true };
