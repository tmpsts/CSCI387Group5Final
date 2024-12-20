import React from "react";
import { Link } from "react-router-dom";
// Tailwind edited by: Mitchell
function ActiveTransaction({ user, transaction, handleTransactionClick }) {
  return (
    <div
      key={transaction.TransactionID}
      className="flex justify-center items-center"
      onClick={() => handleTransactionClick(transaction)}
    >
      <div className="w-[400px] h-24 flex items-center rounded-2xl border-4 bg-[#f6f6f6] dark:bg-[#171717] border-grey-200 dark:border-[#151515]">
        {user.UserID === transaction.SellerID ? (
          <div className="w-12 h-full flex justify-center items-center rounded-l-xl bg-green-400 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
        ) : (
          <div className="w-12 h-full flex justify-center items-center rounded-l-xl bg-red-400">
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
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </div>
        )}
        <Link to={`/profile/${transaction.SellerName}`}>
          <div className="w-12 h-12 mx-5 flex flex-col justify-center items-center">
            <img
              src={transaction.BuyerProfilePhoto}
              alt="Buyer PFP"
              className="w-12 h-12 rounded-full border-2"
            />
            <p className="text-sm">{transaction.BuyerName}</p>
          </div>
        </Link>
        <div className="w-48 mx-3">
          <div className="flex gap-3 items-baseline">
            <p className="line-clamp-1 break-all">{transaction.ListingName}</p>
          </div>

          <div className="text-x1 flex gap-2 items-baseline">
            <p className="text-xl">${transaction.Amount}</p>
          </div>
        </div>
        <div className="ml-auto mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-8 transition-transform duration-200"
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
  );
}

export default ActiveTransaction;
