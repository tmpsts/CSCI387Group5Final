import React from "react";
import { haversineDistance, useUserLocation } from "./utils"; // Import the utility functions

function OneListing({ product, openListingClick }) {
  const userLocation = useUserLocation();

  const distance = userLocation
    ? haversineDistance(userLocation, {
        latitude: product.Latitude,
        longitude: product.Longitude,
      })
    : null;

  return (
    <div
      className="w-64 h-[24rem] flex flex-col items-center shadow-md rounded-xl bg-[#f9f9f9] dark:bg-[#404040] duration-100 hover:-translate-y-2"
      onClick={() => openListingClick(product.ListingID)}
    >
      <img
        src={product.Image}
        alt={product.Name}
        className="w-64 h-64 rounded-xl bg-[#353535]"
      />
      <div className="w-full py-2 px-4 flex flex-col">
        <p className="font-bold text-lg">${product.Price}</p>
        <h1 className="line-clamp-1">{product.Name}</h1>
        <p className="text-sm line-clamp-2 text-[#aaaaaa]">
          {product.Location}
        </p>
        {distance !== null && (
          <div className="flex items-center gap-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#aaaaaa"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>

            <p className="text-sm text-[#aaaaaa]">
              {distance.toFixed(2)} miles away
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OneListing;
