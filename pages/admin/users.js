import Link from "next/link";
import Layout from "../../components/Layout";
import useQueryAPI from "./../../utils/useQueryAPI";
import { useDeleteAPI } from "./../../utils/useMutationAPI";

export default function AdminUsersPage() {
  const {
    data: users,
    isLoading,
    isFetching,
    error,
  } = useQueryAPI("admin-users", "/api/admin/users");

  const deleteUser = useDeleteAPI("admin-users", "/api/admin/users");

  const deleteUserHandler = (id) => {
    if (!window.confirm("Are your sure to delete this user?")) return;
    deleteUser.mutate(id);
  };

  return (
    <Layout title="Admin Users">
      <div className="grid lg:grid-cols-4 lg:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard" className="blueLink text-lg">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className=" blueLink text-lg">
                Orders
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className="blueLink text-lg">
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="font-bold  blueLink text-lg">
                Users
              </Link>
            </li>
          </ul>
        </div>

        <div className="overflow-x-auto lg:col-span-3">
          {isFetching &&
          typeof window !== "undefined" &&
          !window.navigator.onLine ? (
            <div className="alert-error">
              Your is Offline Please check your connection
            </div>
          ) : isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error.message}</div>
          ) : (
            <div className="mt-3 lg:mt-0">
              <h1 className="font-medium text-xl">Users</h1>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">ID</th>
                      <th className="p-5 text-left">NAME</th>
                      <th className="p-5 text-left">EMAIL</th>
                      <th className="p-5 text-left">ADMIN</th>
                      <th className="p-5 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const { _id, name, email, isAdmin } = user;
                      return (
                        <tr key={_id} className="border-b">
                          <td className=" p-5 ">{_id.slice(20, 24)}</td>
                          <td className=" p-5 ">{name}</td>
                          <td className=" p-5 ">{email}</td>
                          <td className=" p-5 ">
                            {isAdmin === true ? "YES" : "NO"}
                          </td>

                          <td className=" p-2 text-center my-auto">
                            <div className="md:flex justify-evenly items-center">
                              <Link
                                href={`/admin/user?id=${_id}&name=${name}&admin=${isAdmin}`}
                                className="blue-button mr-1"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => deleteUserHandler(_id)}
                                className="red-button"
                                type="button"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminUsersPage.auth = { adminOnly: true };
