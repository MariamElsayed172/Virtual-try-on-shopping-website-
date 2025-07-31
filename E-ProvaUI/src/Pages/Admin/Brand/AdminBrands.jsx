import { useContext } from "react";
import { Fade } from "react-awesome-reveal";
import { BrandContext } from "../../../Func/context/Admin/BrandContextProvider";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CategoryContext } from "../../../Func/context/Admin/CategoryContextProvider";
import toast from "react-hot-toast";

export default function AdminBrands() {
  const { CreateBrand } = useContext(BrandContext);
  const { GetCategory } = useContext(CategoryContext);
  const { data } = useQuery({
    queryKey: ["GetCategory"],
    queryFn: GetCategory,
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      logo: null,
      categories: [],
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      logo: Yup.mixed().required("Brand logo is required"),
      categories: Yup.array().min(1, "At least one category is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await CreateBrand(values.logo, values.title, values.categories);
        toast.success("Brand created successfully");
        resetForm();
      } catch (error) {
        toast.error("Error creating brand", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <Fade delay={200} duration={1000} triggerOnce fraction={0.5} direction="left">
        <div>
          <form className="container mx-auto p-0 mb-10" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                {/* Brand Title */}
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

                {/* Brand Logo Upload */}
                <div className="bg-white shadow rounded-lg p-6 mt-4">
                  <h2 className="text-xl font-semibold mb-4">Brand Logo *</h2>
                  <input
                    type="file"
                    className="w-full p-2 border rounded"
                    accept="image/*"
                    onChange={(e) => formik.setFieldValue("logo", e.target.files[0])}
                  />
                  {formik.touched.logo && formik.errors.logo && (
                    <div className="text-red-500">{formik.errors.logo}</div>
                  )}
                </div>

                {/* Category Selection */}
                <div className="mt-4">
                  <label className="block text-gray-700">Select Category *</label>
                  <select
                    className="w-full p-2 border rounded"
                    name="categories"
                    multiple
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                      formik.setFieldValue("categories", selectedOptions);
                    }}
                    value={formik.values.categories}
                  >
                    {data?.data?.categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {formik.touched.category && formik.errors.category && (
                    <div className="text-red-500">{formik.errors.category}</div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <div className="bg-white shadow rounded-lg p-6 mt-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center"
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? (
                      <>
                        <i className="fa-solid fa-stop mr-2"></i> Submitting...
                      </>
                    ) : (
                      "Add Brand"
                    )}
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
