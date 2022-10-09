import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAIL,
  PAY_REQUEST,
  PAY_SUCCESS,
  PAY_FAIL,
  PAY_RESET,
  DELIVER_REQUEST,
  DELIVER_SUCCESS,
  DELIVER_FAIL,
  DELIVER_RESET,
} from "./action";

const reducer = (state, { type, payload }) => {
  switch (type) {
    case FETCH_REQUEST:
      return { ...state, loading: true, error: "" };
    case FETCH_SUCCESS:
      return { ...state, loading: false, order: payload, error: "" };
    case FETCH_FAIL:
      return { ...state, loading: false, error: payload };

    case PAY_REQUEST:
      return { ...state, loadingPay: true };
    case PAY_SUCCESS:
      return { ...state, loadingPay: false, successPay: true };
    case PAY_FAIL:
      return { ...state, loadingPay: false, errorPay: payload };
    case PAY_RESET:
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };

    case DELIVER_REQUEST:
      return { ...state, loadingDeliver: true };
    case DELIVER_SUCCESS:
      return { ...state, loadingDeliver: false, successDeliver: true };
    case DELIVER_FAIL:
      return { ...state, loadingDeliver: false, errorDeliver: payload };
    case DELIVER_RESET:
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: "",
      };

    default:
      state;
  }
};

export default reducer;
