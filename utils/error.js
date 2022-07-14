export const getError = (err) => {
  let message = err.response ? err.response.data.message : err.message;
  if (message.includes(500)) {
    message =
      "Can't connect to server, please check your connection or contact us";
  }
  return message;
};
