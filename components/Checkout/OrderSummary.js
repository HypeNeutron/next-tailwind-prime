export default function OrderSummary({
  children,
  itemsPrice,
  taxPrice,
  shippingPrice,
  totalPrice,
}) {
  return (
    <div>
      <div className="card p-5">
        <h2 className="mb-2 text-lg font-medium">Order Summary</h2>
        <ul>
          <li>
            <div className="mb-2 flex justify-between">
              <div className="font-medium">Items</div>
              <div>${itemsPrice}</div>
            </div>
          </li>
          <li>
            <div className="mb-2 flex justify-between">
              <div className="font-medium">Tax</div>
              <div>${taxPrice}</div>
            </div>
          </li>
          <li>
            <div className="mb-2 flex justify-between">
              <div className="font-medium">Shipping</div>
              <div>${shippingPrice}</div>
            </div>
          </li>
          <li>
            <div className="mb-2 flex justify-between">
              <div className="font-medium">Total</div>
              <div>${totalPrice}</div>
            </div>
          </li>
          {children}
        </ul>
      </div>
    </div>
  );
}
