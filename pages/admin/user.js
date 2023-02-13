import { useEffect, useState } from "react";
import { SpinnerCircularFixed } from "spinners-react";
import Link from "next/link";
import { usePatchAPI } from "../../utils/useMutationAPI";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import FormControls from "../../components/Admin/FormControls";
import Layout from "../../components/Layout";
import toastPop from "../../utils/toastPop";
import { getError } from "../../utils/error";
import { getSession, signIn, signOut } from "next-auth/react";

export default function AdminEditUserPage() {
  const router = useRouter();
  const { id, name, admin } = router.query;
  const [isAdmin, setIsAdmin] = useState(admin === "false" ? false : true);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const editUser = usePatchAPI("admin-users", `/api/admin/users/${id}`);

  useEffect(() => {
    setValue("name", name);
  }, [name, setValue]);

  const editUserHandler = async ({ name: editName }) => {
    try {
      const session = await getSession();

      if (editName === name && isAdmin === (admin === "false" ? false : true))
        return toastPop("warning", "Sorry your own user not any updating.");

      await editUser.mutateAsync({ name: editName, isAdmin });

      if (name === session.user.name && isAdmin === false) return signOut();

      if (name === session.user.name) {
        const newOwnSignIn = await signIn("credentials", {
          redirect: false,
          email: session?.user.email,
          editName,
          isAdmin,
        });
        if (newOwnSignIn.error) return toastPop("error", newSignIn.error);
      }

      toastPop("success", "Update user successful", null, null, null, 2000);
      const delay = setTimeout(() => router.push("/admin/users"), 2000);
      return () => clearTimeout(delay);
    } catch (err) {
      editUser.isError
        ? toastPop("error", editUser.error.message)
        : getError(err);
    }
  };

  return (
    <Layout title={`Edit User: ${id}`}>
      <div className="grid md:grid-cols-4 md:gap-5">
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
              <Link href="/admin/users" className="font-bold blueLink text-lg">
                Users
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          {typeof window !== "undefined" && !window.navigator.onLine ? (
            <div className="alert-error">
              Your is Offline Please check your connection
            </div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(editUserHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit User: ${id}`}</h1>
              <FormControls name="name" type="text" register={register}>
                {errors.name && (
                  <div className="text-red-500">{errors.name.message}</div>
                )}
              </FormControls>

              <div className="mb-4">
                <input
                  type="checkbox"
                  name="admin"
                  id="admin"
                  defaultChecked={isAdmin}
                  onChange={() => setIsAdmin((prev) => !prev)}
                />
                <label htmlFor="admin" className="p-1">
                  Admin
                </label>
              </div>

              <div className="mb-4">
                <button
                  disabled={editUser.isLoading || editUser.isSuccess}
                  className={`primary-button transition-[background-color] ease-linear ${
                    editUser.isSuccess &&
                    "bg-green-400 hover:bg-green-500 cursor-auto "
                  } w-[6rem] cursor-pointer`}
                >
                  {editUser.isLoading ? (
                    <center>
                      <SpinnerCircularFixed
                        size={24}
                        thickness={92}
                        speed={180}
                        color="#2b364a"
                        secondaryColor="#fff"
                      />
                    </center>
                  ) : editUser.isSuccess ? (
                    "Updated"
                  ) : (
                    "Update"
                  )}
                </button>
              </div>

              <div className="mb-4">
                <Link href={`/admin/users`} className="blue-button px-6">
                  &#8678; Back
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminEditUserPage.auth = { adminOnly: true };
