import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { SpinnerCircularFixed } from "spinners-react";
import Layout from "../../../components/Layout";
import useQueryAPI from "./../../../utils/useQueryAPI";
import FormControls from "./../../../components/Admin/FormControls";
import { usePatchAPI, usePostAPI } from "../../../utils/useMutationAPI";
import toastPop from "../../../utils/toastPop";
import { getError } from "./../../../utils/error";

export default function AdminProductEditPage() {
  const router = useRouter();
  const { id } = router.query;

  const BaseProductURI = `/api/admin/products/${id}`;

  const {
    data: product,
    isLoading,
    isFetching,
    isSuccess,
    error,
  } = useQueryAPI(["admin-product", id], BaseProductURI);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isSuccess) {
      setValue("name", product.name);
      setValue("slug", product.slug);
      setValue("price", product.price);
      setValue("image", product.image);
      setValue("category", product.category);
      setValue("brand", product.brand);
      setValue("stock", product.stock);
      setValue("description", product.description);
    }
  }, [product, isSuccess, setValue]);

  const uploadImage = usePostAPI(
    "",
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`
  );

  const uploadImageHandler = async (e, imageInput = "image") => {
    try {
      const {
        data: { signature, timestamp },
      } = await axios("/api/admin/cloudinary-sign");
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      const { secure_url } = await uploadImage.mutateAsync(formData);
      setValue(imageInput, secure_url);
      toastPop("success", "File uploaded successfully", null, null, true, 1000);
    } catch (err) {
      toastPop(
        "error",
        uploadImage.isError ? uploadImage.error.message : getError(err)
      );
    }
  };

  const editProduct = usePatchAPI(
    ["admin-products", ["product", id]],
    BaseProductURI
  );

  const editProductHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    stock,
    description,
  }) => {
    if (
      name === product.name &&
      slug === product.slug &&
      price === product.price &&
      category === product.category &&
      image === product.image &&
      brand === product.brand &&
      stock === product.stock &&
      description === product.description
    ) {
      toastPop("warning", "Product not any change");
      return;
    }
    try {
      await editProduct.mutateAsync({
        name,
        slug,
        price,
        category,
        image,
        brand,
        stock,
        description,
      });

      toastPop(
        "success",
        "Product updated successfully",
        null,
        null,
        null,
        2000
      );
      const timeDelay = setTimeout(() => router.push("/admin/products"), 2000);
      return () => clearTimeout(timeDelay);
    } catch (err) {
      toastPop(
        "error",
        editProduct.isError ? editProduct.error.message : getError(err)
      );
    }
  };

  return (
    <Layout title="Edit Product">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard" className="blueLink text-lg">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className="blueLink text-lg">
                Orders
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products"
                className=" font-bold blueLink text-lg"
              >
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="blueLink text-lg">
                Users
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          {isFetching && !window.navigator.onLine ? (
            <div className="alert-error">
              Your is Offline Please check your connection
            </div>
          ) : isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(editProductHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit Product: ${id}`}</h1>
              <FormControls name="name" type="text" register={register}>
                {errors.name && (
                  <div className="text-red-500">{errors.name.message}</div>
                )}
              </FormControls>

              <FormControls name="slug" type="text" register={register}>
                {errors.slug && (
                  <div className="text-red-500">{errors.slug.message}</div>
                )}
              </FormControls>

              <FormControls
                name="price"
                type="number"
                min="1"
                register={register}
              >
                {errors.price && (
                  <div className="text-red-500">{errors.price.message}</div>
                )}
              </FormControls>

              <FormControls
                name="image"
                type="text"
                register={register}
                regex={/^.+\.(jpe?g|png)$/i}
              >
                {errors.image && (
                  <div className="text-red-500">{errors.image.message}</div>
                )}
              </FormControls>

              <div className="mb-4">
                <label htmlFor="imageFile">Upload image</label>
                <input
                  type="file"
                  className="w-full"
                  name="imageFile"
                  id="imageFile"
                  onChange={uploadImageHandler}
                />
                {uploadImage.isLoading && <div>Uploading....</div>}
              </div>

              <FormControls name="category" type="text" register={register}>
                {errors.category && (
                  <div className="text-red-500">{errors.category.message}</div>
                )}
              </FormControls>

              <FormControls name="brand" type="text" register={register}>
                {errors.brand && (
                  <div className="text-red-500">{errors.brand.message}</div>
                )}
              </FormControls>

              <FormControls
                name="stock"
                type="number"
                min="0"
                register={register}
              >
                {errors.stock && (
                  <div className="text-red-500">{errors.stock.message}</div>
                )}
              </FormControls>

              <FormControls name="description" type="text" register={register}>
                {errors.description && (
                  <div className="text-red-500">
                    {errors.description.message}
                  </div>
                )}
              </FormControls>

              <div className="mb-4">
                <button
                  disabled={editProduct.isLoading || editProduct.isSuccess}
                  className={`primary-button transition-[background-color] ease-linear ${
                    editProduct.isSuccess &&
                    "bg-green-400 hover:bg-green-500 cursor-auto "
                  } w-[6rem] cursor-pointer`}
                >
                  {editProduct.isLoading ? (
                    <center>
                      <SpinnerCircularFixed
                        size={24}
                        thickness={92}
                        speed={180}
                        color="#2b364a"
                        secondaryColor="#fff"
                      />
                    </center>
                  ) : editProduct.isSuccess ? (
                    "Updated"
                  ) : (
                    "Update"
                  )}
                </button>
              </div>

              <div className="mb-4">
                <Link href={`/admin/products`} className="blue-button px-6">
                  &#8678; Back
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminProductEditPage.auth = { adminOnly: true };
