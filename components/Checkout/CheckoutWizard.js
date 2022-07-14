export default function CheckoutWizard({ activeStep = 0 }) {
  const step = [
    "User Login",
    "Shipping Address",
    "Payment Method",
    "Place Order",
  ];
  return (
    <div className="mb5 flex flex-wrap">
      {step.map((step, index) => {
        return (
          <div
            key={step}
            className={`text-lg flex-1 border-b-2 text-center ${
              index <= activeStep
                ? "border-indigo-500 text-indigo-500"
                : "border-gray-400 text-gray-500"
            }`}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
}
