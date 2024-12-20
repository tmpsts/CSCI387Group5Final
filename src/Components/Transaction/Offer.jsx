import React from "react";
import { Link } from "react-router-dom";

// Tailwind edited by: Mitchell
function Offer({ offer, handleAccept, handleDecline }) {
  return (
    <div key={offer.OfferID} className="flex justify-center items-center">
      <div className="w-24 h-24 mr-2 flex flex-col gap-2  justify-center items-center  rounded-2xl bg-[#f6f6f6] dark:bg-[#171717] border-4 border-grey-200 dark:border-[#151515] ">
        <button
          className="w-20 px-2 py-1 rounded-full text-white bg-green-500 hover:bg-green-600"
          onClick={() => handleAccept(offer)}
        >
          Accept
        </button>
        <button
          className="w-20 px-2 py-1 rounded-full text-white bg-red-500 hover:bg-red-600"
          onClick={() => handleDecline(offer)}
        >
          Decline
        </button>
      </div>
      <div className="min-w-72 max-w-72 h-24 flex justify-center items-center rounded-2xl bg-[#f6f6f6] dark:bg-[#171717] border-4 border-grey-200 dark:border-[#151515] ">
        <div className="mx-3 flex flex-col justify-center items-center">
          <Link
            to={`/profile/${offer.BuyerName}`}
            className="w-12 h-12 flex flex-col justify-center items-center"
          >
            <img
              src={offer.BuyerProfilePhoto}
              alt="Buyer PFP"
              className="w-12 h-12 rounded-full border-2"
            />
            <p className="text-sm">{offer.BuyerName}</p>
          </Link>
        </div>
        <div className="mx-3">
          <div className="flex gap-2 items-baseline">
            <strong>On</strong>
            <p className="line-clamp-1 break-all">{offer.ListingName}</p>
          </div>

          <div className="flex gap-2 items-baseline">
            <strong>For</strong>
            <p className="">${offer.OfferAmount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Offer;
