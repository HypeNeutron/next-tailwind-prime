import CheckoutWizard from "../../components/Checkout/CheckoutWizard";
import Layout from "../../components/Layout";
import { ErrorValidate } from "../../components/ErrorValidate";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "../../context/context";
import { useEffect } from "react";

export default function ShippingPage() {
  const {
    addressSubmitHandler,
    cart: { shippingAddress },
  } = useGlobalContext();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("fullName", shippingAddress?.fullName);
    setValue("address", shippingAddress?.address);
    setValue("city", shippingAddress?.city);
    setValue("postalCode", shippingAddress?.postalCode);
    setValue("country", shippingAddress?.country);
  }, [setValue, shippingAddress]);

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md "
        onSubmit={handleSubmit(addressSubmitHandler)}
      >
        <h1 className="primaryHeading">Shipping Address</h1>

        {/* fullName */}
        <div className="mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            className={`w-full ${errors.fullName && "invalidInput"}`}
            id="fullName"
            {...register("fullName", {
              required: "Please enter full name",
            })}
            autoFocus
          />
          <ErrorValidate>
            {errors.fullName && errors.fullName.message}
          </ErrorValidate>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            className={`w-full ${errors.address && "invalidInput"}`}
            id="address"
            {...register("address", {
              required: "Please enter Address",
              minLength: {
                value: 5,
                message: "Address should at least 5 character",
              },
            })}
          />
          <ErrorValidate>
            {errors.address && errors.address.message}
          </ErrorValidate>
        </div>

        {/* City */}
        <div className="mb-4">
          <label htmlFor="city">City</label>
          <input
            type="text"
            className={`w-full ${errors.city && "invalidInput"}`}
            id="city"
            {...register("city", {
              required: "Please enter city",
            })}
          />
          <ErrorValidate>{errors.city && errors.city.message}</ErrorValidate>
        </div>

        {/* PostalCode */}
        <div className="mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            className={`w-full ${errors.postalCode && "invalidInput"}`}
            id="postalCode"
            {...register("postalCode", {
              required: "Please enter postalCode",
            })}
          />
          <ErrorValidate>
            {errors.postalCode && errors.postalCode.message}
          </ErrorValidate>
        </div>
        {/* Country */}
        <div className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            className={`w-full ${errors.country && "invalidInput"}`}
            id="country"
            {...register("country", {
              required: "Please enter country",
            })}
          />
          <ErrorValidate>
            {errors.country && errors.country.message}
          </ErrorValidate>
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}

ShippingPage.auth = true;
