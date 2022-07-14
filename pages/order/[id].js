import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import axios from "axios";
import { useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";
import OrderSummary from "../../components/Checkout/OrderSummary";
import OrderItems from "../../components/Checkout/OrderItems";
import toastPop from "../../utils/toastPop";

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: payload };

    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };

    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      state;
  }
};

export default function OrderPage() {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const router = useRouter();
  const { id: orderId } = router.query;

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      // loadingDeliver,
      // successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  useEffect(() => {
    // Fetch Order ID-------------
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    // PayPal Loading---------------
    const loadPaypalScript = async () => {
      const { data: clientId } = await axios.get("/api/keys/paypal");
      paypalDispatch({
        type: "resetOptions",
        value: {
          "client-id": clientId,
          currency: "USD",
        },
      });
      paypalDispatch({ type: "setLoadingStatus", value: "pending" });
    };
    // Condition Fetching--------------
    if (
      (orderId && !order._id) ||
      successPay ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) dispatch({ type: "PAY_RESET" });
    } else loadPaypalScript();
  }, [order, orderId, dispatch, successPay, paypalDispatch]);

  // Content Display---------------
  let content;
  if (loading) {
    content = (
      <div>
        <center>Loading...</center>
      </div>
    );
  }
  if (error) {
    content = (
      <div className="alert-error">
        <center>{error}</center>
      </div>
    );
  }
  if (order.orderItems) {
    const {
      shippingAddress: { fullName, address, city, postalCode, country },
      paymentMethod,
      isPaid,
      paidAt,
      isDelivered,
      deliveredAt,
      orderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = order;

    const createOrder = (data, actions) => {
      return actions.order
        .create({
          purchase_units: [
            { amount: { currency_code: "USD", value: totalPrice } },
          ],
        })
        .then((orderId) => {
          return orderId;
        });
    };

    const onApprove = (data, actions) => {
      return actions.order.capture().then(async function (details) {
        try {
          dispatch({ type: "PAY_REQUEST" });
          const { data } = axios.put(`/api/orders/${order._id}/pay`, details);
          dispatch({ type: "PAY_SUCCESS", payload: data });
          toastPop("success", "Order is paid successfully", null, "top-right");
        } catch (err) {
          dispatch({ type: "PAY_FAIL", payload: getError(err) });
          toastPop("error", getError(err), null, "top-right");
        }
      });
    };

    const onError = (err) =>
      toastPop("error", getError(err), null, "top-right");

    content = (
      <div className="grid lg:grid-cols-4 md:gap-5">
        <div className="overflow-x-auto lg:col-span-3">
          <div className="card mb-5 p-5">
            <h2 className="mb-2 text-lg font-medium">Shipping Address</h2>
            <div>
              {fullName},{address},{city}
              {postalCode},{country}
            </div>
            {isDelivered ? (
              <div className="alert-success">Delivered at {deliveredAt}</div>
            ) : (
              <div className="alert-error">Not delivered</div>
            )}
          </div>

          <div className="card mb-5 p-5">
            <h2 className="mb-2 text-lg font-medium">Payment Method</h2>
            <div>{paymentMethod}</div>
            {isPaid ? (
              <div className="alert-success">Paid at {paidAt}</div>
            ) : (
              <div className="alert-error">Not paid</div>
            )}
          </div>
          <OrderItems cartItems={orderItems} cartTotal={itemsPrice} />
        </div>

        <OrderSummary {...{ itemsPrice, taxPrice, shippingPrice, totalPrice }}>
          {!isPaid && (
            <li>
              {isPending ? (
                <div>Loading...</div>
              ) : (
                <PayPalButtons
                  disabled={false}
                  style={{ layout: "vertical" }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              )}
              {loadingPay && <div>Loading...</div>}
            </li>
          )}
        </OrderSummary>
      </div>
    );
  }

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="text-xl mb-4 mt-1">Order ${orderId}</h1>
      {content}
    </Layout>
  );
}

OrderPage.auth = true;
