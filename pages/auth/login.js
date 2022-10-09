import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import toastPop from "../../utils/toastPop";
import { getError } from "../../utils/error";
import { ErrorValidate } from "../../components/ErrorValidate";
import { FcGoogle } from "react-icons/fc";

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
        <div className="py-4 px-2">
          <h1 className="headingForm">Login</h1>
          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="JohnDoe@Example.com"
              {...register("email", {
                required: "Please enter email",
                pattern: {
                  value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/,
                  message: "Please enter valid email",
                },
              })}
              name="email"
              className={`formInput ${
                errors.email && "focus:ring-1 ring-red-300"
              }`}
              id="email"
              autoFocus
            />
            <ErrorValidate>
              {errors.email && errors.email.message}
            </ErrorValidate>
          </div>
          <div className="form-control">
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
              className={`formInput ${
                errors.password && "focus:ring-1 ring-red-300"
              }`}
              id="password"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
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
          <div className="form-control text-center">
            <button className="primary-button text-black w-28">Login</button>
          </div>
          <div className="form-control text-center">
            Don&apos;t have an account?&nbsp;
            <Link href={`/auth/register?redirect=${redirect || "/"}`}>
              <a className="font-medium">Register</a>
            </Link>
          </div>
          <div className="relative mx-auto mb-5 w-[75%]">
            <p className="absolute top-[-13px] left-[45%] text-center z-1 bg-[#252f41] w-[10%]">
              or
            </p>
            <hr />
          </div>
          <div className="text-center">
            <button
              onClick={() => signIn("google")}
              type="button"
              className="w-[230px] h-10 text-black inline-flex items-center justify-between text-center bg-white rounded px-8 py-4"
              title="login with google"
            >
              <FcGoogle size="1.2em" />
              Sign In with Google
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
