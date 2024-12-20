import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OneListing from "./OneListing.jsx";

// tailwind edited by: ethan
function Products({ DatabaseURL }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = () => {
    fetch(`${DatabaseURL}/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  const openListingClick = (ListingID) => {
    navigate(`/listing/${ListingID}`);
  };

  return (
    <div className="w-full h-full p-2 flex text-black dark:text-white">
      <div className="w-full h-full p-4 grid grid-cols-6">
        {products.map((product) =>
          product.IsSold ? null : (
            <OneListing
              key={product.ListingID}
              product={product}
              openListingClick={openListingClick}
            />
          )
        )}
      </div>
    </div>
  );
}

export default Products;
