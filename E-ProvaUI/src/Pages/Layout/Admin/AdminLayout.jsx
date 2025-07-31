import { Outlet } from "react-router";
import AdminNav from "./AdminNav";

export default function AdminLayout() {
  return (
    <>
    <div className="mx-3 mt-32">
      <AdminNav />
      <Outlet />
    </div>
      
    </>
  )
}
