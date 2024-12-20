import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// Tailwind edited by: ethan
function Listing({ user, DatabaseURL }) {
  const { ListingID } = useParams();
  const [listing, setListing] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [offerConfirmation, setOfferConfirmation] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [offerAmount, setOfferAmount] = useState("");

  const goFetch = () => {
    fetch(`${DatabaseURL}/listings/${ListingID}`)
      .then((response) => response.json())
      .then((data) => {
        setListing(data);
        setName(data.Name);
        setDescription(data.Description);
        setPrice(data.Price);
        setLocation(data.Location);
        setImage(data.Image);
      })
      .catch((error) => console.error("Error fetching listing:", error));

    fetch(`${DatabaseURL}/favorites/${user.UserID}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.listings) {
          const favoriteListing = data.listings.find(
            (fav) => fav.ListingID === parseInt(ListingID, 10)
          );
          setIsFavorite(!!favoriteListing);
        } else {
          setIsFavorite(false);
        }
      })
      .catch((error) => console.error("Error fetching favorites:", error));
  };

  useEffect(() => {
    goFetch();
  }, [ListingID, user.UserID]);

  const handleConnectClick = (offerAmt) => {
    if (offerAmt) {
      const offer = {
        ListingID: listing.ListingID,
        SellerID: listing.UserID,
        BuyerID: user.UserID,
        OfferAmount: parseInt(offerAmt, 10),
      };

      fetch(`${DatabaseURL}/offers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offer),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            alert("Offer made successfully!");
          } else {
            console.error("Error making offer:", data.error);
          }
        })
        .catch((error) => console.error("Error making offer:", error));
    }
    handleOfferConfirm();
  };

  const handleFavoriteClick = () => {
    const url = `${DatabaseURL}/favorites`;
    const method = isFavorite ? "DELETE" : "POST";
    const body = JSON.stringify({
      userID: user.UserID,
      listingID: listing.ListingID,
    });

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setIsFavorite(!isFavorite);
        } else {
          console.error("Error updating favorite:", data.error);
        }
      })
      .catch((error) => console.error("Error updating favorite:", error));
  };

  const handleEditButton = () => {
    setEditMode(!editMode);
  };

  const handleOfferConfirm = () => {
    setOfferConfirmation(!offerConfirmation);
  };

  const handleSave = () => {
    fetch(`${DatabaseURL}/listings/${ListingID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name,
        Description: description,
        Price: price,
        Location: location,
        Image: image,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setListing(data);
        setEditMode(false);
        goFetch();
        handleEditButton();
      })
      .catch((error) => console.error("Error updating listing:", error));
  };

  const handleDelete = () => {
    console.log("Deleting listing with ID:", listing.ListingID);
    fetch(`${DatabaseURL}/listings/${listing.ListingID}`, {
      method: "DELETE",
    })
      .then((response) => {
        console.log("Response received:", response);
        return response.json();
      })
      .then((data) => {
        console.log("Data received:", data);
        if (data.success) {
          alert("Listing deleted successfully!");
        } else {
          alert("Error deleting listing: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting listing:", error);
      });
  };

  if (!listing) {
    return (
      <div className="w-full p-4 text-black dark:text-white bg-white dark:bg-[#202020]">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full flex justify-between text-black dark:text-white bg-white dark:bg-[#202020]">
      <div className="w-full h-full flex justify-center items-center">
        <img
          src={listing.Image}
          alt={listing.Image}
          className="w-96 h-auto mt-4"
        />
      </div>
      <div className="w-96 p-5 bg-[#f6f6f6] dark:bg-[#151515] ">
        <div className="mb-4 flex justify-between">
          <Link to={-1}>
            <div className="w-full h-full p-2 rounded-full bg-gray-500 hover:bg-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </div>
          </Link>
          {user.UserID == listing.UserID || user.IsAdmin ? (
            <div
              className="h-full p-2 rounded-full bg-gray-500 hover:bg-gray-600"
              onClick={handleEditButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </div>
          ) : (
            <></>
          )}
        </div>
        {editMode ? (
          <div className="w-full flex flex-col">
            <p className="text-xl font-semibold mt-3">Edit Listing</p>

            <div className="w-full">
              {/** Edit Listing Name */}
              <div className="w-full mt-5">
                <p>Name</p>
                <div className="w-full relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 pr-12 mb-2 rounded-md bg-[#202020] text-white"
                  />
                  <span className="absolute right-3 top-2">{name.length}</span>
                </div>
              </div>

              {/** Edit Description */}
              <div>
                <p>Description</p>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 pr-12 mb-2 rounded-md scrollbar-hide bg-[#202020] text-white"
                  />
                  <span className="absolute right-3 top-2">
                    {description.length}
                  </span>
                </div>
              </div>

              <div>
                <p>Location</p>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 mb-2 rounded-md bg-[#202020] text-white"
                />
              </div>

              <div>
                <p>Image URL</p>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2 mb-2 rounded-md bg-[#202020] text-white"
                />
              </div>

              <div>
                <p>Price</p>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 mb-2 rounded-md bg-[#202020] text-white"
                />
              </div>
            </div>

            <div className="w-full flex justify-start gap-4">
              <button
                className="w-full py-2 my-3 rounded-full shadow-xl bg-gray-500 hover:bg-gray-400"
                onClick={handleSave}
              >
                Save
              </button>
              <Link
                to={-1}
                className="w-full py-2 my-3 flex justify-center items-center rounded-full shadow-xl bg-red-500 hover:bg-red-600"
              >
                <button onClick={handleDelete}>Delete</button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold">{listing.Name}</h1>
            <p className="text-xl">${listing.Price}</p>
            <p>
              Posted on: {new Date(listing.DateCreated).toLocaleDateString()}
            </p>
            <div className="mt-4 mb-3 flex gap-2">
              <button
                className="w-48 py-1.5 px-5 flex justify-center items-center rounded-xl shadow-xl bg-gray-500 hover:bg-gray-400"
                onClick={handleOfferConfirm}
              >
                <p className="mr-2">Send Offer</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                </svg>
              </button>
              <button
                className={`py-1.5 px-6 rounded-xl shadow-xl ${
                  isFavorite ? "bg-red-500" : "bg-gray-500 hover:bg-gray-400"
                }`}
                onClick={handleFavoriteClick}
              >
                {isFavorite ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                )}
              </button>
              <button
                className="py-1.5 px-5 rounded-xl shadow-xl bg-gray-500 hover:bg-gray-400"
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                  />
                </svg>
              </button>
            </div>
            {offerConfirmation ? (
              <>
                <div className="w-full h-10 flex gap-2 items-center justify-between">
                  <input
                    type="number"
                    value={offerAmount}
                    placeholder="Offer Amount"
                    onChange={(e) => setOfferAmount(e.target.value)}
                    required
                    className="w-48 p-1.5 px-3 rounded-xl overflow-hidden dark:bg-[#202020] border-[#ffffff] dark:border-[#151515]"
                  />
                  <button
                    className="w-full p-1.5 rounded-xl text-white bg-[#353535] hover:bg-[#252525]"
                    onClick={() => handleConnectClick(offerAmount)}
                  >
                    Confirm Offer
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
            <div className="mt-10">
              <h1 className="text-xl font-semibold">Details</h1>
              <p className="mt-2 break-words">{listing.Description}</p>
              <p className="mt-2 text-[#bbbbbb]">{listing.Location}</p>
            </div>
            <div className="mt-10">
              <p className="mb-2 text-xl font-semibold">Seller Information</p>
              <div className="flex justify-between items-center">
                <Link
                  to={`/profile/${listing.Username}`}
                  className="flex items-center gap-2"
                >
                  <img
                    src={listing.ProfilePhoto}
                    alt={listing.Username}
                    className="w-12 h-12 rounded-full border-2 border-[#151515]"
                  />
                  <p className="hover:underline">{listing.Username}</p>
                </Link>
                <div className="flex items-center justify-center gap-1">
                  <p>
                    {(listing.ReviewScore / listing.ReviewAmount).toFixed(1)}
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Listing;
