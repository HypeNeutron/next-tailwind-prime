import { toast } from "react-toastify";

export default function toastPop(
  type,
  message,
  promise,
  pos,
  hideProgress,
  autoCloseTime
) {
  const opts = {
    position: pos || "top-center",
    autoClose: autoCloseTime || 5000,
    hideProgressBar: hideProgress || false,
  };

  switch (type) {
    case "promise": {
      toast.promise(
        promise,
        {
          pending: message,
          success: `${message} Successful`,
          error: `${message} failure`,
        },
        opts
      );
    }
    case "success":
      toast.success(message, opts);
      break;
    case "dark-success":
      toast.dark(message, opts);
      break;
    case "error":
      toast.error(message, opts);
      break;
    case "dark-error":
      toast.dark(message, opts);
      break;
    case "warning":
      toast.warn(message, opts);
      break;
    case "dark-warning":
      toast.dark(message, opts);
      break;
    case "info":
      toast.info(message, opts);
      break;
    case "dark-info":
      toast.dark(message, opts);
      break;
    default:
      toast(message, opts);
      break;
  }
}
