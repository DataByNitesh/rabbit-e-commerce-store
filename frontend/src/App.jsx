import React from 'react'
import Home from './Pages/Home.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout.jsx'
import { Toaster } from "sonner"
import Login from './Pages/Login.jsx'
import Register from './Pages/Register.jsx'
import Profile from './Pages/Profile.jsx'
import CollectionPage from './Pages/CollectionPage.jsx'
import ProductDetails from './components/Products/ProductDetails.jsx'
import Checkout from './components/Cart/Checkout.jsx'
import OrderConfirmationPage from './components/Cart/OrderConfirmationPage.jsx'
import OrderDetailsPage from './Pages/OrderDetailsPage.jsx'
import MyOrdersPage from './Pages/MyOrdersPage.jsx'
import AdminLayout from './components/Admin/AdminLayout.jsx'
import AdminHomePage from './components/Admin/AdminHomePage.jsx'
import UserManagement from './components/Admin/UserManagement.jsx'
import ProductManagement from './components/Admin/ProductManagement.jsx'
import EditProductPage from './components/Admin/EditProductPage.jsx'
import OrderManagement from './components/Admin/OrderManagement.jsx'
import CreateProductPage from './components/Admin/CreateProductPage.jsx'

import { Provider } from "react-redux"
import store from './redux/store.js'
import ProtectedRoute from './components/Common/ProtectedRoute.jsx'


const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            className: "rounded-xl border border-gray-800 bg-gray-900 text-gray-100 shadow-xl",
            style: {
              padding: "16px 20px",
              fontSize: "15px",
              fontWeight: "500"
            }
          }}
        />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route
              path="order-confirmation"
              element={<OrderConfirmationPage />}
            />
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
          </Route>
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>}>
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="products/new" element={<CreateProductPage />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App