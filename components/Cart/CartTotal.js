import { useRouter } from "next/router";

export default function CartTotal({ cartAmount, cartTotal }) {
  const router = useRouter();
  return (
    <div className="card p-5 ">
      <ul>
        <li>
          <div className="pb-3 font-medium text-xl flex flex-row items-center justify-center w-full md:flex-col  md:items-start lg:flex-row lg:justify-start">
            Subtotal({cartAmount}) :
            <span className="ml-[5px]">${cartTotal}</span>
          </div>
        </li>
        <li>
          <button
            type="button"
            onClick={() => router.push("login?redirect=/checkout/shipping")}
            className="primary-button w-full mt-3"
          >
            Check Out
          </button>
        </li>
      </ul>
    </div>
  );
}
