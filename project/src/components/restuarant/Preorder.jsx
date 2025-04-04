import  { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Preorder.module.css"; // Import CSS module

const Preorder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const restaurantName = queryParams.get("restaurant");

  const [dish, setDish] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [receiveDateTime, setReceiveDateTime] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const dishes = ["Pizza", "Burger", "Pasta", "Sushi", "Tacos", "Salad", "Steak"];
  const handlePreorderSubmit = async () => {
    if (!dish || !receiveDateTime || quantity < 1) {
      alert("Please fill all fields correctly!");
      return;
    }
  
    const preorderData = { restaurant: restaurantName, dish, quantity, receiveDateTime };
  
    const token = localStorage.getItem("tokenlogin"); // Get the token from localStorage (or wherever you store it)
  
    try {
      const response = await fetch("http://localhost:3002/preorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Send token in the request
        },
        body: JSON.stringify(preorderData),
      });
  
      if (response.ok) {
        alert("Preorder placed successfully! ✅");
        setOrderConfirmed(true); 
      } else {
        const errorData = await response.json();
        console.error("Failed to place preorder", errorData);
        alert(errorData.message || "Unauthorized");
      }
    } catch (error) {
      console.error("Error submitting preorder", error);
    }
  };
  
  

  return (
    <div className={styles["preorder-container"]}>
      {orderConfirmed ? (
        // 🎉 Order Confirmation Display
        <div className={styles["order-summary"]}>
          <h2>🎉 Your Preorder is Confirmed! 🍽️</h2>
          <p><strong>Restaurant:</strong> {restaurantName}</p>
          <p><strong>Dish:</strong> {dish}</p>
          <p><strong>Quantity:</strong> {quantity}</p>
          <p><strong>Receive On:</strong> {new Date(receiveDateTime).toLocaleString()}</p>
          <button
            className={styles["back-button"]}
            onClick={() => navigate("/")}
          >
            Back to Home 🏠
          </button>
        </div>
      ) : (
        <>
          <h2 className={styles["preorder-title"]}>Preorder from {restaurantName} 🍽️</h2>
          <label className={styles["preorder-label"]}>Dish Name:</label>
<select
  className={styles["preorder-input"]}
  value={dish}
  onChange={(e) => setDish(e.target.value)}
>
  <option value="" disabled>Select a dish</option>
  {dishes.map((dishName, index) => (
    <option key={index} value={dishName}>{dishName}</option>
  ))}
</select>

          <label className={styles["preorder-label"]}>Quantity:</label>
          <input
            type="number"
            className={styles["preorder-input"]}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min="1"
          />

          <label className={styles["preorder-label"]}>Receive Date & Time:</label>
          <input
            type="datetime-local"
            className={styles["preorder-input"]}
            value={receiveDateTime}
            onChange={(e) => setReceiveDateTime(e.target.value)}
          />

<button 
  className={styles["preorder-button"]} 
  onClick={handlePreorderSubmit}
  disabled={!dish || quantity < 1 || !receiveDateTime}
>
  Confirm Preorder ✅
</button>

        </>
      )}
    </div>
  );
};

export default Preorder;
