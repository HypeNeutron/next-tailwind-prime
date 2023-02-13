import Link from "next/link";
import useQueryAPI from "../../utils/useQueryAPI";
import Layout from "../../components/Layout";
import useHasMounted from "../../hooks/useMounted";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export default function DashboardPage() {
  const {
    data: summary,
    isLoading,
    isFetching,
    error,
  } = useQueryAPI("admin-summary", "/api/admin/summary");

  let data;
  if (summary) {
    data = {
      labels: summary.salesData.map((d) => d._id),
      datasets: [
        {
          label: "Sales",
          backgroundColor: "rgba(162,222,208,1)",
          data: summary.salesData.map((t) => t.totalSales),
        },
      ],
    };
  }

  const hasMounted = useHasMounted();
  if (!hasMounted) return;

  return (
    <Layout title="Admin Dashboard">
      <div className="grid lg:grid-cols-4 md:gap-5">
        <ul>
          <li>
            <Link
              href="/admin/dashboard"
              className="font-bold blueLink text-lg"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className="blueLink text-lg">
              Orders
            </Link>
          </li>
          <li>
            <Link href="/admin/products" className="blueLink text-lg">
              Products
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="blueLink text-lg">
              Users
            </Link>
          </li>
        </ul>

        <div className="lg:col-span-3">
          <h1 className="mb-4 text-xl font-medium">Admin Dashboard</h1>
          {isFetching && !window.navigator.onLine ? (
            <div className="alert-error">
              Your is Offline Please check your connection
            </div>
          ) : isLoading ? (
            <center>Loading...</center>
          ) : error ? (
            <div className="alert-error">{error.message}</div>
          ) : (
            <>
              <section className="grid grid-cols-1 lg:grid-cols-4">
                <div className="card m-5 p-5 hover:shadow-lg transition-shadow duration-[1500ms]">
                  <p className="text-3xl">${summary.ordersPrice}</p>
                  <p className="font-medium">Sales</p>
                  <Link href="/admin/orders" className="blueLink">
                    View sales
                  </Link>
                </div>
                <div className="card m-5 p-5 hover:shadow-lg transition-shadow duration-[1500ms]">
                  <p className="text-3xl">{summary.ordersCount}</p>
                  <p className="font-medium">Orders</p>
                  <Link href="/admin/orders" className="blueLink">
                    View orders
                  </Link>
                </div>
                <div className="card m-5 p-5 hover:shadow-lg transition-shadow duration-[1500ms]">
                  <p className="text-3xl">{summary.productsCount}</p>
                  <p className="font-medium">Products</p>
                  <Link href="/admin/products" className="blueLink">
                    View products
                  </Link>
                </div>
                <div className="card m-5 p-5 hover:shadow-lg transition-shadow duration-[1500ms]">
                  <p className="text-3xl">{summary.usersCount}</p>
                  <p className="font-medium">Users</p>
                  <Link href="/admin/users" className="blueLink">
                    View users
                  </Link>
                </div>
              </section>
              <h2 className="text-xl font-medium">Sales Report</h2>
              <Bar options={options} data={data} />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

DashboardPage.auth = { adminOnly: true };
