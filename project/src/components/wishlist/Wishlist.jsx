import React, { useState, useEffect } from "react";
import "./wishlist.css";
import Breadcrumb from "./WishlistSlide";
import { Heart, Trash2 } from "lucide-react";
import Footer from "../footer/Footer";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [view, setView] = useState("food");

  useEffect(() => {
    fetchWishlist();
    fetchRestaurants();
  }, []);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("tokenlogin");
    if (!token) return;

    try {
      const response = await fetch("https://vindhuservercode.onrender.com/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setWishlist(data.wishlist || []);
      }
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  const fetchRestaurants = async () => {
    const token = localStorage.getItem("tokenlogin");
    if (!token) return;

    try {
      const response = await fetch("https://vindhuservercode.onrender.com/restaurant", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setRestaurants(data.restaurants || []);
      }
    } catch (error) {
      console.error("Error fetching restaurants", error);
    }
  };

  const removeFromWishlist = async (dishId) => {
    const token = localStorage.getItem("tokenlogin");
    if (!token) return;

    try {
      const response = await fetch(`https://vindhuservercode.onrender.com/wishlist/${dishId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setWishlist((prevWishlist) =>
          prevWishlist.filter((dish) => dish._id !== dishId)
        );
      }
    } catch (error) {
      console.error("Error removing item", error);
    }
  };

  return (
    <div className="wishlist-page">
      <Breadcrumb />
      <div className="dropdown-container">
        <select onChange={(e) => setView(e.target.value)} className="wishlist-dropdown">
          <option value="food">Food</option>
          <option value="restaurants">Restaurants</option>
        </select>
      </div>

      {view === "food" ? (
        wishlist.length === 0 ? (
          <p style={{color:'black',justifyContent:'center'}}>No items in wishlist.</p>
        ) : (
          <div className="wishlist-container">
            {wishlist.map((dish) => (
              <article key={dish._id} className="dish-card">
                <img className="dish-card__background" src={dish.image} alt={dish.name} />
                <div className="dish-card__content">
                  <h3 className="dish-card__title">{dish.name}</h3>
                  <p>Description: {dish.description}</p>
                  <p><strong>Ingredients:</strong> {dish.ingredients?.length ? dish.ingredients.join(", ") : "N/A"}</p>
                  <p><strong>Price:</strong> ₹{dish.price || "N/A"}</p>
                  <p><strong>Rating:</strong> ⭐{dish.rating || "N/A"}</p>
                </div>
                <div className="actions">
                  <Heart className="icon wishlist-icon active" onClick={() => removeFromWishlist(dish._id)} />
                </div>
              </article>
            ))}
          </div>
        )
      ) : (
        restaurants.length === 0 ? (
          <p style={{color:'black'}}>No liked restaurants found.</p>
        ) : (
          <ul className="restaurant-list">
            {restaurants.map((restaurant, index) => (
              <li key={index} className="restaurant-item">
                <h3>{restaurant.name}</h3>
                <p>Cuisine: {restaurant.cuisine}</p>
                <p>Location: {restaurant.location}</p>
              </li>
            ))}
          </ul>
        )
      )}
      <Footer />
    </div>
  );
};

export default Wishlist;
