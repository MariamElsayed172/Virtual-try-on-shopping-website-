import { useEffect, useState, useContext } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { FaStopwatch20 } from "react-icons/fa6";
import { BrandContext } from "../../../Func/context/Admin/BrandContextProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../../Components/Loader";
import CantFetch from "../../../Components/CantFetch";
import NoData from "../../../Components/NoData";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../../Func/context/AuthContextProvider";

export default function ManageBrands() {
  const { GetBrand, UpdateBrand } = useContext(BrandContext);
  const { cookies } = useContext(AuthContext);
  const token = cookies.accessToken;
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formEnabled, setFormEnabled] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getBrand"],
    queryFn: GetBrand,
  });

  useEffect(() => {
    const deleteBrand = async (id) => {
      if (!id) return;
      
      try {
        setDeletingId(id);
        await axios.delete(
          `https://e-prova.vercel.app/Brand/delete-brand/${id}`,
          {
            headers: { token },
          }
        );
        queryClient.invalidateQueries(["getBrand"]);
        toast.success("Brand deleted successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete brand");
      } finally {
        setDeletingId(null);
      }
    };

    if (deletingId) {
      deleteBrand(deletingId);
    }
  }, [deletingId, token, queryClient]);

  const formik = useFormik({
    initialValues: {
      title: "",
      logo: null,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      logo: Yup.mixed().nullable(),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!editingBrand) return;
      try {
        await UpdateBrand(editingBrand._id, {
          name: values.title,
          brand: values.logo || editingBrand.logo,
        });
        resetForm();
        setEditingBrand(null);
        setFormEnabled(false);
        queryClient.invalidateQueries(["getBrand"]);
      } catch (error) {
        console.log(error);
        toast.error("Error updating brand");
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (editingBrand) {
      formik.setValues({
        title: editingBrand.name,
        logo: editingBrand.logo,
      });
      setFormEnabled(true);
    }
  }, [editingBrand]);

  if (isLoading) return <Loader />;
  if (isError) return <CantFetch />;

  return (
    <div>
      {data?.data?.data.length === 0 && <NoData />}
      {data?.data?.data.map((brand) => (
        <div key={brand._id} className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-900">ID</th>
                <th className="px-4 py-2 font-medium text-gray-900">Logo</th>
                <th className="px-4 py-2 font-medium text-gray-900">Brand</th>
                <th className="px-4 py-2 font-medium text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-center">
              <tr>
                <td className="px-4 py-2 font-medium text-gray-900">
                  {brand._id}
                </td>
                <td className="px-4 py-2 flex justify-center items-center">
                  <img
                    src={brand.logo.url}
                    alt="logo"
                    className="w-14 h-14 rounded-md"
                  />
                </td>
                <td className="px-4 py-2 text-gray-700">{brand.name}</td>
                <td className="flex justify-center gap-5 px-4 py-2 items-center">
                  <button
                    onClick={() => setDeletingId(brand._id)}
                    disabled={deletingId === brand._id}
                    className={`px-4 py-2 text-xs font-medium text-white rounded-lg ${
                      deletingId === brand._id
                        ? "bg-gray-400"
                        : "bg-red-500 hover:bg-red-700"
                    }`}
                  >
                    {deletingId === brand._id ? (
                      <FaStopwatch20 size={20} />
                    ) : (
                      <AiFillDelete size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => setEditingBrand(brand)}
                    className="px-4 py-2 text-xs font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-700"
                  >
                    <FaEdit size={20} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      {/* edit brand */}
      {editingBrand && (
        <form
          className="container mx-auto p-0 mb-10"
          onSubmit={formik.handleSubmit}
          disabled={!formEnabled}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Brand Title *</h2>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter brand name"
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="text-red-500">{formik.errors.title}</div>
                )}
              </div>
              <div className="bg-white shadow rounded-lg p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Brand Logo *</h2>
                <input
                  type="file"
                  className="w-full p-2 border rounded"
                  accept="image/*"
                  onChange={(e) =>
                    formik.setFieldValue("logo", e.target.files[0])
                  }
                />
              </div>
            </div>
            <div>
              <div className="bg-white shadow rounded-lg p-6 mt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded"
                  disabled={formik.isSubmitting || !formEnabled}
                >
                  {formik.isSubmitting ? "Updating..." : "Update Brand"}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

