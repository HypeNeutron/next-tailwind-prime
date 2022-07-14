import axios from "axios";
import { useEffect, useState } from "react";
import { ErrorValidate } from "../ErrorValidate";
import { useForm } from "react-hook-form";
import EmailModal from "./EmailModal";
import toastPop from "../../utils/toastPop";
import { getError } from "../../utils/error";
import { signIn } from "next-auth/react";

export default function Profile({ session }) {
  const [isEmailEdit, setIsEmailEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("username", session?.user.name);
  }, [session?.user.name, setValue]);

  const updateProfile = async ({ username }) => {
    if (username === session?.user.name)
      return toastPop("warning", "Sorry not any updating.");

    try {
      const { data } = await axios.put("/api/auth/updateProfile", { username });

      const newSignIn = await signIn("credentials", {
        redirect: false,
        email: session?.user.email,
        editName: username,
      });

      if (newSignIn.error) return toastPop("error", newSignIn.error);

      toastPop("success", data.message);
    } catch (err) {
      toastPop("error", getError(err));
    }
  };

  const changeEmail = async ({ email, password }) => {
    try {
      setIsEditing(true);
      const { data } = await axios.put("/api/auth/updateEmail", {
        email,
        password,
      });
      setIsEditing(false);
      const newSignIn = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (newSignIn.error) return toastPop("error", newSignIn.error);
      toastPop("success", data.message);
      setIsEmailEdit(false);
    } catch (err) {
      setIsEditing(false);
      toastPop("error", getError(err));
    }
  };

  return (
    <div className="pt-1 md:col-[3/-1]">
      <form onSubmit={handleSubmit(updateProfile)}>
        <h1 className="primaryHeading">Update Profile</h1>
        {/*  Name  */}
        <div className="mb-4">
          <label htmlFor="username">Name</label>
          <input
            type="text"
            className={`w-full ${errors.username && "invalidInput"}`}
            name="username"
            id="username"
            autoFocus
            {...register("username", {
              required: "Please enter name",
            })}
          />
          <ErrorValidate>
            {errors.username && errors.username.message}
          </ErrorValidate>
        </div>
        <div className="mb-4 ">
          <button className="primary-button">Save</button>
        </div>
      </form>

      <label className="mb-2 block">Email</label>
      <div className="flex w-full border p-2 relative mb-5 md:mb-0">
        <div className="w-full relative float-left">
          Your email address is: <b>{session?.user.email}</b>
        </div>
        <span
          className="cursor-pointer absolute right-0 top-0 border-black border h-full px-2 inline-flex justify-center items-center"
          onClick={() => setIsEmailEdit(true)}
        >
          Edit
        </span>
      </div>
      <EmailModal
        {...{ isEmailEdit, setIsEmailEdit, changeEmail, isEditing }}
        email={session?.user.email}
      />
    </div>
  );
}
