import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createProduct } from "@/redux/slices/adminProductSlice";
import { toast } from "sonner";

const CreateProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: [],
    });

    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);

        try {
            setUploading(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, { url: data.imageUrl, altText: "" }],
            }));
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error("Image upload failed");
        }
    };

    const handleImageDelete = async (imageUrl) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            // Extract public ID from Cloudinary URL
            const urlParts = imageUrl.split('/');
            const filenameRegex = /v\d+\/(.*)\.[a-zA-Z]+$/;
            const match = imageUrl.match(filenameRegex);

            if (match && match[1]) {
                const publicId = match[1];

                await axios.delete(
                    `${import.meta.env.VITE_BACKEND_URL}/api/upload/${encodeURIComponent(publicId)}`,
                );

                // Remove the image from the local state
                setProductData((prevData) => ({
                    ...prevData,
                    images: prevData.images.filter((img) => img.url !== imageUrl),
                }));

                toast.success("Image deleted successfully");
            } else {
                console.error("Could not extract public ID from URL");
                toast.error("Failed to delete image: invalid URL");
            }

        } catch (error) {
            console.error("Error deleting image:", error);
            toast.error("Failed to delete image");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createProduct(productData)).unwrap();
            toast.success("Product created successfully!");
            navigate("/admin/products");
        } catch (error) {
            console.error("Failed to create product:", error);
            toast.error(error || "Failed to create product");
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-sm rounded-xl border border-gray-100">
            <h2 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight">Create New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors outline-none"
                        required
                        placeholder="e.g. Classic T-Shirt"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors outline-none"
                        rows={4}
                        required
                        placeholder="Product details..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={productData.price}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors outline-none"
                            required
                        />
                    </div>

                    {/* Count In Stock */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Count in Stock</label>
                        <input
                            type="number"
                            name="countInStock"
                            value={productData.countInStock}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors outline-none"
                            required
                        />
                    </div>

                    {/* SKU */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                        <input
                            type="text"
                            name="sku"
                            value={productData.sku}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors outline-none"
                            required
                            placeholder="e.g. TSHIRT-001"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={productData.category}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors outline-none"
                            required
                            placeholder="e.g. Topwear"
                        />
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            value={productData.brand}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors outline-none"
                            placeholder="e.g. Rabbit"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                            name="gender"
                            value={productData.gender}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors outline-none bg-white"
                        >
                            <option value="">Select Gender</option>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Unisex">Unisex</option>
                        </select>
                    </div>

                    {/* Collections */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Collections</label>
                        <input
                            type="text"
                            name="collections"
                            value={productData.collections}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors outline-none"
                            required
                            placeholder="e.g. Summer Collection"
                        />
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sizes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sizes (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="sizes"
                            value={productData.sizes.join(", ")}
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    sizes: e.target.value.split(",").map((size) => size.trim()),
                                })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors outline-none"
                            placeholder="e.g. S, M, L, XL"
                        />
                    </div>

                    {/* Colors */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Colors (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="colors"
                            value={productData.colors.join(", ")}
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    colors: e.target.value.split(",").map((color) => color.trim()),
                                })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors outline-none"
                            placeholder="e.g. Red, Blue, Black"
                        />
                    </div>
                </div>

                {/* Image Upload */}
                <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                    <input type="file" onChange={handleImageUpload} className="mb-4 text-sm" />
                    {uploading && <p className="text-sm text-blue-500 font-medium mb-4">Uploading image...</p>}
                    <div className="flex gap-4 flex-wrap">
                        {productData.images.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image.url}
                                    alt={image.altText || "Product Image"}
                                    className="w-24 h-24 object-cover rounded-md shadow-sm border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleImageDelete(image.url)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        {productData.images.length === 0 && (
                            <div className="w-24 h-24 rounded-md border-2 border-dashed flex items-center justify-center text-gray-400 text-xs text-center p-2">
                                No images
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                >
                    Create Product
                </button>
            </form>
        </div>
    );
};

export default CreateProductPage;
