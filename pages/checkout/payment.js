import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CheckoutWizard from "../../components/Checkout/CheckoutWizard";
import Layout from "../../components/Layout";
import { useGlobalContext } from "../../context/context";

export default function PaymentPage() {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const {
    paymentSubmit,
    cart: { shippingAddress, paymentMethod },
  } = useGlobalContext();

  useEffect(() => {
    if (!shippingAddress) return router.push("/checkout/shipping");
    setSelectedPaymentMethod(paymentMethod || "PayPal");
  }, [paymentMethod, router, shippingAddress]);

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={(e) => paymentSubmit(e, selectedPaymentMethod)}
      >
        <h1 className="primaryHeading">Payment Method</h1>

        {["PayPal", "Stripe", "CashOnDelivery"].map((payment) => (
          <div key={payment} className="mb-4">
            <input
              type="radio"
              name="paymentMethod"
              className="p-2 online-none focus:ring-0"
              id={payment}
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />
            <label htmlFor={payment} className="p-2">
              {payment}
            </label>
          </div>
        ))}

        <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push("/checkout/shipping")}
            type="button"
            className="default-button"
          >
            Back
          </button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}

PaymentPage.auth = true;
