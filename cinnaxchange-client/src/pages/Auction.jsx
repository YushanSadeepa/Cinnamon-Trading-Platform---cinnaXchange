import { useEffect, useState } from "react";
import socket from "../services/socket";
import { useSelector } from "react-redux";

export default function Auction() {
  const { user } = useSelector((state) => state.auth);

  const [bid, setBid] = useState(0);
  const [highest, setHighest] = useState(0);
  const [highestBidder, setHighestBidder] = useState("");

  const auctionId = "auction_1";

  useEffect(() => {
    socket.emit("join_auction", auctionId);

    socket.on("bid_update", (data) => {
      setHighest(data.highestBid);
      setHighestBidder(data.bidder);
    });

    socket.on("bid_error", (msg) => {
      alert(msg);
    });

    return () => {
      socket.off("bid_update");
      socket.off("bid_error");
    };
  }, []);

  const placeBid = () => {
    socket.emit("place_bid", {
      auctionId,
      user: user.fullName,
      amount: Number(bid),
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Live Auction</h1>

      <h2 className="mt-4">
        Highest Bid: ${highest}
      </h2>

      <h3>
        Highest Bidder: {highestBidder}
      </h3>

      <input
        type="number"
        className="border p-2 mt-4"
        onChange={(e) => setBid(e.target.value)}
        placeholder="Enter bid"
      />

      <button
        onClick={placeBid}
        className="bg-green-600 text-white p-2 ml-2"
      >
        Place Bid
      </button>
    </div>
  );
}