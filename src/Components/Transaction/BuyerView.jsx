import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import MessageBoard from "./MessageBoard";

// Tailwind edited by: Mitchell
function BuyerView({
  user,
  transaction,
  onClose,
  reloadTransactions,
  DatabaseURL,
}) {
  const [confirming, setConfirming] = useState("");
  const [newOfferAmount, setNewOfferAmount] = useState("");
  const [offerVisible, setOfferVisible] = useState(false);
  const navigate = useNavigate();

  const handleCancelSale = () => {
    fetch(`${DatabaseURL}/cancel-sale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactionId: transaction.TransactionID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert("Sale canceled!");
          onClose();
          reloadTransactions();
        } else {
          alert("Error canceling sale.");
        }
      })
      .catch((error) => console.error("Error canceling sale:", error));
  };

  const handleProposeNewOffer = () => {
    if (newOfferAmount.trim() === "") return;

    const message = {
      transactionId: transaction.TransactionID,
      senderId: transaction.BuyerID,
      content: `New offer proposed: $${newOfferAmount}`,
      isOffer: true,
      offerAmount: newOfferAmount,
    };

    fetch(`${DatabaseURL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((response) => response.json())
      .then((data) => {
        setNewOfferAmount("");
        handleNewOfferClick();
      })
      .catch((error) => console.error("Error proposing new offer:", error));
  };

  const handleListingClick = () => {
    navigate(`/listing/${transaction.ListingID}`);
  };

  const handleBadConfirmClick = () => {
    setConfirming("bad");
  };

  const resetConfirmClick = () => {
    setConfirming("");
  };

  const handleNewOfferClick = () => {
    setOfferVisible(!offerVisible);
  };

  return (
    <div className="w-full h-full flex gap-4">
      {/* Messaging Board */}
      <div className="w-2/3 h-full p-4 flex flex-col rounded-xl bg-[#404040]">
        <MessageBoard
          user={user}
          transaction={transaction}
          transactionId={transaction.TransactionID}
          sellerId={transaction.SellerID}
          onClose={onClose}
          isSeller={false}
          DatabaseURL={DatabaseURL}
        />
      </div>

      {/* Google Maps/Item Info Board */}
      <div className="w-1/3 h-full flex flex-col gap-3 rounded-xl rounded-t-2xl border border-[#252525] bg-[#404040]">
        <div className="w-full h-[30rem] p-4">
          <div className="w-full h-full flex flex-col justify-center rounded-2xl bg-[#353535]">
            <iframe
              src={`https://www.google.com/maps?q=${transaction.ListingLocation}&output=embed`}
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
              className="rounded-2xl"
            ></iframe>
            <p className="m-3 mx-6 mb-4 text-xl">
              <strong>Address:</strong> {transaction.ListingLocation}
            </p>
          </div>
        </div>

        <div className="w-full px-4 flex flex-col">
          <div className="h-80 flex flex-col rounded-xl">
            <div
              className="group relative w-full flex rounded-2xl bg-[#353535] duration-300 hover:bg-[#252525] hover:translate-x-1"
              onClick={() => handleListingClick(transaction.ListingID)}
            >
              <div className="relative">
                <img
                  src={transaction.Image}
                  alt={transaction.ListingName}
                  className="w-72 h-72 rounded-2xl"
                />
              </div>
              <div className="absolute top-auto inset-0 h-20 w-72 flex flex-col justify-end rounded-b-2xl text-white p-4 bg-[#252525] bg-opacity-50 duration-300 group-hover:bg-opacity-80">
                <div className="duration-200 group-hover:hidden">
                  <p className="line-clamp-1 break-all font-bold text-3xl">
                    {transaction.ListingName}
                  </p>
                  <p className="line-clamp-1 break-all">
                    {transaction.ListingDescription}
                  </p>
                </div>
                <div className="w-full h-full hidden group-hover:block">
                  <p className="text-3xl">View Listing</p>
                </div>
              </div>
              <div className="h-full mx-auto flex justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </div>
          </div>
          {offerVisible ? (
            <>
              <div className="w-full mb-2 px-5 p-4 flex justify-center items-center rounded-xl bg-[#353535]">
                <div className="w-full h-full flex items-cente">
                  <input
                    type="number"
                    value={newOfferAmount}
                    onChange={(e) => setNewOfferAmount(e.target.value)}
                    placeholder="New Offer Amount"
                    className="w-full p-2 rounded-md bg-[#202020] text-white"
                  />
                </div>
                <button
                  className="w-48 ml-5 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleProposeNewOffer}
                >
                  Edit Offer
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
          <div className="w-full mb-4 px-7 p-4 flex justify-center items-center rounded-xl bg-[#353535]">
            <div className="w-full h-full flex items-center">
              {confirming === "bad" ? (
                <p className="text-2xl">Decline Sale?</p>
              ) : (
                <p className="text-2xl font-semibold">
                  Offer: ${transaction.Amount}
                </p>
              )}
            </div>
            <div className="flex gap-4">
              {confirming === "bad" ? (
                <>
                  <button
                    className="rounded-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleCancelSale}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-10"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                  <button
                    className="rounded-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={resetConfirmClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-10"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="w-10 h-10 flex justify-center items-center rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={handleNewOfferClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </button>
                  <button
                    className="flex justify-center items-center gap-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleBadConfirmClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-10"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyerView;
