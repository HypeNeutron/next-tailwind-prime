import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useCartContext } from "../../context/context";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import CheckoutWizard from "../../components/Checkout/CheckoutWizard";
import { getError } from "../../utils/error";
import toastPop from "../../utils/toastPop";
import { CART_CLEAR_ITEMS } from "../../context/actions";
import OrderSummary from "../../components/Checkout/OrderSummary";
import OrderItems from "../../components/Checkout/OrderItems";

export default function PlaceOrderPage() {
  const {
    dispatch,
    cart,
    cart: { cartItems, shippingAddress, paymentMethod, cartTotal },
  } = useCartContext();

  const router = useRouter();

  const { fullName, city, country, address, postalCode } = shippingAddress;

  const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

  const itemsPrice = round2(cartTotal);
  const shippingPrice = itemsPrice > 200 ? 37 : 0;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (paymentMethod === undefined || "") router.push("/payment");
  }, [paymentMethod, router]);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: CART_CLEAR_ITEMS });
      Cookies.set(
        "cart",
        JSON.stringify({ ...cart, cartItems: [], cartAmount: 0, cartTotal: 0 })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toastPop("error", getError(err));
    }
  };

  return (
    <Layout title="Place order">
      <CheckoutWizard activeStep={3} />
      <h1 className="primaryHeading">Place Order</h1>
      {cartItems.length === 0 ? (
        <div className="text-lg my-5 font-medium">
          Cart is empty : &nbsp;
          <Link href="/">
            <a className="  primary-button" role="button">
              Go Shopping
            </a>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="over-flow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg font-medium">Shipping Address</h2>
              <div className="mb-1">
                {fullName}, {address}, {city}, {postalCode}, {country}
              </div>
              <div className="text-blue-600">
                <Link href="/shipping">Edit</Link>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg font-medium">Payment Method</h2>
              <div className="mb-1">{paymentMethod}</div>
              <div className="text-blue-600 ">
                <Link href="/payment">Edit</Link>
              </div>
            </div>

            <OrderItems cartItems={cartItems} cartTotal={cartTotal}>
              <div className="text-blue-600">
                <Link href="/cart">Edit</Link>
              </div>
            </OrderItems>
          </div>

          <OrderSummary
            {...{ itemsPrice, taxPrice, shippingPrice, totalPrice }}
          >
            <li>
              <button
                disabled={loading}
                onClick={placeOrderHandler}
                className="primary-button w-full"
              >
                {loading ? "Loading..." : "Place Order"}
              </button>
            </li>
          </OrderSummary>
        </div>
      )}
    </Layout>
  );
}
