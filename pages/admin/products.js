import Layout from "../../components/Layout";
import Link from "next/link";
import useQueryAPI from "../../utils/useQueryAPI";
import { useDeleteAPI } from "../../utils/useMutationAPI";
import toastPop from "../../utils/toastPop";
import { getError } from "./../../utils/error";

export default function AdminProductsPage() {
  const {
    data: products,
    isFetching,
    isLoading,
    error,
  } = useQueryAPI("admin-products", "/api/admin/products");

  const deleteProduct = useDeleteAPI("admin-products", "/api/admin/products");

  const deleteProductHandler = async (id) => {
    if (!window.confirm("Are you sure to delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toastPop("success", "Delete Product Successful", null, null, null, 2000);
    } catch (err) {
      toastPop(
        "error",
        deleteProduct.isError ? deleteProduct.error : getError(err)
      );
    }
  };

  return (
    <Layout title="Admin Products">
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
              <Link
                href="/admin/products"
                className="font-bold blueLink text-lg"
              >
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="blueLink text-lg">
                Users
              </Link>
            </li>
          </ul>
        </div>

        <div className="overflow-x-auto lg:col-span-3">
          {isFetching && !window.navigator.onLine ? (
            <div className="alert-error">
              Your is Offline Please check your connection
            </div>
          ) : isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error.message}</div>
          ) : (
            <>
              <div className="flex justify-between mb-5 items-center">
                <h1 className="font-medium text-xl">Products</h1>
                <Link
                  href="/admin/product/add-product"
                  className="primary-button"
                >
                  Create
                </Link>
              </div>

              <div className=" overflow-x-auto">
                <table className="min-w-full relative border-collapse">
                  <thead className="border-b sticky top-0 bg-white">
                    <tr>
                      <th className="px-5 text-left">ID</th>
                      <th className="p-5 text-left">NAME</th>
                      <th className="p-5 text-left">PRICE</th>
                      <th className="p-5 text-left">CATEGORY</th>
                      <th className="p-5 text-left">COUNT</th>
                      <th className="p-5 text-left">RATING</th>
                      <th className="p-5 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const { _id, name, price, category, stock, rating } =
                        product;
                      return (
                        <tr key={_id} className="border-b">
                          <td className=" p-5 ">{_id.slice(20, 24)}</td>
                          <td className=" p-5 ">{name}</td>
                          <td className=" p-5 ">${price}</td>
                          <td className=" p-5 ">{category}</td>
                          <td className=" p-5 ">{stock}</td>
                          <td className=" p-5 ">{rating}</td>
                          <td className=" p-2 text-center my-auto">
                            <div className="md:flex justify-evenly items-center">
                              <Link
                                href={`/admin/product/${_id}`}
                                className="blue-button mr-1"
                              >
                                Edit
                              </Link>

                              <button
                                onClick={() => deleteProductHandler(_id)}
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminProductsPage.auth = { adminOnly: true };
