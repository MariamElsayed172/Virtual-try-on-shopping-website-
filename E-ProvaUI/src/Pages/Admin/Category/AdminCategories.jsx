import { useContext } from "react";
import { Fade } from "react-awesome-reveal";
import { CategoryContext } from "../../../Func/context/Admin/CategoryContextProvider";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AdminCategories() {
  const { CreateCategory } = useContext(CategoryContext);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      description: Yup.string()
        .min(10, "Must be 10 characters or more")
        .max(200, "Must be 200 characters or less")
        .required("Required"),
      category: Yup.string().oneOf(["male", "female"]).required("Required"),
    }),
    onSubmit: async (values, 
      { setSubmitting, 
        resetForm
       }) => {
      try {
        await CreateCategory(values.title, values.description, values.category);
        resetForm();
      } catch (error) {
        console.log("Error creating category:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <Fade
        delay={200} // Wait 200ms before starting
        duration={1000} // Animation lasts 1 second
        triggerOnce // Only animate once
        fraction={0.5} // Start animation when element is 50% visible
        direction="left"
      >
        <div>
          <form
            className="container mx-auto p-0 mb-10"
            onSubmit={formik.handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Category Title *
                  </h2>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter product name"
                    {...formik.getFieldProps("title")}
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.title}
                    </div>
                  ) : null}
                </div>

                <div className="bg-white shadow rounded-lg p-6 mt-4">
                  <h2 className="text-xl font-semibold mb-4">Description *</h2>
                  <textarea
                    className="w-full p-2 border rounded"
                    rows="6"
                    placeholder="Enter long description"
                    {...formik.getFieldProps("description")}
                  ></textarea>
                  {formik.touched.description && formik.errors.description ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.description}
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Sub-Category</h2>
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-gray-700">Category</label>
                    <select
                      name="category"
                      className="w-full p-2 border rounded"
                      {...formik.getFieldProps("category")}
                    >
                      <option value="" label="Select category" />
                      <option value="male" label="male" />
                      <option value="female" label="female" />
                    </select>
                    {formik.touched.category && formik.errors.category ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.category}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6 mt-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded"
                    disabled={formik.isSubmitting}
                    
                  >
                    {formik.isSubmitting ? "Loading..." : "Add Category"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Fade>
    </div>
  );
}
