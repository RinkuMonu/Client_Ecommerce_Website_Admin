// AppRoutes.js

import { Routes, Route } from "react-router-dom";
import Dashboard from "../Components/Dashboard/Dashbord";
import ViewTicket from "../Components/Tables/Support/Viewticket";
import CreateTicket from "../Components/Pages/Support/Createsupportticket";
import ChangePassword from "../Components/Pages/Setting/Changepass";
import Profile from "../Components/Pages/Setting/Profile";
import EditProfile from "../Components/Pages/Setting/EditProfile";
import useAxiosInterceptors from "../axiosConfig";
import Websiteslist from "../Components/Tables/Website/Websiteslist";
import CategoryPage from "../Components/Tables/Categories/CategoryPage";
import ProductsPage from "../Components/Tables/Products/ProductsPage";
import UsersPage from "../Components/Tables/Users/UsersPage";
import OrdersPage from "../Components/Tables/Orders/OrdersPage";
import VendorsPage from "../Components/Tables/Vendors/VendorsPage";
import RichtextEditor from "../Components/Editor/RicktextEditor";
import PolicyPage from "../Components/Tables/Policy/PolicyPage";
import BannersPage from "../Components/Tables/Banner/BannerPage";
import ParentCategoryPage from "../Components/Tables/ParentCategories/ParentCategoryPage";
import CouponPage from "../Components/Tables/Coupons/CouponPage";
import NewsletterManager from "../Components/Tables/NewSletter/NewSletter";
import FAQManager from "../Components/Tables/Faqs/FAQManager";

const AppRoutes = () => {
  useAxiosInterceptors();
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/websites" element={<Websiteslist />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/ParentCategories" element={<ParentCategoryPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/vendors" element={<VendorsPage />} />
      <Route path="/textEditor" element={<RichtextEditor />} />
      <Route path="/policy" element={<PolicyPage />} />
      <Route path="/view-tickets" element={<ViewTicket />} />
      {/* <Route path="/create-ticket" element={<CreateTicket />} /> */}
      <Route path="/settings/profile" element={<Profile />} />
      <Route path="/settings/changepassword" element={<ChangePassword />} />
      <Route path="/settings/edit" element={<EditProfile />} />
      <Route path="/banners" element={<BannersPage />} />
      <Route path="/coupons" element={<CouponPage />} />
      <Route path="/NewSletter" element={<NewsletterManager />} />
      <Route path="/faqs" element={<FAQManager />} />
    </Routes>
  );
};

export default AppRoutes;
