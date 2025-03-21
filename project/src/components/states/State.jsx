import React, { useState, useEffect } from "react";
import "./state.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const stateLinks = {
  "TS & AP":
    "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/ts&ap.json",
  Kerala:
    "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/kerala.json",
  Tamilnadu:
    "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/tamilnadu.json",
  Haryana:
    "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/haryana.json",
  Punjab:
    "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/punjab.json",
  Uttarakhand:
    "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/uttarakhand.json",
  Maharashtra:
    "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/maharastra.json",
  Rajasthan:
    "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/rajasthan.json",
};
const stateIcons = {
  "TS & AP": "🏰", // Charminar
  Kerala: "🌴", // Backwaters
  Tamilnadu: "🛕", // Meenakshi Temple
  Haryana: "🏇", // Horses (Traditional Culture)
  Punjab: "🏛", // Golden Temple
  Uttarakhand: "⛰", // Kedarnath Temple
  Maharashtra: "🗿", // Gateway of India
  Rajasthan: "🏜", // Hawa Mahal
};
const foodTypes = ["All", "Vegetarian", "Non-Vegetarian"];77
const State = () => {
  const navigate = useNavigate();
  const [stateData, setStateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedState, setSelectedState] = useState("TS & AP");
  const [selectedFoodType, setSelectedFoodType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const token = localStorage.getItem("tokenlogin");
    
    if (token) {
        fetchWishlist();
        fetchCart();
    } else {
        console.warn("No token found. Skipping wishlist and cart fetch.");
    }

    fetchStateData("TS & AP");
}, []);

  const fetchStateData = async (state) => {
    setLoading(true);
    setError(null);
    setStateData(null);
    setSelectedState(state);

    try {
      const response = await fetch(stateLinks[state]);
      if (!response.ok) throw new Error("Failed to fetch data.");
      let data = await response.json();
      if (!Array.isArray(data) || data.length < 2) {
        throw new Error("Invalid data structure.");
      }
      const correctedData = {
        vegetarian: data[0]?.vegetarian || [],
        "non-vegetarian":
          data[1]?.["non-vegetarian"] || data[1]?.["Non-vegetarian"] || [],
      };
      setStateData(correctedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    const token = localStorage.getItem("tokenlogin");

    if (!token) {
        console.warn("No token found. Skipping wishlist fetch.");
        return; 
    }

    try {
        const response = await fetch("https://vindhuservercode.onrender.com/wishlist", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error(`Wishlist fetch failed: ${response.status}`);

        const data = await response.json();
        console.log("Fetched wishlist:", data.wishlist);
        setWishlist(data.wishlist || []);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
    }
};

const toggleWishlist = async (dish) => {
  const token = localStorage.getItem("tokenlogin");
  
  if (!token || token === "false") {
      navigate("/login"); 
      return;
  }

  try {
      const response = await fetch("https://vindhuservercode.onrender.com/wishlist", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ dish }),
      });

      if (!response.ok) throw new Error("Failed to update wishlist");

      fetchWishlist(); 
  } catch (error) {
      console.error("Error updating wishlist:", error);
  }
};
const fetchCart = async () => {
  const token = localStorage.getItem("tokenlogin");
  
  if (!token) {
      console.warn("No token found. Skipping cart fetch.");
      return;
  }

  try {
      const response = await fetch("https://vindhuservercode.onrender.com/cart", {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
      });

      if (!response.ok) throw new Error(`Cart fetch failed: ${response.status}`);

      const data = await response.json();
      console.log("Cart Data Received:", data);
      setCart(data.cart || []);
  } catch (error) {
      console.error("Error fetching cart:", error);
  }
};


