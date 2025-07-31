import { useContext, useState } from "react";
import {
  AiFillDelete,
  AiFillEdit,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { ProductContext } from "../../../Func/context/Admin/ProductContextProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BsCurrencyDollar } from "react-icons/bs";
import Loader from "../../../Components/Loader";
import CantFetch from "../../../Components/CantFetch";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../../../Func/context/AuthContextProvider";
import { BrandContext } from "../../../Func/context/Admin/BrandContextProvider";
import { CategoryContext } from "../../../Func/context/Admin/CategoryContextProvider";
import NoData from "../../../Components/NoData";
import { ClipLoader } from "react-spinners";

export default function ManageProduct() {
  const [editingProduct, setEditingProduct] = useState(null); // Track the product being edited
  const [isFormVisible, setIsFormVisible] = useState(false); // Track form visibility
  const [deletingId, setDeletingId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { GetProduct, DeleteProduct } = useContext(ProductContext);
  const { GetBrand } = useContext(BrandContext);
  const { GetCategory } = useContext(CategoryContext);
  const { cookies } = useContext(AuthContext);
  const token = cookies.accessToken;
  const queryClient = useQueryClient();

  // Fetch products
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GetProduct"],
    queryFn: () => GetProduct(),
  });

  // Fetch brands
  const { data: brands } = useQuery({
    queryKey: ["getBrand"],
    queryFn: () => GetBrand(),
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["getCategory"],
    queryFn: () => GetCategory(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => DeleteProduct(id),
    onMutate: (id) => setDeletingId(id), // Set the deleting ID before mutation starts
    onSuccess: (_, id) => {
      queryClient.setQueryData(["GetProduct"], (oldData) => {
        return {
          ...oldData,
          data: {
            ...oldData.data,
            products: oldData.data.products.filter(
              (product) => product._id !== id
            ),
          },
        };
      });
    },
    onError: () => {
      console.log("Failed to delete product");
    },
    onSettled: () => setDeletingId(null), // Reset deleting ID when done
  });

  async function UpdateProduct({
    id, // Required: Product ID to update
    name,
    description,
    price,
    category,
    stock,
    attributes,
    defaultImage,
    images,
    brandId,
    discount,
  }) {
    try {
      if (discount && discount > 100) {
        throw new Error("Discount cannot exceed 100%");
      }

      const formData = new FormData();

      // Append only the fields that are provided
      if (name !== undefined) formData.append("name", name);
      if (description !== undefined) formData.append("description", description);
      if (price !== undefined) formData.append("price", price);
      if (category !== undefined) formData.append("category", category); // Send only the category ID
      if (stock !== undefined) formData.append("stock", stock);
      if (discount !== undefined) formData.append("discount", discount);
      if (brandId !== undefined) formData.append("brandId", brandId); // Send only the brand ID
      if (defaultImage instanceof File) {
        formData.append("defaultImage", defaultImage);
      }
      
      if (Array.isArray(images)) {
        images.forEach((image) => {
          if (image instanceof File) {
            formData.append("images", image);
          }
        });
      }
      

      if (attributes !== undefined) {
        formData.append("attributes", JSON.stringify(attributes));
      }

      const response = await axios.patch(
        `https://e-prova.vercel.app/Product/update-product/${id}`,
        formData,
        {
          headers: { token },
        }
      );

      toast.success("Product updated successfully");
      return response.data;
    } catch (error) {
      console.error("UpdateProduct Error:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <CantFetch />;
  }

  return (
    <>
    {data?.data?.products.length === 0 && <NoData />}

    <div className="overflow-x-auto">
      {/* Table */}
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">
              ID
            </th>
            <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">
              Name
            </th>
            <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">
              Price
            </th>
            <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">
              Category
            </th>
            <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">
              Brand
            </th>
            <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">
              Rate
            </th>
            <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-center">
          {data?.data?.products?.map((product) => (
            <tr key={product._id}>
              <td className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">
                {product._id}
              </td>
              <td className="px-4 py-2 font-medium whitespace-nowrap text-gray-900">
                {product.name}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                {product.price} <BsCurrencyDollar className="inline-block" />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                {product.category?.name || "N/A"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                {product.brandId?.name || "N/A"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                {Array.from(
                  { length: Math.floor(product.averageRating) },
                  (_, i) => (
                    <AiFillStar
                      key={i}
                      className="inline-block text-yellow-500"
                    />
                  )
                )}
                {product.averageRating % 1 !== 0 && (
                  <AiOutlineStar className="inline-block text-yellow-500" />
                )}
              </td>
              <td className="px-4 py-2 whitespace-nowrap flex gap-3 justify-center items-center">
                <button
                  onClick={() => deleteMutation.mutate(product._id)}
                  disabled={deletingId === product._id}
                  className={`inline-block rounded-sm px-4 py-2 text-xs font-medium text-white ${
                    deletingId === product._id
                      ? "bg-gray-400"
                      : "bg-red-500 hover:bg-red-700"
                  }`}
                >
                  {deletingId === product._id ? (
                    "Deleting..."
                  ) : (
                    <AiFillDelete size={20} />
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditingProduct({
                      ...product,
                      category: product.category._id, // Store only the category ID
                      brandId: product.brandId._id, // Store only the brand ID
                    });
                    setIsFormVisible(true); // Show the form
                  }}
                  className={`inline-block rounded-sm px-4 py-2 text-xs font-medium text-white ${
                    deletingId === product._id
                      ? "bg-gray-400"
                      : "bg-yellow-500 hover:bg-yellow-700"
                  }`}
                >
                  <AiFillEdit size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* edit product */}

      {isFormVisible && (
        <div className="container mx-auto p-0 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {/* Product Title */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Product Title *</h2>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="w-full p-2 border rounded"
                  value={editingProduct?.name || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* Description */}
              <div className="bg-white shadow rounded-lg p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Description *</h2>
                <textarea
                  className="w-full p-2 border rounded"
                  rows="6"
                  placeholder="Enter long description"
                  value={editingProduct?.description || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>

              {/* Pricing */}
              <div className="bg-white shadow rounded-lg p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Pricing ($)</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">
                      Regular Price *
                    </label>
                    <input
                      type="number"
                      placeholder="Regular price"
                      className="w-full p-2 border rounded"
                      value={editingProduct?.price || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Sale Price *</label>
                    <input
                      type="number"
                      placeholder="Sale price"
                      max="100"
                      className="w-full p-2 border rounded"
                      value={editingProduct?.discount || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          discount: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-white shadow rounded-lg p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Inventory</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-gray-700">Stock *</label>
                    <input
                      type="number"
                      placeholder="Stock"
                      className="w-full p-2 border rounded"
                      value={editingProduct?.stock || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div className="bg-white shadow rounded-lg p-6 mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Main Picture *</h2>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full"
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        defaultImage: e.target.files[0],
                      })
                    }
                  />
                </div>

                {/* Sub Images */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Sub Images *</h2>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full"
                    multiple
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        images: Array.from(e.target.files),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              {/* Attributes */}
              <div className="bg-white shadow rounded-lg p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Attributes</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Color *</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={editingProduct?.attributes?.color || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          attributes: {
                            ...editingProduct.attributes,
                            color: e.target.value,
                          },
                        })
                      }
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
                      {["s", "m", "l", "xl"].map((size) => (
                        <div key={size} className="flex items-center mr-4">
                          <input
                            type="checkbox"
                            value={size}
                            checked={editingProduct?.attributes?.sizes?.includes(
                              size
                            )}
                            onChange={(e) => {
                              const sizes =
                                editingProduct?.attributes?.sizes || [];
                              const updatedSizes = e.target.checked
                                ? [...sizes, size]
                                : sizes.filter((s) => s !== size);
                              setEditingProduct({
                                ...editingProduct,
                                attributes: {
                                  ...editingProduct.attributes,
                                  sizes: updatedSizes,
                                },
                              });
                            }}
                          />
                          <label className="text-sm">
                            {size.toUpperCase()}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* // Category Selection */}
              <div className="bg-white shadow rounded-lg p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Category</h2>
                <div className="flex flex-wrap -mx-2">
                  {categories?.data?.categories?.map((category) => (
                    <label
                      key={category._id}
                      className="flex items-center px-2 py-1 mr-2 mb-2 bg-white border rounded"
                    >
                      <input
                        type="radio"
                        value={category._id}
                        checked={editingProduct?.category === category._id}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            category: e.target.value, // Store only the category ID
                          })
                        }
                      />
                      <span className="ml-2">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* // Brand Selection */}
              <div className="bg-white shadow rounded-lg p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Brand</h2>
                <div className="flex flex-wrap -mx-2">
                  {brands?.data?.data?.map((brand) => (
                    <label
                      key={brand._id}
                      className="flex items-center px-2 py-1 mr-2 mb-2 bg-white border rounded"
                    >
                      <input
                        type="radio"
                        value={brand._id}
                        checked={editingProduct?.brandId === brand._id}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            brandId: e.target.value, // Store only the brand ID
                          })
                        }
                      />
                      <span className="ml-2">{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Submit Button */}
              <div className="bg-white shadow rounded-lg p-6 mt-4">
                <button
                  disabled={isUpdating}
                  type="button"
                  className="w-full bg-blue-600 text-white py-2 rounded"
                  onClick={async () => {
                    setIsUpdating(true);
                    try {
                      await UpdateProduct({
                        id: editingProduct._id,
                        name: editingProduct.name,
                        description: editingProduct.description,
                        price: editingProduct.price,
                        category: editingProduct.category,
                        stock: editingProduct.stock,
                        attributes: editingProduct.attributes,
                        defaultImage: editingProduct.defaultImage,
                        images: editingProduct.images,
                        brandId: editingProduct.brandId,
                        discount: editingProduct.discount,
                      });
                      setIsFormVisible(false);
                    } catch (error) {
                      console.log("🚀 ~ onClick={ ~ error:", error)
                    }
                    finally {
                      setIsUpdating(false);
                      refetch();
                    }
                  }}
                >
                  {isUpdating ? <ClipLoader color="#fff" size={20} /> : "Update Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
