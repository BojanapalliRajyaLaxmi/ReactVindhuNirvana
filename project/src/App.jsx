import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import Restaurant from './components/restuarant/Restuarant'
import State from "./components/states/State";
import Feed from "./components/feed/Feed";
import Profile from "./components/profile/Profile";
import Wishlist from "./components/wishlist/Wishlist";
import Cart from "./components/cart/Cart";
import Register from "./components/Account/Register";
import Login from "./components/Account/Login";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "./components/payment/Payment";
import Success from "./components/payment/Success";

const stripePromise = loadStripe("pk_test_51R2UuPRtRDR7EaLmaTUN2eAO46XMHLc0R1Q5ENSvut5CTpkJpw5l4QNy5SP3ByjJQkeGySh6pXIAfztgcFA9ekmq00sIVT7w2G");

function App() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("http://localhost:3002/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ amount: 1000 }] }), // Example item
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => console.error("Error fetching clientSecret:", error));
  }, []);

  return (
    <Router>
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/states" element={<State />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Payment Route with Stripe Elements */}
          <Route
            path="/payment"
            element={
              clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <Payment />
                </Elements>
              )
            }
          />
          
          {/* Success Page */}
          <Route path="/success" element={<Success />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
