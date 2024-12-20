import React, { useState } from "react";
import Products from "./Landing/Products.jsx";
import Search from "./Landing/Search.jsx";
import AddProduct from "./Landing/AddProduct.jsx";

// Tailwind edited by: Mitchell
function Landing({ user, DatabaseURL }) {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddProductClick = () => {
    setIsAnimating(true);
    if (showAddProduct) {
      setTimeout(() => {
        setShowAddProduct(false);
      }, 300); // Match the duration of the slideOut animation
    } else {
      setShowAddProduct(true);
    }
  };

  const handleCloseAddProduct = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowAddProduct(false);
    }, 300); // Match the duration of the slideOut animation
  };

  return (
    <div className="w-full flex flex-col duration-300 bg-white dark:bg-[#202020]">
      <Search />
      <Products user={user} DatabaseURL={DatabaseURL} />
      <button
        onClick={handleAddProductClick}
        className="w-24 h-24 fixed z-10 bottom-10 right-10 flex justify-center items-center rounded-full bg-[#f6f6f6] dark:bg-[#171717] border-2 border-gray-300 dark:border-[#151515] text-white text-6xl shadow-xl"
      >
        <div
          className={`relative text-gray-400 dark:text-white transition-transform duration-300 ${
            showAddProduct ? "rotate-45" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-12"
          >
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
        </div>
      </button>
      <div
        className={`fixed top-0 right-0 w-5/12 h-full p-5 px-10 overflow-hidden border-0 transition-transform transform bg-[#e0e0e0] dark:bg-[#303030] ${
          showAddProduct ? "translate-x-0" : "translate-x-full"
        } ${isAnimating ? "duration-300" : ""}`}
        onTransitionEnd={() => {
          if (!showAddProduct) setIsAnimating(false);
        }}
      >
        {showAddProduct && (
          <>
            <AddProduct
              onProductAdded={handleCloseAddProduct}
              user={user}
              DatabaseURL={DatabaseURL}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Landing;
