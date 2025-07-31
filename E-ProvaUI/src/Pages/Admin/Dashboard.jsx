import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Fade, Slide } from "react-awesome-reveal";
import { ProductContext } from "../../Func/context/Admin/ProductContextProvider";
import { BrandContext } from "../../Func/context/Admin/BrandContextProvider";
import { CategoryContext } from "../../Func/context/Admin/CategoryContextProvider";
import { ReviewContext } from "../../Func/context/ReviewContextProvider";
import { OrderContext } from "../../Func/context/OrderContextProvider";

export default function Dashboard() {
  const { GetProduct } = useContext(ProductContext);
  const { GetBrand } = useContext(BrandContext);
  const { GetCategory } = useContext(CategoryContext);
  const { getAllReviews } = useContext(ReviewContext);
  const { GetOrder } = useContext(OrderContext);

  const { data } = useQuery({
    queryKey: ["GetProduct"],
    queryFn: () => GetProduct(),
  });

  const { data: categories } = useQuery({
    queryKey: ["getCategory"],
    queryFn: () => GetCategory(),
  });

  const { data: brands } = useQuery({
    queryKey: ["getBrand"],
    queryFn: () => GetBrand(),
  });

  const { data: reviews } = useQuery({
    queryKey: ["getAllReviews"],
    queryFn: () => getAllReviews(),
  });

  const { data: orders } = useQuery({
    queryKey: ["getOrders"],
    queryFn: () => GetOrder(),
  });

  return (
    <div className="min-h-screen p-6">
      <main className="container mx-auto">
        <section className="features mb-6">
          <Fade cascade damping={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Slide className="h-full">
                <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col justify-center text-center">
                  <h3 className="text-gray-500 text-xs uppercase font-semibold">
                    TOTAL PRODUCTS
                  </h3>
                  <p className="text-5xl font-bold text-gray-900">
                    {data?.data.products.length}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col justify-center text-center">
                  <h3 className="text-gray-500 text-xs uppercase font-semibold">
                    TOTAL CATEGORIES
                  </h3>
                  <p className="text-5xl font-bold text-gray-900">
                    {categories?.data.categories.length}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col justify-center text-center">
                  <h3 className="text-gray-500 text-xs uppercase font-semibold">
                    TOTAL BRANDS
                  </h3>
                  <p className="text-5xl font-bold text-gray-900">
                    {brands?.data.data.length}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col justify-center text-center">
                  <h3 className="text-gray-500 text-xs uppercase font-semibold">
                    TOTAL ORDERS
                  </h3>
                  <p className="text-5xl font-bold text-gray-900">
                    {orders?.data?.data?.length ?? 0}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col justify-center text-center">
                  <h3 className="text-gray-500 text-xs uppercase font-semibold">
                    TOTAL REVIEWS
                  </h3>
                  <p className="text-5xl font-bold text-gray-900">
                    {reviews?.data.length}
                  </p>
                </div>
              </Slide>
            </div>
          </Fade>
        </section>
      </main>
    </div>
  );
}
