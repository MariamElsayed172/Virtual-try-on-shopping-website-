import { useContext } from "react";
import { CategoryContext } from "../../../Func/context/Admin/CategoryContextProvider";
import { BrandContext } from "../../../Func/context/Admin/BrandContextProvider";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../../../Func/context/AuthContextProvider";
import { ClipLoader } from "react-spinners";

export default function AdminProducts() {
  const { GetCategory } = useContext(CategoryContext);
  const { GetBrand } = useContext(BrandContext);
  const { cookies } = useContext(AuthContext);

  const token = cookies.accessToken;

  const { data: categories } = useQuery({
    queryKey: ["getCategory"],
    queryFn: GetCategory,
  });

  const { data: brands } = useQuery({
    queryKey: ["getBrand"],
    queryFn: GetBrand,
  });

  async function CreateProduct({
    name,
    description,
    price,
    category,
    stock,
    attributes,
    defaultImage,
    AIimage,
    images,
    brandId,
    discount = 0,
  }) {
    try {
      if (discount > 100) {
        throw new Error("Discount cannot exceed 100%");
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("stock", stock);
      formData.append("discount", discount);
      formData.append("brandId", brandId);
      formData.append("defaultImage", defaultImage);
      formData.append("AIimage", AIimage);

      images.forEach((image) => {
        formData.append("images", image);
      });

      formData.append("attributes", JSON.stringify(attributes));

      const response = await axios.post(
        "https://e-prova.vercel.app/Product/create-product",
        formData,
        {
          headers: { token },
        }
      );

      toast.success("Product created successfully");
      return response.data;
    } catch (error) {
      console.error("CreateProduct Error:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to create product");
    }
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      color: "",
      sizes: [],
      defaultImage: null,
      images: [],
      AIimage: null,
      brandId: "",
      discount: 0,
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .required("Product name is required")
        .min(3, "Product name must be at least 3 characters")
        .max(50, "Product name must be at most 50 characters"),
      description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(200, "Description must be at most 200 characters"),
      price: Yup.number()
        .required("Price is required")
        .min(0, "Price must be at least 0"),
      stock: Yup.number()
        .required("Stock is required")
        .min(0, "Stock must be at least 0"),
      discount: Yup.number()
        .min(0, "Discount must be at least 0")
        .max(100, "Discount must be at most 100"),
      category: Yup.string().required("Category is required"),
      brandId: Yup.string().required("Brand is required"),
      color: Yup.string(),
      sizes: Yup.array().min(1, "At least one size is required"),
      defaultImage: Yup.mixed().required("Default image is required"),
      images: Yup.array().min(1, "At least one image is required"),
      AIimage: Yup.mixed().required("AI image is required"),
    }),

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const attributes = {
        color: values.color,
        sizes: values.sizes,
      };

      try {
        await CreateProduct({
          ...values,
          attributes,
        });
        resetForm();
      } catch (error) {
        console.log("🚀 Debug ~ onSubmit: ~ error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <form
        className="container mx-auto p-0 mb-10"
        onSubmit={formik.handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* product title */}
            <div className="bg-white shadow rounde  d-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Product Title *</h2>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter product name"
                value={formik.values.name}
                onChange={(e) => {
                  formik.setFieldValue("name", e.target.value); // Update the field value
                }}
              />
            </div>

            {/* description */}
            <div className="bg-white shadow rounded-lg p-6 mt-4">
              <h2 className="text-xl font-semibold mb-4">Description *</h2>
              <textarea
                className="w-full p-2 border rounded"
                rows="6"
                placeholder="Enter long description"
                value={formik.values.description}
                onChange={(e) => {
                  formik.setFieldValue("description", e.target.value); // Update the field value
                }}
              ></textarea>
            </div>

            {/* pricing */}
            <div className="bg-white shadow rounded-lg p-6 mt-4">
              <h2 className="text-xl font-semibold mb-4">Pricing ($)</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Regular Price *</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="Regular price"
                    value={formik.values.price}
                    onChange={(e) => {
                      formik.setFieldValue("price", e.target.value); // Update the field value
                    }}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Sale Price *</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="Sale price"
                    max="100"
                    value={formik.values.discount}
                    onChange={(e) => {
                      formik.setFieldValue("discount", e.target.value); // Update the field value
                    }}
                  />
                </div>
              </div>
            </div>

            {/* inventory */}
            <div className="bg-white shadow rounded-lg p-6 mt-4">
              <h2 className="text-xl font-semibold mb-4">Inventory</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-gray-700">Stock *</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    placeholder="Stock"
                    value={formik.values.stock}
                    onChange={(e) => {
                      formik.setFieldValue("stock", e.target.value); // Update the field value
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 mt-4 grid grid-cols-2 gap-4">
              {/* main image */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Main Picture </h2>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    formik.setFieldValue("defaultImage", file); // Update the field value
                  }}
                />
                {formik.touched.defaultImage && formik.errors.defaultImage && (
                  <div className="text-red-500">
                    {formik.errors.defaultImage}
                  </div>
                )}
              </div>

              {/* sub images */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Sub Images *{" "}
                  <span className="text-sm text-gray-500">(max 5)</span>{" "}
                </h2>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    formik.setFieldValue("images", files); // Update the field value
                  }}
                  multiple
                />
                {formik.touched.images && formik.errors.images && (
                  <>
                    {formik.values.images.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt="Product"
                        className="w-full object-cover rounded"
                      />
                    ))}
                  </>
                )}
              </div>

              {/* AI Image */}
              <div>
                <h2 className="text-xl font-semibold mb-4">AI Picture </h2>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    formik.setFieldValue("AIimage", file);
                  }}
                />
                {formik.touched.AIimage && formik.errors.AIimage && (
                  <div className="text-red-500">{formik.errors.AIimage}</div>
                )}
              </div>
            </div>
          </div>

          <div>
            {/* attributes */}
            <div className="bg-white shadow rounded-lg p-6 mt-4">
              <h2 className="text-xl font-semibold mb-4">Attributes</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Color *</label>
                  <select
                    className="w-full p-2 border rounded"
                    {...formik.getFieldProps("color")}
                    onChange={(e) => {
                      formik.setFieldValue("color", e.target.value);
                    }}
                  >
                    <option value="">Select a color</option>
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="yellow">Yellow</option>
                    <option value="orange">Orange</option>
                    <option value="purple">Purple</option>
                    <option value="pink">Pink</option>
                    <option value="brown">Brown</option>
                    <option value="gray">Gray</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="copper">Copper</option>
                    <option value="bronze">Bronze</option>
                    <option value="turquoise">Turquoise</option>
                    <option value="teal">Teal</option>
                    <option value="lavender">Lavender</option>
                    <option value="peach">Peach</option>
                    <option value="mint">Mint</option>
                    <option value="crimson">Crimson</option>
                    <option value="coral">Coral</option>
                    <option value="salmon">Salmon</option>
                    <option value="beige">Beige</option>
                    <option value="khaki">Khaki</option>
                    <option value="tan">Tan</option>
                    <option value="olive">Olive</option>
                    <option value="lime">Lime</option>
                    <option value="aqua">Aqua</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700">Size *</label>
                  <div className="flex flex-wrap mt-2">
                    <div className="flex items-center mr-4">
                      <input
                        id="size-s"
                        type="checkbox"
                        value="s"
                        className="mr-2"
                        onChange={(e) => {
                          formik.setFieldValue(
                            "sizes",
                            e.target.checked
                              ? [...formik.values.sizes, "s"]
                              : formik.values.sizes.filter(
                                  (size) => size !== "s"
                                )
                          );
                        }}
                        checked={formik.values.sizes.includes("s")}
                      />
                      <label htmlFor="size-s" className="text-sm">
                        S
                      </label>
                    </div>
                    <div className="flex items-center mr-4">
                      <input
                        id="size-m"
                        type="checkbox"
                        value="m"
                        className="mr-2"
                        onChange={(e) => {
                          formik.setFieldValue(
                            "sizes",
                            e.target.checked
                              ? [...formik.values.sizes, "m"]
                              : formik.values.sizes.filter(
                                  (size) => size !== "m"
                                )
                          );
                        }}
                        checked={formik.values.sizes.includes("m")}
                      />
                      <label htmlFor="size-m" className="text-sm">
                        M
                      </label>
                    </div>
                    <div className="flex items-center mr-4">
                      <input
                        id="size-l"
                        type="checkbox"
                        value="l"
                        className="mr-2"
                        onChange={(e) => {
                          formik.setFieldValue(
                            "sizes",
                            e.target.checked
                              ? [...formik.values.sizes, "l"]
                              : formik.values.sizes.filter(
                                  (size) => size !== "l"
                                )
                          );
                        }}
                        checked={formik.values.sizes.includes("l")}
                      />
                      <label htmlFor="size-l" className="text-sm">
                        L
                      </label>
                    </div>
                    <div className="flex items-center mr-4">
                      <input
                        id="size-xl"
                        type="checkbox"
                        value="xl"
                        className="mr-2"
                        onChange={(e) => {
                          formik.setFieldValue(
                            "sizes",
                            e.target.checked
                              ? [...formik.values.sizes, "xl"]
                              : formik.values.sizes.filter(
                                  (size) => size !== "xl"
                                )
                          );
                        }}
                        checked={formik.values.sizes.includes("xl")}
                      />
                      <label htmlFor="size-xl" className="text-sm">
                        XL
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* category */}

            <div className="bg-white shadow rounded-lg p-6 mt-4">
              <h2 className="text-xl font-semibold mb-4">Category</h2>
              <div className="flex flex-wrap -mx-2">
                {categories?.data?.categories?.map((category) => (
                  <label
                    className="flex items-center px-2 py-1 mr-2 mb-2 bg-white border rounded"
                    key={category._id}
                  >
                    <input
                      type="radio"
                      value={category._id}
                      className="mr-2"
                      onChange={(e) => {
                        formik.setFieldValue("category", e.target.value);
                      }}
                      checked={formik.values.category === category._id}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            {/* brand */}

            <div className="bg-white shadow rounded-lg p-6 mt-4">
              <h2 className="text-xl font-semibold mb-4">Brand</h2>
              <div className="flex flex-wrap -mx-2">
                {brands?.data?.data?.map((brand) => (
                  <label
                    className="flex items-center px-2 py-1 mr-2 mb-2 bg-white border rounded"
                    key={brand._id}
                  >
                    <input
                      type="radio"
                      name="brand"
                      value={brand._id}
                      className="mr-2"
                      checked={formik.values.brandId === brand._id}
                      onChange={(e) => {
                        formik.setFieldValue("brandId", e.target.value);
                      }}
                    />

                    {brand.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 mt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <ClipLoader color="white" size={20} />
                ) : (
                  "Create Product"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
