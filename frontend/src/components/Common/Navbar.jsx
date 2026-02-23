import React, { useState } from "react";
import Searchbar from "./Searchbar";
import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3 } from "react-icons/hi2";
import CartDrawer from "../Layout/CartDrawer.jsx";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [Draweropen, setDraweropen] = useState(false);
  const [navDrawerOpen, setnavDrawerOpen] = useState(false);
  const { cart } = useSelector((state)=> state.cart)
  const { user } = useSelector((state) => state.auth)

  const cartItemCount=
        cart?.products?.reduce((total, product)=> total + product.quantity,0) || 0;

  const toggleNavDrawer = () => {
    setnavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDraweropen(!Draweropen);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <div>
          <Link to="/" className="text-2xl font-medium">
            Rabbit
          </Link>
        </div>

        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Men
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Women
          </Link>
          <Link
            to="/collections/all?category=Top Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Top Wear
          </Link>
          <Link
            to="/collections/all?category=Bottom Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Bottom Wear
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="block bg-black px-2 rounded text-sm text-white"
            >
              Admin
            </Link>
          )}

          <Link to="/profile">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          <button onClick={toggleCartDrawer} className="relative">
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>

          <div className="overflow-hidden">
            <Searchbar />
          </div>

          {/* ✅ HAMBURGER ICON — VISIBLE */}
          <button onClick={toggleNavDrawer}>
            <HiBars3 className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      <CartDrawer Draweropen={Draweropen} toggleCartDrawer={toggleCartDrawer} />

      {/* NAV DRAWER */}
      <div
        className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-3">
            <Link
              to="/collections/all?gender=Men"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Top Wear
            </Link>
            <Link
              to="/collections/all?category=Bottom Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
