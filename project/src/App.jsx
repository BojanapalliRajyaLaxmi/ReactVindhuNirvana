import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import Restaurant from "./components/restuarant/Restuarant";
import State from "./components/states/State";
import Profile from "./components/profile/Profile";
import Wishlist from "./components/wishlist/Wishlist";
import Cart from "./components/cart/Cart";
import Register from "./components/Account/Register";
import Login from "./components/Account/Login";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "./components/payment/Payment";
import Success from "./components/payment/Success";
import Preorder from "./components/restuarant/Preorder";
import Booking from "./components/restuarant/Booking";
import Search from "./SearchResults";

// 🔹 Lazy Load Feed Component
const Feed = lazy(() => import("./components/feed/Feed"));

const stripePromise = loadStripe(
  "pk_test_51R2UuPRtRDR7EaLmaTUN2eAO46XMHLc0R1Q5ENSvut5CTpkJpw5l4QNy5SP3ByjJQkeGySh6pXIAfztgcFA9ekmq00sIVT7w2G"
);

function App() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("http://localhost:3002/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ amount: 1000 }] }),
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
          
          {/* 🔹 Lazy Loaded Feed Component Wrapped in Suspense */}
          <Route
            path="/feed"
            element={
              <Suspense fallback={<p>Loading Feed...</p>}>
                <Feed />
              </Suspense>
            }
          />

          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="preorder" element={<Preorder />} />
          <Route path="booking" element={<Booking />} />
          <Route path="/search" element={<Search />} />
          
          {/* Payment Route with Stripe Elements */}
          <Route
            path="/payment"
            element={
              clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <Payment />
                </Elements>
              ) : (
                <p>Loading Payment Gateway...</p>
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
