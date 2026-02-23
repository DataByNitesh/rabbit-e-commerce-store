import React, { useEffect, useState } from "react"; 
import Hero from "../components/Layout/Hero.jsx";
import GenderCollectionSection from "@/components/Products/GenderCollectionSection.jsx";
import NewArrival from "@/components/Products/NewArrival.jsx";
import ProductDetails from "@/components/Products/ProductDetails.jsx";
import ProductGrid from "@/components/Products/ProductGrid.jsx";
import FeaturedCollection from "@/components/Products/FeaturedCollection.jsx";
import FeaturesSection from "@/components/Products/FeaturesSection.jsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchProductsByFilters } from "@/redux/slices/productSlice.js"

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null); // ✅ Fixed capitalization

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      }),
    );

    // Fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`,
        );
        setBestSellerProduct(response.data); // ✅ Fixed capitalization
      } catch (error) {
        console.error(error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrival />

      {/* Best Seller */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center">Loading best seller product ...</p>
      )}

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      <FeaturedCollection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
