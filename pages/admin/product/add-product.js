import axios from "axios";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Layout from "../../../components/Layout";
import { useEffect } from "react";
import FormControls from "../../../components/Admin/FormControls";
import { SpinnerCircularFixed } from "spinners-react";
import { usePostAPI } from "../../../utils/useMutationAPI";
import toastPop from "../../../utils/toastPop";
import { getError } from "../../../utils/error";
import { useRouter } from "next/router";

export default function CreateProductPage() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    setValue, //setValue('nameRegis',value)
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("name", "sample name");
    setValue("slug", "sample-name-slug");
    setValue("price", 1);
    setValue("category", "sample category");
    setValue("brand", "sample brand");
    setValue("stock", 1);
    setValue("description", "sample description");
  }, [setValue]);

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

  const postProduct = usePostAPI("admin-products", "/api/admin/products");
  const postProductHandler = async ({
    name,
    slug,
    category,
    image,
    price,
    brand,
    stock,
    description,
  }) => {
    if (
      name === "sample name" ||
      slug === "sample-name-slug" ||
      category === "sample category" ||
      price === 0 ||
      brand === "sample brand" ||
      description === "sample description"
    ) {
      toastPop("warning", "Product default not change or invalid");
      return;
    }
    if (!image) return toastPop("warning", "Please upload Image");
    try {
      await postProduct.mutateAsync({
        name,
        slug,
        category,
        image,
        price: Number(price),
        brand,
        stock: Number(stock),
        description,
      });

      toastPop(
        "success",
        "Product created successfully",
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
        postProduct.isError ? postProduct.error.message : getError(err)
      );
    }
  };

  return (
    <Layout title="Create Product">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">
                <a className="blueLink text-lg">Dashboard</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/orders">
                <a className=" blueLink text-lg">Orders</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/products">
                <a className=" font-bold blueLink text-lg">Products</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">
                <a className="blueLink text-lg">Users</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          {typeof window !== "undefined" && !window.navigator.onLine ? (
            <div className="alert-error">
              Your is Offline Please check your connection
            </div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(postProductHandler)}
            >
              <h1 className="mb-4 text-xl">Create Product</h1>
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

              <input
                type="hidden"
                className="w-full"
                name="image"
                id="image"
                onChange={uploadImageHandler}
              />

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
                  disabled={postProduct.isLoading || postProduct.isSuccess}
                  className={`primary-button transition-[background-color] ease-linear ${
                    postProduct.isSuccess &&
                    "bg-green-400 hover:bg-green-500 cursor-auto "
                  } w-[8rem] cursor-pointer`}
                >
                  {postProduct.isLoading ? (
                    <center>
                      <SpinnerCircularFixed
                        size={24}
                        thickness={92}
                        speed={180}
                        color="#2b364a"
                        secondaryColor="#fff"
                      />
                    </center>
                  ) : postProduct.isSuccess ? (
                    "Created"
                  ) : (
                    "Add Product"
                  )}
                </button>
              </div>

              <div className="mb-4">
                <Link href={`/admin/products`}>
                  <a className="blue-button px-6">&#8678; Back</a>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

CreateProductPage.auth = { adminOnly: true };
