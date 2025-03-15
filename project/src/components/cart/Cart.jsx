// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Footer from "../footer/Footer";
// import "./cart.css";
// import  Breadcrumb  from "./CartSlide";

// const Cart = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState([]);
//   const [coupon, setCoupon] = useState("");

//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const token = localStorage.getItem("tokenlogin");
//         if (!token) return;

//         const response = await fetch("http://localhost:3002/cart", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) return;
//         const data = await response.json();
//         setCart(data.cart || []);
//       } catch (error) {
//         console.error("Error fetching cart", error);
//       }
//     };
//     fetchCart();
//   }, []);
//   const increaseQuantity = (itemName) => {
//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         item.name === itemName ? { ...item, quantity: (item.quantity || 1) + 1 } : item
//       )
//     );
//   };
//   const decreaseQuantity = (itemName) => {
//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         item.name === itemName
//           ? { ...item, quantity: item.quantity - 1 }
//           : item
//       ).filter((item) => !(item.name === itemName && item.quantity === 1)) // Removes only that specific item when quantity is 1
//     );
//   };
  
//   const handleRemoveFromCart = (itemName) => {
//     setCart(cart.filter((item) => item.name !== itemName));
//   };

//   return (<>
//     <Breadcrumb/>
//     <div className="cart-container">
//       <div className="cart-left">  
//         {cart.length === 0 ? (
//           <p className="cart-message">Your cart is empty. Add some delicious items! 🍔</p>
//         ) : (
//           <div className="cart-list">
//             {cart.map((item) => (
//               <div key={item.name} className="cart-card">
//                 <div className="cart-left-section">
//                   <img className="cart-image" src={item.image} alt={item.name} />
//                   <h3>{item.name}</h3>
//                 </div>
//                 <div className="cart-details">
//                   <div className="cart-quantity">
//                     <button className="quantity-btn decrease" onClick={() => decreaseQuantity(item.name)}>-</button>
//                     <span className="quantity-value">{item.quantity || 1}</span>
//                     <button className="quantity-btn increase" onClick={() => increaseQuantity(item.name)}>+</button>
//                   </div>
//                   <span id='price'> Rs:{item.price}</span>
//                   <button className="remove-btn" onClick={() => handleRemoveFromCart(item.name)}><img src="https://cdn-icons-png.flaticon.com/128/18879/18879046.png" width={20}></img></button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <div className="cart-right">
//   <h3 className="total-price">Total Price</h3>
  
//   {/* Calculate Total Items Price */}
//   <p>Items Price: ₹{cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)}</p>

//   {/* Random Charges */}
//   {cart.length > 0 && (
//     <>
//       <p>Delivery Fee: ₹{50 + Math.floor(Math.random() * 30)}</p> {/* Random between 50-80 */}
//       <p>GST (5%): ₹{Math.round(cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0) * 0.05)}</p>
//       <p>Bag Charges: ₹{Math.random() > 0.5 ? 10 : 0}</p> {/* Either 10 or 0 */}
//       <p>Service Tax: ₹{Math.floor(Math.random() * 20) + 10}</p> {/* Random between 10-30 */}
//     </>
//   )}
//   <h3>
//     Grand Total: ₹{
//       cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0) + 
//       (cart.length > 0 ? (50 + Math.floor(Math.random() * 30)) +  // Delivery Fee
//       Math.round(cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0) * 0.05) + // GST
//       (Math.random() > 0.5 ? 10 : 0) + // Bag Charges
//       (Math.floor(Math.random() * 20) + 10) // Service Tax
//       : 0)
//     }
//   </h3>

//   {/* Coupon Section */}
//   <div className="coupon-section">
//     <input type="text" className="coupon-input" placeholder="Enter coupon code" />
//     <button className="apply-coupon-btn">Apply Coupon</button>
//   </div>

//   <button className="pay-now-btn" onClick={() => navigate("/payment")}>Order Now 🚀</button>
// </div>

//     </div>
//       <Footer/>
//       </>
//   );
  
// };

// export default Cart;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";
import "./cart.css";
import Breadcrumb from "./CartSlide";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(50 + Math.floor(Math.random() * 30));
  const [bagCharges, setBagCharges] = useState(Math.random() > 0.5 ? 10 : 0);
  const [serviceTax, setServiceTax] = useState(Math.floor(Math.random() * 20) + 10);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("tokenlogin");
        if (!token) return;

        const response = await fetch("https://vindhuservercode.onrender.com/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;
        const data = await response.json();
        setCart(data.cart || []);
      } catch (error) {
        console.error("Error fetching cart", error);
      }
    };
    fetchCart();
  }, []);

  const increaseQuantity = (itemName) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.name === itemName ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const decreaseQuantity = (itemName) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.name === itemName && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // Removes item if quantity reaches 0
    );
  };

  const handleRemoveFromCart = (itemName) => {
    setCart(cart.filter((item) => item.name !== itemName));
  };

  const subtotal = cart.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  const gst = Math.round(subtotal * 0.05);

  const applyCoupon = () => {
    if (coupon.toLowerCase() === "rajyalaxmi") {
      setDiscount(0.5 * subtotal);
    } else {
      setDiscount(0);
      alert("Invalid Coupon Code! ❌");
    }
  };

  const grandTotal = subtotal - discount + deliveryFee + gst + bagCharges + serviceTax;

  return (
    <>
      <Breadcrumb />
      <div className="cart-container">
        <div className="cart-left">
          {cart.length === 0 ? (
            <p className="cart-message">Your cart is empty. Add some delicious items! 🍔</p>
          ) : (
            <div className="cart-list">
              {cart.map((item) => (
                <div key={item.name} className="cart-card">
                  <div className="cart-left-section">
                    <img className="cart-image" src={item.image} alt={item.name} />
                    <h3>{item.name}</h3>
                  </div>
                  <div className="cart-details">
                    <div className="cart-quantity">
                      <button className="quantity-btn decrease" onClick={() => decreaseQuantity(item.name)}>-</button>
                      <span className="quantity-value">{item.quantity || 1}</span>
                      <button className="quantity-btn increase" onClick={() => increaseQuantity(item.name)}>+</button>
                    </div>
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>Rs: {item.price}</span>
                    <button className="remove-btn" onClick={() => handleRemoveFromCart(item.name)}>
                      <img src="https://cdn-icons-png.flaticon.com/128/6722/6722996.png" width={40} alt="Remove" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="cart-right">
          <h3 className="total-price">Subtotal: ₹{subtotal.toFixed(2)}</h3>
          {discount > 0 && <h3 className="discount-text" style={{ color: "green" }}>Discount: -₹{discount.toFixed(2)}</h3>}
          
          {cart.length > 0 && (
            <>
              <p>Delivery Fee: ₹{deliveryFee}</p>
              <p>GST (5%): ₹{gst}</p>
              <p>Bag Charges: ₹{bagCharges}</p>
              <p>Service Tax: ₹{serviceTax}</p>
            </>
          )}

          <h3 className="grand-total">Grand Total: ₹{grandTotal.toFixed(2)}</h3>

          {/* Coupon Section */}
          <div className="coupon-section">
            <input
              type="text"
              className="coupon-input"
              placeholder="Enter coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button className="apply-coupon-btn" onClick={applyCoupon}>
              Apply Coupon
            </button>
          </div>

          <button className="pay-now-btn" onClick={() => navigate("/payment")}>
            Order Now 🚀
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
