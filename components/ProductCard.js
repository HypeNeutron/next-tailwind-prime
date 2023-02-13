import Link from "next/link";
import Image from "next/image";
import { useGlobalContext } from "../context/context";

export default function ProductCard({ product }) {
  const { image, name, slug, brand, price } = product;

  const { addToCart } = useGlobalContext();

  return (
    <div className="card">
      <Link href={`/product/${slug}`}>
        <Image
          src={image}
          width={607}
          height={607}
          alt={name}
          objectFit="cover"
          className="rounded shadow"
        />
      </Link>

      <div className="flex flex-col items-center justify-center p-5  font-medium">
        <Link href={`/product/${slug}`}>
          <h2 className="text-lg">{name}</h2>
        </Link>
        <p className="mb-2">{brand}</p>
        <p>${price}</p>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCart({ ...product, quantity: 1 })}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
