import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import MessageBoard from "./MessageBoard";

// Tailwind edited by: Mitchell
function SellerView({
  user,
  transaction,
  onClose,
  reloadTransactions,
  DatabaseURL,
}) {
  const [confirming, setConfirming] = useState("");
  const navigate = useNavigate();

  const handleConfirmSale = () => {
    fetch(`${DatabaseURL}/confirm-sale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactionId: transaction.TransactionID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert("Sale confirmed!");
          onClose();
          reloadTransactions();
        } else {
          alert("Error confirming sale.");
        }
      })
      .catch((error) => console.error("Error confirming sale:", error));
  };

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

  const handleListingClick = () => {
    navigate(`/listing/${transaction.ListingID}`);
  };

  const handleGoodConfirmClick = () => {
    setConfirming("good");
  };

  const handleBadConfirmClick = () => {
    setConfirming("bad");
  };

  const resetConfirmClick = () => {
    setConfirming("");
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
          isSeller={true}
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
          <div className="w-full mb-4 p-4 px-7 flex justify-center items-center rounded-xl bg-[#353535]">
            <div className="w-full h-full flex items-center">
              {confirming === "good" ? (
                <p className="text-2xl">Confirm Sale?</p>
              ) : confirming === "bad" ? (
                <p className="text-2xl">Decline Sale?</p>
              ) : (
                <p className="text-2xl font-semibold">
                  Offer: ${transaction.Amount}
                </p>
              )}
            </div>
            <div className="flex gap-4">
              {confirming === "good" ? (
                <>
                  <button
                    className="rounded-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleConfirmSale}
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
              ) : confirming === "bad" ? (
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
                    className="rounded-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleGoodConfirmClick}
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

export default SellerView;
