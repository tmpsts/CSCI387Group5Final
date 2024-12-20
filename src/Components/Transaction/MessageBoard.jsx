import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Tailwind edited by: Mitchell
function MessageBoard({
  user,
  transaction,
  transactionId,
  sellerId,
  onClose,
  isSeller,
  DatabaseURL,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(fetchMessages, 2000); // Fetch messages every 2 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [transactionId, messages]);

  const fetchMessages = () => {
    return fetch(`${DatabaseURL}/messages/${transactionId}`)
      .then((response) => response.json())
      .then((data) => {
        checkNewMessages(data);
        return data;
      })
      .catch((error) => console.error("Error fetching messages:", error));
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message = {
      transactionId,
      senderId: user.UserID,
      content: newMessage,
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
        console.log("Sent message:", data);
        setNewMessage("");
        fetchMessages(); // Refetch messages after sending a new message
      })
      .catch((error) => console.error("Error sending message:", error));
  };

  const checkNewMessages = (newMessages) => {
    if (messages.length != newMessages.length) {
      setMessages(newMessages);
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    }
    setMessages(newMessages);
  };

  const handleAcceptOffer = (messageId, offerAmount) => {
    const acceptMessage = {
      transactionId,
      senderId: sellerId,
      isOffer: false,
      content: `Your offer for $${offerAmount} was accepted!`,
    };

    const acceptOffer = {
      TransactionID: transaction.TransactionID,
      OfferAmount: offerAmount,
    };

    fetch(`${DatabaseURL}/messages/decline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(acceptMessage),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Decline message sent:", data);

        fetch(`${DatabaseURL}/accept-message-offer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(acceptOffer),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Offer accepted:", data);
            fetch(`${DatabaseURL}/decline-message-offer`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ MessageID: messageId }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Offer declined and message deleted:", data);
                fetchMessages();
              })
              .catch((error) =>
                console.error(
                  "Error declining offer and deleting message:",
                  error
                )
              );
            fetchMessages(); // Refetch messages after accepting the offer
          })
          .catch((error) => console.error("Error accepting offer:", error));
      })
      .catch((error) => console.error("Error sending decline message:", error));
  };

  const handleDeclineOffer = (messageId, amount) => {
    const declineMessage = {
      transactionId,
      senderId: sellerId,
      isOffer: false,
      content: `Your offer for $${amount} was declined.`,
    };

    fetch(`${DatabaseURL}/messages/decline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(declineMessage),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Decline message sent:", data);

        fetch(`${DatabaseURL}/decline-message-offer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ MessageID: messageId }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Offer declined and message deleted:", data);
            fetchMessages();
          })
          .catch((error) =>
            console.error("Error declining offer and deleting message:", error)
          );
      })
      .catch((error) => console.error("Error sending decline message:", error));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  return (
    <div className="w-full h-full p-4 flex flex-col rounded-xl bg-[#404040] ">
      <div className="flex">
        <button
          className="w-16 h-16 p-5 mr-2 flex justify-center items-center rounded-full bg-[#353535]"
          onClick={onClose}
        >
          <div className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </div>
        </button>
        {isSeller ? (
          <>
            <div>{/** Button to change offer amount */}</div>
          </>
        ) : (
          <></>
        )}
        <div className="w-full h-16  flex justify-center items-center rounded-full bg-[#353535]">
          <h2 className="text-white">
            {isSeller ? (
              <div className="w-full h-full flex justify-center items-center gap-2 rounded-full">
                <div className="w-10 h-10 rounded-full">
                  <img
                    src={transaction.BuyerProfilePhoto}
                    alt="Buyer's Profile Photo"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <p className="flex gap-1">
                  Chat with
                  <Link to={`/profile/${transaction.BuyerName}`}>
                    <span className="underline">{transaction.BuyerName}</span>
                  </Link>
                </p>
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center gap-2 rounded-full">
                <div className="w-10 h-10 rounded-full ">
                  <img
                    src={transaction.SellerProfilePhoto}
                    alt="Buyer's Profile Photo"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <p className="flex gap-1">
                  Chat with
                  <Link to={`/profile/${transaction.SellerName}`}>
                    <span className="underline">{transaction.SellerName}</span>
                  </Link>
                </p>
              </div>
            )}
          </h2>
        </div>
      </div>
      <div className="w-full h-full p-4 my-2 rounded-xl overflow-y-auto scrollbar-hide bg-[#505050] ">
        {messages.length > 0 ? (
          <div>
            {messages.map((message, index) => (
              <div key={index} className="w-full flex flex-col overflow-y-auto">
                <div
                  className={`${
                    message.SenderID === user.UserID ? "self-end" : "self-start"
                  }`}
                >
                  <div className="group flex items-center gap-2">
                    {message.SenderID === user.UserID ? (
                      <div
                        className={`w-48 opacity-0 duration-300 group-hover:opacity-100 text-right`}
                      >
                        {new Date(message.Timestamp).toLocaleString("en-US", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </div>
                    ) : (
                      <></>
                    )}
                    <div
                      className={`max-w-96 p-2 my-2 rounded-lg ${
                        message.SenderID === user.UserID
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >
                      <p className="text-white">{message.Content}</p>
                      {message.IsOffer === 1 && isSeller && (
                        <div className="flex gap-2 mt-2">
                          <button
                            className="px-2 py-1 rounded-full bg-green-500 text-white"
                            onClick={() =>
                              handleAcceptOffer(
                                message.MessageID,
                                message.OfferAmount
                              )
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="px-2 py-1 rounded-full bg-red-500 text-white"
                            onClick={() =>
                              handleDeclineOffer(
                                message.MessageID,
                                message.OfferAmount
                              )
                            }
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                    {message.SenderID !== user.UserID ? (
                      <div
                        className={`w-48 opacity-0 duration-300 group-hover:opacity-100`}
                      >
                        {new Date(message.Timestamp).toLocaleString("en-US", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="w-full h-full mb-10 flex justify-center items-end ">
            <p className="text-[#bbbbbb]">
              There are no messages to display, start chatting!
            </p>
          </div>
        )}
      </div>
      <div className="w-full h-12 flex items-center rounded-full bg-[#353535]  ">
        <input
          type="text"
          className="w-full h-full ml-5 bg-transparent text-white outline-none"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className=" px-4 py-2 ml-2 rounded-full bg-blue-500 text-white "
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageBoard;
