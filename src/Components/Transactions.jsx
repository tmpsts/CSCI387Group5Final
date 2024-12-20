import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BuyerView from "./Transaction/BuyerView";
import SellerView from "./Transaction/SellerView";
import PastTransaction from "./Transaction/PastTransaction";
import ActiveTransaction from "./Transaction/ActiveTransaction";
import Offer from "./Transaction/Offer";

// tailwind editted by Tu
function Transactions({ user, DatabaseURL }) {
  const { transactionId } = useParams();
  const [offers, setOffers] = useState([]);
  const [activeTransactions, setActiveTransactions] = useState([]);
  const [pastTransactions, setPastTransactions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [viewType, setViewType] = useState("");
  const navigate = useNavigate();

  const fetchTransactions = () => {
    fetch(`${DatabaseURL}/offers/${user.UserID}`)
      .then((response) => response.json())
      .then((data) => setOffers(data))
      .catch((error) => console.error("Error fetching offers:", error));
    fetch(`${DatabaseURL}/active-transactions/${user.UserID}`)
      .then((response) => response.json())
      .then((data) => {
        setActiveTransactions(data);
        if (transactionId) {
          const transaction = data.find(
            (t) => t.TransactionID === parseInt(transactionId)
          );
          if (transaction) {
            setSelectedTransaction(transaction);
            setViewType(
              user.UserID === transaction.SellerID ? "seller" : "buyer"
            );
          }
        }
      })
      .catch((error) =>
        console.error("Error fetching active transactions:", error)
      );
    fetch(`${DatabaseURL}/past-transactions/${user.UserID}`)
      .then((response) => response.json())
      .then((data) => setPastTransactions(data))
      .catch((error) =>
        console.error("Error fetching past transactions:", error)
      );
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 3000);
    return () => clearInterval(interval);
  }, [user.UserID, transactionId]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleAccept = (offer) => {
    fetch(`${DatabaseURL}/accept-offer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(offer),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setOffers((prevOffers) =>
            prevOffers.filter((o) => o.OfferID !== offer.OfferID)
          );
          // Fetch active transactions again to update the list
          fetch(`${DatabaseURL}/active-transactions/${user.UserID}`)
            .then((response) => response.json())
            .then((data) => setActiveTransactions(data))
            .catch((error) =>
              console.error("Error fetching active transactions:", error)
            );
        } else {
          console.error("Error accepting offer:", data.error);
        }
      })
      .catch((error) => console.error("Error accepting offer:", error));
  };

  const handleDecline = (offer) => {
    fetch(`${DatabaseURL}/decline-offer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ OfferID: offer.OfferID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setOffers((prevOffers) =>
            prevOffers.filter((o) => o.OfferID !== offer.OfferID)
          );
        } else {
          console.error("Error declining offer:", data.error);
        }
      })
      .catch((error) => console.error("Error declining offer:", error));
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setViewType(user.UserID === transaction.SellerID ? "seller" : "buyer");
    navigate(`/transactions/${transaction.TransactionID}`);
  };

  const handleBackButton = () => {
    navigate("/transactions");
    setSelectedTransaction(null);
  };

  return (
    <div className="w-full flex bg-white dark:bg-[#202020] text-black dark:text-white">
      <div className="">
        <div className="m-5 gap-4 flex flex-col">
          <p className="text-3xl font-bold">In-Progress</p>
          <div
            className="w-[400px] h-16 flex justify-between items-center rounded-2xl border-2 border-grey-200 dark:border-[#151515] bg-[#f6f6f6] dark:bg-[#171717]"
            onClick={toggleVisibility}
          >
            <div className="mx-5 text-2xl">
              Offers & Requests <span>({offers.length})</span>
            </div>
            <div className="mx-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-8 transition-transform duration-200 ${
                  isVisible ? "rotate-90" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </div>

          {isVisible && (
            <div>
              {offers.length > 0 ? (
                offers.map((offer) => (
                  <Offer
                    key={offer.OfferID}
                    offer={offer}
                    handleAccept={handleAccept}
                    handleDecline={handleDecline}
                  />
                ))
              ) : (
                <div className="flex justify-center">
                  <p>No offers found.</p>
                </div>
              )}
            </div>
          )}

          {activeTransactions.length > 0 ? (
            activeTransactions.map((transaction) => (
              <ActiveTransaction
                key={transaction.TransactionID}
                user={user}
                transaction={transaction}
                handleTransactionClick={handleTransactionClick}
              />
            ))
          ) : (
            <div className="flex justify-center">
              <p>No active transactions found.</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-3/5 p-5 flex flex-col">
        <p className="text-3xl font-bold ml-5">Past Transactions</p>
        <div className="h-[85vh] px-5 my-5 gap-2 flex flex-col overflow-scroll scrollbar-hide">
          {pastTransactions.length > 0 ? (
            pastTransactions.map((transaction) => (
              <PastTransaction
                key={transaction.TransactionID}
                user={user}
                transaction={transaction}
              />
            ))
          ) : (
            <p>No past transactions found.</p>
          )}
        </div>
      </div>
      {selectedTransaction && transactionId && (
        <div className="w-[66%] h-full p-5 fixed flex flex-col justify-start items-start shadow-xl rounded-l-2xl border-l-8 border-t-8 border-b-8 border-gray-300 dark:border-[#353535] bg-white dark:bg-[#303030] color-black dark:color-white overflow-hidden transition-transform transform translate-x-0 top-0 right-0">
          {viewType === "seller" ? (
            <SellerView
              user={user}
              transaction={selectedTransaction}
              onClose={handleBackButton}
              reloadTransactions={fetchTransactions}
              DatabaseURL={DatabaseURL}
            />
          ) : (
            <BuyerView
              user={user}
              transaction={selectedTransaction}
              onClose={handleBackButton}
              reloadTransactions={fetchTransactions}
              DatabaseURL={DatabaseURL}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Transactions;
