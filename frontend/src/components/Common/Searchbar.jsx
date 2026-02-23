import { fetchProductsByFilters, setFilters } from "@/redux/slices/productSlice";
import React, { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Searchbar = () => {
  const [searchTerm, setSearchterm] = useState("");
  const [isOpen, setisOpen] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSearchToggle = () => {
    setisOpen(!isOpen);
  };

  const handleSearch=(e)=>{
    e.preventDefault();
    dispatch(setFilters({search: searchTerm}))
    dispatch(fetchProductsByFilters({search: searchTerm}))
    navigate(`/collections/all?search=${searchTerm}`)
    setisOpen(false)
  }

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"
      }`}
    >
      {isOpen ? (
        <form onSubmit={handleSearch}className="relative flex items-center justify-center w-full">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="search"
              value={searchTerm}
              onChange={(e) => setSearchterm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pl-2 pr-12 focus:outline-none w-full placeholder:bg-gray-100"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-9 top-4 -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass />
        </button>
      )}
    </div>
  );
};

export default Searchbar;
