import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import toastPop from "../utils/toastPop";
import { getError } from "../utils/error";
import { ErrorValidate } from "../components/ErrorValidate";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.ok) toastPop("success", "Welcome back ✨");

      if (result.error) {
        toastPop("error", result.error);
      }
    } catch (err) {
      toastPop("error", getError(err));
    }
  };

  return (
    <Layout title="login">
      <form className="form-container" onSubmit={handleSubmit(submitHandler)}>
        <h1 className="mb-4 text-xl">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/,
                message: "Please enter valid email",
              },
            })}
            name="email"
            // className="w-full"
            className={`w-full ${errors.email && "focus:ring-1 ring-red-300"}`}
            id="email"
            autoFocus
          />
          <ErrorValidate>{errors.email && errors.email.message}</ErrorValidate>
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Please enter password",
              minLength: {
                value: 8,
                message: "password is need at least 8 character",
              },
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
              },
            })}
            name="password"
            className={`w-full ${
              errors.password && "focus:ring-1 ring-red-300"
            }`}
            id="password"
          />
          <ErrorValidate>
            {errors.password && errors.password.message}
            {errors.password?.type === "pattern" && (
              <ul>
                <li>
                  - password must contain at least 1 uppercase letter, 1
                  lowercase letter, and 1 number.
                </li>
                <li> - can contain special characters.</li>
              </ul>
            )}
          </ErrorValidate>
        </div>
        <div className="mb-4">
          <button className="primary-button">Login</button>
        </div>
        <div className="mb-4">
          Don&apos;t have an account?&nbsp;
          <Link href={`/register?redirect=${redirect || "/"}`}>
            <a className="font-medium">Register</a>
          </Link>
        </div>
      </form>
    </Layout>
  );
}
