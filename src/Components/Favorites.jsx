import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OneListing from "./Landing/OneListing";

function Favorites({ user, DatabaseURL }) {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${DatabaseURL}/favorites/${user.UserID}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.listings) {
          setFavorites(data.listings);
        } else {
          setFavorites([]);
        }
      })
      .catch((error) =>
        console.error("Error fetching favorite listings:", error)
      );
  }, [user.UserID]);

  const openListingClick = (ListingID) => {
    navigate(`/listing/${ListingID}`);
  };

  return (
    <div className="w-full p-6 text-black dark:text-white bg-white dark:bg-[#202020]">
      <p className="text-2xl font-semibold">Favorite Listings</p>
      {favorites.length > 0 ? (
        <div className="h-full w-full py-4 grid grid-cols-6 gap-4">
          {favorites.map((product) => (
            <div
              key={product.ListingID}
              className="w-full h-full py-2 grid grid-cols-6"
            >
              <OneListing
                key={product.ListingID}
                product={product}
                openListingClick={openListingClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="my-2">
          <p>No favorite listings found.</p>
        </div>
      )}
    </div>
  );
}

export default Favorites;
