import { useContext, useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import { AiFillDelete } from "react-icons/ai";
import { CategoryContext } from "../../../Func/context/Admin/CategoryContextProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../../Components/Loader";
import CantFetch from "../../../Components/CantFetch";
import NoData from "../../../Components/NoData";
import { FaEdit, FaStopwatch20 } from "react-icons/fa";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ManageCategories() {
  const { GetCategory, DeleteCategory, UpdateCategory } = useContext(CategoryContext);
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getCategory"],
    queryFn: GetCategory,
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: DeleteCategory,
    onMutate: (id) => setDeletingId(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(["getCategory"], (oldData) => {
        if (!oldData || !oldData.data?.categories) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            categories: oldData.data.categories.filter(
              (category) => category._id !== id
            ),
          },
        };
      });
      queryClient.invalidateQueries(["getCategory"]);
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
    onSettled: () => setDeletingId(null),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().min(3).max(50).required("Required"),
      description: Yup.string().min(10).max(200).required("Required"),
      category: Yup.string().oneOf(["male", "female"]).required("Required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!editingCategory) return;
      try {
        await UpdateCategory(editingCategory._id, {
          name: values.title,
          description: values.description,
          gender: values.category,
        });
        resetForm();
        setEditingCategory(null);
        queryClient.invalidateQueries(["getCategory"]);
      } catch (error) {
        console.log("🚀 ~ onSubmit: ~ error:", error)
        
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (editingCategory) {
      formik.setValues({
        title: editingCategory.name,
        description: editingCategory.description,
        category: editingCategory.gender,
      });
    }
  }, [editingCategory]);

  if (isLoading) return <Loader />;
  if (isError) return <CantFetch />;

  return (
    <div>
      {data?.data?.categories.length === 0 && <NoData />}

      {data?.data?.categories.map((category) => (
        <Fade key={category._id} delay={200} duration={1000} fraction={0.5} direction="up">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-900">ID</th>
                  <th className="px-4 py-2 font-medium text-gray-900">Category</th>
                  <th className="px-4 py-2 font-medium text-gray-900">Sub-Category</th>
                  <th className="px-4 py-2 font-medium text-gray-900">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-center">
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-900">{category._id}</td>
                  <td className="px-4 py-2 text-gray-700">{category.name}</td>
                  <td className="px-4 py-2 text-gray-700">{category.gender}</td>
                  <td className="flex justify-center gap-5 px-4 py-2">
                    <button
                      onClick={() => deleteMutation.mutate(category._id)}
                      disabled={deletingId === category._id}
                      className={`rounded-lg px-4 py-2 text-xs font-medium text-white ${
                        deletingId === category._id ? "bg-gray-400" : "bg-red-500 hover:bg-red-700"
                      }`}
                    >
                      {deletingId === category._id ? <FaStopwatch20 size={20} /> : <AiFillDelete size={20} />}
                    </button>
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="rounded-lg bg-yellow-500 px-4 py-2 text-xs font-medium text-white hover:bg-yellow-700"
                    >
                      <FaEdit size={20} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Fade>
      ))}

      {/* Update Category Form */}
      {editingCategory && (
        <form onSubmit={formik.handleSubmit} className="container mx-auto p-0 my-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Category Title *</h2>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter category name"
                  {...formik.getFieldProps("title")}
                  disabled={formik.isSubmitting}
                />
                {formik.touched.title && formik.errors.title && <div className="text-red-500">{formik.errors.title}</div>}
              </div>

              <div className="bg-white shadow rounded-lg p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Description *</h2>
                <textarea
                  className="w-full p-2 border rounded"
                  rows="6"
                  placeholder="Enter description"
                  {...formik.getFieldProps("description")}
                  disabled={formik.isSubmitting}
                />
                {formik.touched.description && formik.errors.description && <div className="text-red-500">{formik.errors.description}</div>}
              </div>
            </div>

            <div>
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Sub-Category</h2>
                <select name="category" className="w-full p-2 border rounded" {...formik.getFieldProps("category")} disabled={formik.isSubmitting}>
                  <option value="" label="Select category" />
                  <option value="male" label="Male" />
                  <option value="female" label="Female" />
                </select>
                {formik.touched.category && formik.errors.category && <div className="text-red-500">{formik.errors.category}</div>}
              </div>
              <div className="bg-white shadow rounded-lg p-6 mt-4">
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? "Updating..." : "Update Category"}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

