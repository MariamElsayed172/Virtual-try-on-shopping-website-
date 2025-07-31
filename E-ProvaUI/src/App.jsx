import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./Func/context/AuthContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
// User
import Login from "./Pages/Auth/Login";
import Layout from "./Pages/Layout/Layout";
import Register from "./Pages/Auth/Register";
import Home from "./Pages/Home/Home";
import ForgetPassword from "./Pages/Auth/ForgetPassword";
import NotFound from "./Pages/NotFound/NotFound";
import WishList from "./Pages/WishList/WishList";
import Products from "./Pages/products/Products";
import NewArrivals from "./Pages/NewArrivals/NewArrivals";
import Blog from "./Pages/blog/Blog";
import Cart from "./Pages/Cart/Cart";
import ResetCode from "./Pages/Auth/RsetCode";
import AdminLayout from "./Pages/Layout/Admin/AdminLayout";
import Dashboard from "./Pages/Admin/Dashboard";
// Admin
import AdminOrders from "./Pages/Admin/AdminOrders";
import AdminReviews from "./Pages/Admin/AdminReviews";
import ManageProduct from "./Pages/Admin/Product/ManageProduct";
import AdminProducts from "./Pages/Admin/Product/AdminProducts";
import AdminCategories from "./Pages/Admin/Category/AdminCategories";
import ManageCategories from "./Pages/Admin/Category/ManageCategories";
import AdminBrands from "./Pages/Admin/Brand/AdminBrands";
import ManageBrands from "./Pages/Admin/Brand/ManageBrands";
import { BrandContextProvider } from "./Func/context/Admin/BrandContextProvider";
import ProtectedPath from "./Pages/Auth/ProtectedPath";
import { CategoryContextProvider } from "./Func/context/Admin/CategoryContextProvider";
import { ProductContextProvider } from "./Func/context/Admin/ProductContextProvider";
import { WishListContextProvider } from "./Func/context/WishListContextProvider";
import { CartContextProvider } from "./Func/context/CartContextProvider";
import ProductDetails from "./Pages/products/ProductDetails";
import { ReviewContextProvider } from "./Func/context/ReviewContextProvider";
import OrderForm from "./Pages/Order/OrderForm";
import { OrderContextProvider } from "./Func/context/OrderContextProvider";
import SuccessOrder from "./Pages/Order/SuccessOrder";
import FaildOrder from "./Pages/Order/FaildOrder";
import Outfit from "./Pages/Ai/Outfit";
import Cust_Orders from "./Pages/Order/Cust_Orders";

const queryClient = new QueryClient();

function App() {
  const route = createBrowserRouter([
    // User
    {
      path: "/e-prova",
      element: <Layout />,
      children: [
        {
          path: "/e-prova/*",
          element: <NotFound />,
        },
        {
          path: "/e-prova",
          element: <Login />,
        },
        {
          path: "/e-prova/login",
          element: <Login />,
        },
        {
          path: "/e-prova/register",
          element: <Register />,
        },
        {
          path: "/e-prova/forgotpassword",
          element: <ForgetPassword />,
        },
        {
          path: "/e-prova/home",
          element: <Home />,
        },
        {
          path: "/e-prova/wishlist",
          element: <WishList />,
        },
        {
          path: "/e-prova/products",
          element: <Products />,
        },
        {
          path: "/e-prova/products/:id",
          element: <ProductDetails />,
        },
        {
          path: "/e-prova/newarrivals",
          element: <NewArrivals />,
        },
        {
          path: "/e-prova/blog",
          element: <Blog />,
        },
        {
          path: "/e-prova/cart",
          element: <Cart />,
        },
        {
          path: "/e-prova/resetcode",
          element: <ResetCode />,
        },
        {
          path: "/e-prova/order/:id",
          element: <OrderForm />,
        },
        {
          path: "/e-prova/order/success",
          element: <SuccessOrder />,
        },
        {
          path: "/e-prova/order/faild",
          element: <FaildOrder />,
        },
        {
          path: "/e-prova/outfit/:id",
          element: <Outfit />,
        },
        {
          path: "/e-prova/orders",
          element: <Cust_Orders />,
        }
      ],
    },
    // Admin
    {
      path: "/e-prova/admin",
      element: (
        <ProtectedPath>
          <AdminLayout />
        </ProtectedPath>
      ),
      children: [
        {
          path: "/e-prova/admin/dashboard",
          element: (
            <ProtectedPath>
              <Dashboard />
            </ProtectedPath>
          ),
        },
        {
          path: "/e-prova/admin/*",
          element: (
            <ProtectedPath>
              <NotFound />
            </ProtectedPath>
          ),
        },
        {
          path: "/e-prova/admin",
          element: (
            <ProtectedPath>
              <Dashboard />
            </ProtectedPath>
          ),
        },
        {
          path: "/e-prova/admin/products/manage",
          element: (
            <ProtectedPath>
              <ManageProduct />
            </ProtectedPath>
          ),
        },
        {
          path: "/e-prova/admin/products",
          element: (
            <ProtectedPath>
              <AdminProducts />
            </ProtectedPath>
          ),
        },
        {
          path: "/e-prova/admin/categories",
          element: (
            <ProtectedPath>
              <AdminCategories />
            </ProtectedPath>
          ),
        },
        {
          path: "/e-prova/admin/categories/manage",
          element: (
            <ProtectedPath>
              <ManageCategories />
            </ProtectedPath>
          ),
        },
        {
          path: "/e-prova/admin/brands",
          element: (
            <ProtectedPath>
              <AdminBrands />
            </ProtectedPath>
          ),
        },
        {
          path: "/e-prova/admin/brands/manage",
          element: (
            <ProtectedPath>
              <ManageBrands />
            </ProtectedPath>
          ),
        },
        {
          path: "/e-prova/admin/orders",
          element: (
            <ProtectedPath>
              <AdminOrders />
            </ProtectedPath>
          ),
        },
        {
          path: "/e-prova/admin/reviews",
          element: (
            <ProtectedPath>
              <AdminReviews />
            </ProtectedPath>
          ),
        },
      ],
    },
    // 404
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return (
    <div className="">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CategoryContextProvider>
            <BrandContextProvider>
              <ProductContextProvider>
                <WishListContextProvider>
                  <CartContextProvider>
                    <ReviewContextProvider>
                      <OrderContextProvider>
                        <Toaster position="top-right" reverseOrder={false} />
                        <RouterProvider router={route} />
                      </OrderContextProvider>
                    </ReviewContextProvider>
                  </CartContextProvider>
                </WishListContextProvider>
              </ProductContextProvider>
            </BrandContextProvider>
          </CategoryContextProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