const addToCart = async (dish) => {
  const token = localStorage.getItem("tokenlogin");
  
  if (!token || token === "false") {
      navigate("/login");  
      return;
  }

  try {
      await fetch("https://vindhuservercode.onrender.com/cart", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ dish }),
      });

      fetchCart(); 
  } catch (error) {
      console.error("Error adding to cart:", error);
  }
};
  const handleRemoveFromCart = async (dish) => {
    const token = localStorage.getItem("tokenlogin");
    if (!token) {
        navigate("/login");
        return;
    }

    try {
        const response = await fetch("http://localhost:3002/cart", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ dish }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Failed to remove from cart:", data.message || "Unknown error");
            return;
        }

        console.log("Cart after removal:", data.cart);
        setCart(data.cart);
    } catch (error) {
        console.error("Error removing from cart:", error);
    }
};

  const filteredDishes =
    selectedFoodType === "All"
      ? [
          ...(stateData?.vegetarian || []),
          ...(stateData?.["non-vegetarian"] || []),
        ]
      : selectedFoodType === "Vegetarian"
      ? stateData?.vegetarian || []
      : stateData?.["non-vegetarian"] || [];

      const dishesPerPage = 20;

      // Calculate total pages
      const totalPages = Math.ceil(filteredDishes.length / dishesPerPage);
      
      // Get dishes for the current page
      const displayedDishes = filteredDishes.slice(
        (currentPage - 1) * dishesPerPage,
        currentPage * dishesPerPage
      );
  return (
<div className="App">
   <div className="sidebar">
      <div className="filter-container">
        <label>Filter by Food Type:</label>
        <select
          className="food-filter"
          value={selectedFoodType}
          onChange={(e) => setSelectedFoodType(e.target.value)}
        >
          {foodTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="states-container">
        {Object.keys(stateLinks).map((state, index) => (
          <button
            key={index}
            className={`state-box ${selectedState === state ? "active" : ""}`}
            onClick={() => fetchStateData(state)}
          >
            <span className="state-icon">{stateIcons[state]}&ensp;&Ensp;&ensp;&ensp;</span> {state}
          </button>
        ))}
      </div>
    </div>
    <div className="state-info">
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {stateData && (
        <div className="dishes-container">
          <h1>{selectedState} Special Dishes</h1>
          <h2>{selectedFoodType} Dishes</h2>

          {/* Dish List */}
          <div className="dish-list">
            {displayedDishes.map((dish, index) => (
              <article key={index} className="dish-card">
                <div className="dish-card__image-container">
                  <img
                    className="dish-card__background"
                    src={
                      dish.image?.trim()
                        ? dish.image
                        : "https://img.freepik.com/free-psd/delicious-chicken-biryani-bowl-transparent-background_84443-26601.jpg"
                    }
                    alt={dish.name}
                  />
                  <div className="dish-icons">
                    {wishlist.some((item) => item.name === dish.name) ? (
                      <img
                        src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678087-heart-64.png"
                        alt="Red Heart"
                        className="icon wishlist-icon"
                        onClick={() => toggleWishlist(dish)}
                      />
                    ) : (
                      <img
                        src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-heart-64.png"
                        alt="Black Heart"
                        className="icon wishlist-icon"
                        onClick={() => toggleWishlist(dish)}
                      />
                    )}
                    {cart.some((item) => item.name === dish.name) ? (
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/3514/3514242.png"
                        alt="Tick"
                        className="icon cart-icon"
                      />
                    ) : (
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/2121/2121815.png"
                        alt="Cart"
                        className="icon cart-icon"
                        onClick={() => addToCart(dish)}
                      />
                    )}
                  </div>
                </div>
                <div className="dish-card__content">
                  <h3 className="dish-card__title">{dish.name}</h3>
                  <p><strong>Description:</strong> {dish.description}</p>
                  <p><strong>Ingredients:</strong> {dish.ingredients?.join(", ") || "N/A"}</p>
                  <p><strong>Price:</strong> ₹{dish.price || "N/A"}</p>
                  <p><strong>Rating:</strong> ⭐{dish.rating || "N/A"}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          {filteredDishes.length > dishesPerPage && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ◀ Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next ▶
              </button>
            </div>
          )}
        </div>
      )}
    </div>
</div>


  );
};

export default State;
