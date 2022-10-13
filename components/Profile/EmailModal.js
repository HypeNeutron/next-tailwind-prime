import { memo, useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { SpinnerCircularFixed } from "spinners-react";
import toastPop from "../../utils/toastPop";

function EmailModal({
  email,
  changeEmail,
  isEditing,
  isEmailEdit,
  setIsEmailEdit,
}) {
  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    emailRef.current.defaultValue = email;
  }, [email]);

  const changeEmailHandler = () => {
    const newEmail = emailRef.current.value;
    const password = passwordRef.current.value;
    if (
      !password ||
      !newEmail ||
      !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/) ||
      !newEmail.match(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/)
    ) {
      toastPop("warning", "password or email is in valid");
      return;
    }
    changeEmail({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    passwordRef.current.value = "";
  };

  return (
    <div
      id="authentication-modal"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      className={`${
        isEmailEdit ? "flex bg-[rgba(33,33,33,.9)]" : "hidden"
      } fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-modal min-h-screen justify-center items-center`}
    >
      <div className="relative w-full h-full max-w-md p-4 md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-toggle="authentication-modal"
            onClick={() => setIsEmailEdit(false)}
          >
            <IoIosClose size="1.5rem" color="white" />
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Change Email
            </h3>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Your email
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="name@company.com"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Your password
                </label>
                <input
                  ref={passwordRef}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <small className="text-white">
                For your security, if you change your email address your saved
                credit card information will be deleted.
              </small>
              <button
                type="button"
                disabled={isEditing}
                className="w-full h-[45px] px-5 py-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={changeEmailHandler}
              >
                {isEditing ? (
                  <center>
                    <SpinnerCircularFixed
                      size={30}
                      thickness={81}
                      speed={159}
                      color="#fff"
                      secondaryColor="#4a71e0"
                    />
                  </center>
                ) : (
                  "Save"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(EmailModal);
