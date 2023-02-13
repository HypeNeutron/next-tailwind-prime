import { useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import { getError } from "../utils/error";
import { ErrorValidate } from "../components/ErrorValidate";
import toastPop from "../utils/toastPop";

export default function RegisterPage() {
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
    getValues,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      const signInRequest = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRequest.error) toastPop("error", signInRequest.error);
    } catch (err) {
      toastPop("error", getError(err));
    }
  };

  return (
    <Layout title="Create Account">
      <form className="form-container" onSubmit={handleSubmit(submitHandler)}>
        <h1 className="primaryHeading">Create Account</h1>
        {/*  Name  */}
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className={`w-full ${errors.name && "invalidInput"}`}
            id="name"
            autoFocus
            {...register("name", {
              required: "Please enter name",
            })}
          />
          <ErrorValidate>{errors.name && errors.name.message}</ErrorValidate>
        </div>
        {/* Email */}
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
            className={`w-full ${errors.email && "invalidInput"}`}
            id="email"
          />
          <ErrorValidate>{errors.email && errors.email.message}</ErrorValidate>
        </div>
        {/* password */}
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Please enter password",
              minLength: {
                value: 8,
                message: "password should at least 8 character",
              },
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
              },
            })}
            className={`w-full ${errors.password && "invalidInput"}`}
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
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className={`w-full ${errors.confirmPassword && "invalidInput"}`}
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Please enter confirm password",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 8,
                message: "confirm password is more than 8 character",
              },
            })}
          />
          <ErrorValidate>
            {errors.confirmPassword && errors.confirmPassword.message}
            {errors.confirmPassword &&
              errors.confirmPassword.type === "validate" && (
                <p>Password do not match</p>
              )}
          </ErrorValidate>
        </div>

        <div className="mb-4 ">
          <button className="primary-button">Register</button>
        </div>

        <div className="mb-4 ">
          Already has an account? &nbsp;
          <Link href={`/login?redirect=${redirect || "/"}`} className="font-medium ">
            Login
          </Link>
        </div>
      </form>
    </Layout>
  );
}
