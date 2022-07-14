import axios from "axios";
import { useForm } from "react-hook-form";
import { getError } from "../../utils/error";
import { ErrorValidate } from "../ErrorValidate";
import toastPop from "./../../utils/toastPop";
import { signIn } from "next-auth/react";

export default function UpdatePasswordPage({ session }) {
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  const changePassword = async ({
    currentPassword,
    newPassword,
    confirmPassword,
  }) => {
    try {
      const { data } = await axios.put("/api/auth/updatePassword", {
        password: currentPassword,
        newPassword,
        confirmPassword,
      });

      const result = await signIn("credentials", {
        redirect: false,
        email: session?.user.email,
        password: confirmPassword,
      });
      if (result.error) return toastPop("error", result.error);
      toastPop("success", data.message);
      setValue("currentPassword", "");
      setValue("newPassword", "");
      setValue("confirmPassword", "");
    } catch (err) {
      toastPop("error", getError(err));
    }
  };

  return (
    <div className="pt-1 md:col-[3/-1]">
      <form className="form-container" onSubmit={handleSubmit(changePassword)}>
        <h1 className="primaryHeading">Password:</h1>
        {/* current password */}
        <div className="mb-4">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            placeholder="Enter Current Password"
            type="password"
            {...register("currentPassword", {
              required: "Please enter password",
              minLength: {
                value: 8,
                message: "password should at least 8 character",
              },
            })}
            className={`w-full ${errors.currentPassword && "invalidInput"}`}
            id="currentPassword"
            autoFocus
          />
          <ErrorValidate>
            {errors.currentPassword && errors.currentPassword.message}
          </ErrorValidate>
        </div>
        {/* new password */}
        <div className="mb-4">
          <label htmlFor="currentPassword">New Password</label>
          <input
            placeholder="Enter New Password"
            className={`w-full ${errors.newPassword && "invalidInput"}`}
            type="password"
            id="newPassword"
            {...register("newPassword", {
              required: "Please enter new password",
              minLength: {
                value: 8,
                message: "confirm password is more than 8 character",
              },
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
              },
            })}
          />
          <ErrorValidate>
            {errors.newPassword && errors.newPassword.message}
            {errors.newPassword?.type === "pattern" && (
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
            placeholder="Enter Confirm Password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Please enter confirm password",
              validate: (value) => value === getValues("newPassword"),
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
          <center>
            <button className="primary-button">Change Password</button>
          </center>
        </div>
      </form>
    </div>
  );
}
