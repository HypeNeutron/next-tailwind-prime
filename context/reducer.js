import Cookies from "js-cookie";
import {
  INIT_STORED_CART,
  CART_ADD_ITEM,
  CART_COUNT_TOTALS,
  CART_REMOVE_ITEM,
  CART_RESET,
  CART_CLEAR_ITEMS,
  SAVE_SHIPPING_ADDRESS,
  SAVE_PAYMENT_METHOD,
} from "./actions";

const reducer = (state, { type, payload: load }) => {
  switch (type) {
    case INIT_STORED_CART: {
      return load;
    }

    case CART_ADD_ITEM: {
      const isExitItem = state.cart.cartItems.find(
        (item) => item.slug === load.slug
      );

      const newCartItems = isExitItem
        ? state.cart.cartItems.map((item) => {
            let newQuantity;
            if (item.name === isExitItem.name) {
              load.update
                ? (newQuantity = load.quantity)
                : (newQuantity = item.quantity + load.quantity);
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
        : [...state.cart.cartItems, load];

      Cookies.set(
        "cart",
        JSON.stringify({ ...state.cart, cartItems: newCartItems })
      );
      return {
        ...state,
        cart: { ...state.cart, cartItems: newCartItems },
      };
    }

    case CART_REMOVE_ITEM: {
      const resItems = state.cart.cartItems.filter(
        (item) => item.slug !== load
      );
      Cookies.set(
        "cart",
        JSON.stringify({ ...state.cart, cartItems: resItems })
      );
      return { ...state, cart: { ...state.cart, cartItems: resItems } };
    }

    case CART_COUNT_TOTALS: {
      const { cartTotal, cartAmount } = state.cart.cartItems.reduce(
        (acc, cartItem) => {
          const { quantity, price } = cartItem;
          const multipleTotal = price * quantity;
          acc.cartAmount += quantity;
          acc.cartTotal += multipleTotal;
          return acc;
        },
        { cartTotal: 0, cartAmount: 0 }
      );
      Cookies.set(
        "cart",
        JSON.stringify({ ...state.cart, cartTotal, cartAmount })
      );
      return { ...state, cart: { ...state.cart, cartTotal, cartAmount } };
    }

    case CART_CLEAR_ITEMS: {
      return {
        ...state,
        cart: { ...state.cart, cartItems: [], cartAmount: 0, cartTotal: 0 },
      };
    }

    case CART_RESET: {
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: "",
          cartAmount: 0,
          cartTotal: 0,
        },
      };
    }

    case SAVE_SHIPPING_ADDRESS: {
      Cookies.set(
        "cart",
        JSON.stringify({
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...load,
          },
        })
      );
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...load,
          },
        },
      };
    }

    case SAVE_PAYMENT_METHOD: {
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: load,
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
