export default function FormControls({
  children,
  name,
  type,
  register,
  regex,
  regMsg,
  ...rest
}) {
  return (
    <div className="mb-4">
      <label htmlFor={name}>{name}</label>
      <input
        type={type}
        className="w-full"
        id={name}
        {...register(name, {
          required: `Please enter ${name}`,
          pattern: {
            value: regex || /\w+/,
            message: regMsg || `Please enter valid ${name}`,
          },
          validate: type === "number" ? (value) => /^\d+$/.test(value) : true,
        })}
        {...rest}
      />
      {children}
    </div>
  );
}
