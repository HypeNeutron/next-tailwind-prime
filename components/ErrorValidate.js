export const ErrorValidate = ({ children, ...rest }) => {
  return (
    <div className="text-red-500" {...rest}>
      {children}
    </div>
  );
};
