import { Routes, Route } from 'react-router-dom'

import Layout from '../../shared/components/layout/Layout'
import AccountLayout from '../../shared/components/layout/AccountLayout'
import AdminLayout from '../../shared/components/layout/AdminLayout'
import AuthGuard from '../guards/AuthGuard'
import AdminGuard from '../guards/AdminGuard'
import HomePage from '../../modules/catalog/pages/HomePage'
import ProductsPage from '../../modules/catalog/pages/ProductsPage'
import ProductDetailPage from '../../modules/catalog/pages/ProductDetailPage'
import CategoryPage from '../../modules/catalog/pages/CategoryPage'
import LoginPage from '../../modules/auth/pages/LoginPage'
import RegisterPage from '../../modules/auth/pages/RegisterPage'
import ForgotPasswordPage from '../../modules/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '../../modules/auth/pages/ResetPasswordPage'
import VerifyEmailPage from '../../modules/auth/pages/VerifyEmailPage'
import ProfilePage from '../../modules/users/pages/ProfilePage'
import AddressesPage from '../../modules/users/pages/AddressesPage'
import WishlistPage from '../../modules/users/pages/WishlistPage'
import RecentlyViewedPage from '../../modules/users/pages/RecentlyViewedPage'
import ProductsAdminPage from '../../modules/catalog/pages/admin/ProductsAdminPage'
import CategoriesAdminPage from '../../modules/catalog/pages/admin/CategoriesAdminPage'
import TagsAdminPage from '../../modules/catalog/pages/admin/TagsAdminPage'
import AttributesAdminPage from '../../modules/catalog/pages/admin/AttributesAdminPage'
import NotFoundPage from '../../shared/components/errors/NotFoundPage'
import ForbiddenPage from '../../shared/components/errors/ForbiddenPage'

export default function AppRouter() {
  return (
    <Routes>

      {/*Storefront (with Navbar + Footer)*/}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />

        {/*Auth pages accessible when not logged in */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/*Error pages */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />

        {/*Account (auth required)*/}
        <Route
          path="/account"
          element={
            <AuthGuard>
              <AccountLayout />
            </AuthGuard>
          }
        >
          <Route path="profile" element={<ProfilePage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="recently-viewed" element={<RecentlyViewedPage />} />
        </Route>
      </Route>

      {/*Admin (role: ADMIN required, no storefront layout) */}
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route path="products" element={<ProductsAdminPage />} />
        <Route path="categories" element={<CategoriesAdminPage />} />
        <Route path="tags" element={<TagsAdminPage />} />
        <Route path="attributes" element={<AttributesAdminPage />} />
      </Route>
    </Routes>
  )
}
