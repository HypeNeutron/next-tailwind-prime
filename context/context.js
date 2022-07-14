/* eslint-disable */
import axios from "axios";
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import reducer from "./reducer";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

import {
  INIT_STORED_CART,
  CART_ADD_ITEM,
  CART_COUNT_TOTALS,
  CART_REMOVE_ITEM,
  CART_RESET,
  SAVE_SHIPPING_ADDRESS,
  CART_CLEAR_ITEMS,
  SAVE_PAYMENT_METHOD,
} from "./actions";
import toastPop from "../utils/toastPop";

const AppContext = createContext();

const initialState = {
  cart: {
    cartItems: [],
    cartAmount: 0,
    cartTotal: 0,
    shippingAddress: {},
    paymentMethod: "",
  },
};

function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const getProductById = useCallback(async (id) => {
    const { data } = await axios.get(`/api/products/${id}`);
    return data;
  }, []);

  const addToCart = async (product) => {
    const exitItem = state.cart.cartItems.find((p) => p.slug === product.slug);
    const cloud = await getProductById(product._id);

    if (exitItem) {
      if (cloud.stock === exitItem.quantity) {
        toastPop(
          "warning",
          "Sorry. Product is out of stock",
          null,
          null,
          null,
          3000
        );
        return;
      }
    }
    dispatch({ type: CART_ADD_ITEM, payload: product });
  };

  const updateCart = async ({ item, qty }) => {
    const cloud = await getProductById(item._id);
    if (cloud.stock < qty) {
      toastPop("error", "Sorry Product is out of stock");
      return;
    }

    dispatch({
      type: CART_ADD_ITEM,
      payload: { ...item, quantity: qty, update: true },
    });
  };

  const removeCartItem = (slug) => {
    dispatch({ type: CART_REMOVE_ITEM, payload: slug });
  };

  const logoutSubmit = () => {
    return new Promise(async (resolve, reject) => {
      try {
        await signOut({ callbackUrl: "/login" });
        dispatch({ type: CART_RESET });
        Cookies.remove("cart");
        resolve();
      } catch (err) {
        reject(err.message);
      }
    });
  };

  const paymentSubmit = (e, selectedPaymentMethod) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toastPop(
        "error",
        "Payment method is required!",
        null,
        "top-right"
      );
    }
    dispatch({ type: SAVE_PAYMENT_METHOD, payload: selectedPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({ ...state.cart, paymentMethod: selectedPaymentMethod })
    );
    router.push("/checkout/placeorder");
  };

  const addressSubmitHandler = async ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }) => {
    dispatch({
      type: SAVE_SHIPPING_ADDRESS,
      payload: { fullName, address, city, postalCode, country },
    });
    router.push("/checkout/payment");
  };

  useEffect(() => {
    if (Cookies.get("cart")) {
      dispatch({
        type: INIT_STORED_CART,
        payload: JSON.parse(Cookies.get("cart")),
      });
    }
  }, []);

  useEffect(() => {
    if (state !== initialState) Cookies.set("cart", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.cart.cartItems !== undefined) {
      dispatch({ type: CART_COUNT_TOTALS });
    }
  }, [state.cart.cartItems]);

  const memoValue = useMemo(() => {
    return {
      ...state,
      addToCart,
      updateCart,
      removeCartItem,
      logoutSubmit,
      addressSubmitHandler,
      paymentSubmit,
      getProductById,
      dispatch,
    };
  }, [
    state,
    addToCart,
    updateCart,
    removeCartItem,
    logoutSubmit,
    addressSubmitHandler,
    paymentSubmit,
    getProductById,
    dispatch,
  ]);

  return (
    <AppContext.Provider value={memoValue}>{children}</AppContext.Provider>
  );
}

const useCartContext = () => {
  return useContext(AppContext);
};

export { AppContextProvider, useCartContext };
