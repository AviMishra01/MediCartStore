import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import AdminFooter from "./AdminFooter";
import Header from "./Header";
import DefaultNav from "./nav/DefaultNav";
import ShopNav from "./nav/ShopNav";
import BrandTop from "../site/BrandTop";
import AdminNav from "./nav/AdminNav"; // <-- import your AdminNav

export default function Layout() {
  const { pathname } = useLocation();

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/products");
  const isAuth = pathname === "/login" || pathname === "/signup";
  const isAdmin = pathname.startsWith("/admin"); // <-- check if admin page

  return (
    <div className="min-h-screen flex flex-col">
      {/* Conditional nav */}
      {isAdmin ? (
        <AdminNav />
      ) : isAuth ? (
        <BrandTop />
      ) : isHome ? (
        <Header />
      ) : isShop ? (
        <ShopNav />
      ) : (
        <DefaultNav />
      )}

      <main className="flex-1">
        <Outlet />
      </main>
      {isAdmin ? <AdminFooter /> : <Footer />}
    </div>
  );
}
