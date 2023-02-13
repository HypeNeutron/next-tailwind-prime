import { useGlobalContext } from "../context/context";
import Layout from "./../components/Layout";
import Link from "next/link";
import CartItems from "../components/Cart/CartItems";
import CartTotal from "../components/Cart/CartTotal";

export default function CartPage() {
  const {
    cart: { cartItems, cartTotal, cartAmount },
  } = useGlobalContext();

  return (
    <Layout title="Shopping Cart">
      <h1 className="mb4 text-xl font-medium">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-lg my-5 font-medium">
          Cart is empty : &nbsp;
          <Link href="/" className="primary-button">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <CartItems cartItems={cartItems} />
          <CartTotal cartAmount={cartAmount} cartTotal={cartTotal} />
        </div>
      )}
    </Layout>
  );
}
