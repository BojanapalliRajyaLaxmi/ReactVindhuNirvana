import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./restuarant.css";
import axios from "axios";
import Breadcrumb from "./ResSlide";
import Footer from "../footer/Footer";
import Skeleton from "../spinner/spinner";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
const OPENCAGE_API_KEY = "9828b2b94eb148eea5732cb0209e8eb8";

const Restaurant = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // const [liked, setLiked] = useState(false);
  const [distance, setDistance] = useState(1000);
  const token = localStorage.getItem("tokenlogin");
  const [likedRestaurants, setLikedRestaurants] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [routeData, setRouteData] = useState(null);
  // const [showMapModal, setShowMapModal] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const fetchRoute = async () => {
    if (!userLocation || !selectedRestaurant) return;

    const start = `${userLocation.lon},${userLocation.lat}`;
    const end = `${selectedRestaurant.lon},${selectedRestaurant.lat}`;

    try {
      const response = await fetch(`http://localhost:3002/route?start=${start}&end=${end}`);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const route = data.features[0];

        if (route.properties?.segments?.length > 0) {
          const summary = route.properties.segments[0];
          const coordinates = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);

          setRouteData({
            distance: (summary.distance / 1000).toFixed(2), 
            duration: Math.round(summary.duration / 60),
          });

          setRouteCoordinates(coordinates);
        }
      } else {
        console.error("No route found");
      }
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  useEffect(() => {
    console.log("Selected Restaurant:", selectedRestaurant);
    console.log("User Location:", userLocation);

    if (selectedRestaurant?.lat && selectedRestaurant?.lon && userLocation) {
      fetchRoute();
    }
  }, [selectedRestaurant, userLocation]);

  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedRestaurant(null);
  // };
  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setUserLocation(coords);
          getUserAddress(coords.lat, coords.lon);
          fetchRestaurants(coords.lat, coords.lon);
        },
        () => {
          setError("Permission denied or location unavailable");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };
  const handleShowMap = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowMapModal(true);
  };
  const getUserAddress = async (lat, lon) => {
    try {
      let response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`
      );
      let data = await response.json();

      if (data.results.length > 0) {
        setUserAddress(data.results[0].formatted);
      } else {
        setUserAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching user address:", error);
      setUserAddress("Error fetching address");
    }
  };

  const getRestaurantAddress = async (lat, lon) => {
    try {
      let response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`
      );
      let data = await response.json();

      if (data.results.length > 0) {
        return data.results[0].formatted;
      } else {
        return "Address not found";
      }
    } catch (error) {
      console.error("Error fetching restaurant address:", error);
      return "Error fetching address";
    }
  };
  const restaurantImages = [
    "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/914388/pexels-photo-914388.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2290753/pexels-photo-2290753.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/984888/pexels-photo-984888.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/734562/pexels-photo-734562.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1546039/pexels-photo-1546039.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1402407/pexels-photo-1402407.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/4676640/pexels-photo-4676640.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/4913313/pexels-photo-4913313.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2504911/pexels-photo-2504911.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1741285/pexels-photo-1741285.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1055054/pexels-photo-1055054.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/4255489/pexels-photo-4255489.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1296543/pexels-photo-1296543.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1833320/pexels-photo-1833320.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1546360/pexels-photo-1546360.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2565222/pexels-photo-2565222.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2923034/pexels-photo-2923034.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/390658/pexels-photo-390658.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2067431/pexels-photo-2067431.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/3044536/pexels-photo-3044536.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2564252/pexels-photo-2564252.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2878738/pexels-photo-2878738.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1843655/pexels-photo-1843655.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1841184/pexels-photo-1841184.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1801106/pexels-photo-1801106.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2888679/pexels-photo-2888679.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];
  const fetchRestaurants = async (lat, lon, range) => {
    try {
      if (!lat || !lon || !range) {
        console.error("Invalid coordinates or range");
        return;
      }

      const query = `[out:json];node["amenity"="restaurant"](around:${range},${lat},${lon});out;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
        query
      )}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.elements.length > 0) {
        const enrichedRestaurants = await Promise.all(
          data.elements.map(async (restaurant) => {
            const { lat, lon, tags } = restaurant;
            const address = await getRestaurantAddress(lat, lon);
            const randomImage =
              restaurantImages[
              Math.floor(Math.random() * restaurantImages.length)
              ];
            return {
              name: tags.name || "Small Hotel",
              cuisine: tags.cuisine || "All Dishes Available",
              address,
              lat,
              lon,
              image: randomImage,
            };
          })
        );

        setRestaurants(enrichedRestaurants);
      } else {
        setRestaurants([]);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchRestaurants(userLocation.lat, userLocation.lon, distance);
    }
  }, [distance, userLocation]);

  const handleShowModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRestaurant(null);
  };
  useEffect(() => {
    checkIfLiked();
  }, []);

  const checkIfLiked = async () => {
    try {
      if (!token) {
        console.error("No token found.");
        return;
      }

      const response = await fetch("http://localhost:3002/restaurant", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.restaurants) {
        setLikedRestaurants(data.restaurants.map((item) => item.name));
      }
    } catch (error) {
      console.error("Error checking liked status:", error.message);
    }
  };

  useEffect(() => {
    if (selectedRestaurant) {
      checkIfLiked();
    }
  }, [selectedRestaurant]);

  const toggleLike = async (restaurant) => {
    try {
      const isAlreadyLiked = likedRestaurants.includes(restaurant.name);
      let updatedList = [...likedRestaurants];

      if (isAlreadyLiked) {
        updatedList = updatedList.filter((name) => name !== restaurant.name);
        await axios.delete(
          `http://localhost:3002/restaurant/${restaurant.name}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        updatedList.push(restaurant.name);
        await axios.post(
          "http://localhost:3002/restaurant",
          {
            restaurant: {
              name: restaurant.name,
              id: restaurant.id || restaurant.name,
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setLikedRestaurants(updatedList);
    } catch {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (showWishlist) {
      checkIfLiked();
    }
  }, [likedRestaurants]);
  return (
    <div className="restaurant-wrapper">
      <div className="fixed-header">
        <Breadcrumb />
        {error && <p className="error">{error}</p>}
        {userLocation && (
          <>
            <p className="user-address">
              🏠 {userAddress || "Fetching address..."}
            </p>
          </>
        )}

        <div className="distance-dropdown">
          <select
            className="form-select"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
          >
            {[1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000].map((range) => (
              <option key={range} value={range}>
                {range} m
              </option>
            ))}
          </select>
        </div>
      </div>
      {userLocation ? (
        loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : restaurants.length > 0 ? (
          <ul className="restaurant-list">
            {restaurants.map((restaurant, index) => (
              <li key={index} className="restaurant-item">
                <div className="restaurant-image-container">
                  <img
                    src={restaurant.image}
                    alt="Restaurant"
                    className="restaurant-image"
                  />
                  <div className="restaurant-icons">
                    <span
                      className="view-more-icon"
                      onClick={() => handleShowModal(restaurant)}
                      style={{ cursor: "pointer" }}
                    >
                      👁️
                    </span>
                    {/* <span className="add-to-cart-icon">🛒</span> */}
                  </div>
                </div>
                <h3 className="restaurant-name">{restaurant.name}</h3>
              </li>
            ))}
          </ul>
        ) : (
          <p>No restaurants found</p>
        )
      ) : (
        <p id="render">
          <Skeleton />
        </p>
      )}

      <Modal show={showModal} onHide={handleCloseModal} fullscreen>
        <Modal.Header closeButton style={{ background: "#333", color: "wheat" }}>
          <Modal.Title
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
            }}
          >
            {selectedRestaurant?.name || "Restaurant Name"}
          </Modal.Title>
        </Modal.Header>
<Modal.Body className="modal-body-flex" style={{ display: "flex", height: "85vh", gap: "20px", padding: "20px" }}>
          <div
            style={{
              flex: "3",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {selectedRestaurant?.image ? (
              <img
                src={selectedRestaurant.image}
                alt="Restaurant"
                style={{
                  width: "100%",
                  maxHeight: "350px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            ) : (
              <p style={{ textAlign: "center", color: "gray" }}>No image available</p>
            )}

            <div
              style={{
                width: "100%",
                padding: "15px",
                textAlign: "center",
                background: "#f8f8f8",
                borderRadius: "10px",
                marginTop: "20px",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  color: "black",
                }}
              >
                {selectedRestaurant?.description || "A great place to enjoy delicious food!"}
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  color: "#ff9800",
                  marginBottom: "5px",
                }}
              >
                ⭐ {selectedRestaurant?.rating || (Math.random() * 2 + 3).toFixed(1)} / 5
              </p>
              <p style={{ fontSize: "1rem", color: "gray" }}>
                {selectedRestaurant?.reviews
                  ? selectedRestaurant.reviews[0]
                  : "Amazing experience! Would visit again."}
              </p>
            </div>
            <div
              style={{
                width: "100%",
                background: "#fff",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                fontSize: "1.2rem",
                marginTop: "20px",
              }}
            >
              <p id="table">
                <strong>Tables:</strong> {Math.floor(Math.random() * 10) + 1}
              </p>
              <p id="table">
                <strong>Seats:</strong> {Math.floor(Math.random() * 6) + 1} per table
              </p>
              <p id="table">
                <strong>Table Price:</strong> ₹{Math.floor(Math.random() * 500) + 500}
              </p>
              <Button
                variant="primary"
                style={{ width: "100%", padding: "10px", fontSize: "1.2rem", borderRadius: "8px", marginTop: "10px" }}
                onClick={() => navigate(`/preorder?restaurant=${selectedRestaurant?.name}`)}
              >
                Preorder 🍽️
              </Button>
            </div>
          </div>
          <div
            style={{
              flex: "2",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {selectedRestaurant?.address ? (
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <p
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  📍 {selectedRestaurant.address}
                </p>
                <p style={{ fontSize: "1.2rem", color: "gray" }}>
                  🍽️ {selectedRestaurant.cuisine || "Cuisine not specified"}
                </p>
              </div>
            ) : (
              <p style={{ color: "gray", textAlign: "center" }}>Address not available</p>
            )}
            <span
              className="wishlist-icon"
              onClick={() => selectedRestaurant && toggleLike(selectedRestaurant)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "15px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
            >
              <img
                src={
                  selectedRestaurant?.name &&
                    likedRestaurants.includes(selectedRestaurant.name)
                    ? "https://img.icons8.com/?size=80&id=dKjAZULRJlO7&format=png"
                    : "https://img.icons8.com/?size=80&id=G3rOvlDYR75Z&format=png"
                }
                alt="Wishlist Icon"
                style={{
                  width: "50px",
                  height: "50px",
                  transition: "transform 0.3s",
                }}
              />
            </span>
            <span className="add-to-cart-icon">🛒</span>
            <button
              onClick={() => setShowRoute(!showRoute)}
              style={{
                marginTop: "15px",
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1.1rem",
                transition: "background-color 0.3s ease",
              }}
            >
              {showRoute ? "Hide directions" : "Get directions"}
            </button>
            <MapContainer
              center={[selectedRestaurant?.lat || 0, selectedRestaurant?.lon || 0]}
              zoom={10}
              style={{
                height: "500px",
                width: "100%",
                maxWidth: "1200px",
                borderRadius: "12px",
                marginTop: "0px"
              }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {userLocation?.lat && userLocation?.lon && (
                <Marker position={[userLocation.lat, userLocation.lon]}>
                  <Popup>Your Location</Popup>
                </Marker>
              )}
              {selectedRestaurant?.lat && selectedRestaurant?.lon && (
                <>
                  <Marker position={[selectedRestaurant.lat, selectedRestaurant.lon]}>
                    <Popup>Restaurant Location</Popup>
                  </Marker>

                  <div
                    style={{
                      position: "absolute",
                      top: "250px",
                      left: "90%",
                      transform: "translateX(-50%)",
                      zIndex: "1000",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor: "rgba(110, 106, 106, 0.6)",
                      padding: "10px",
                      width: '200px',
                      borderRadius: "8px"
                    }}
                  >
                    <p id='tables'>Distance: {routeData?.distance} km</p>
                    <p id='tables'>Estimated Time: {routeData?.duration} min</p>
                  </div>
                </>
              )}
              {showRoute && routeCoordinates?.length > 0 && (
                <Polyline positions={routeCoordinates} color="blue" />
              )}
            </MapContainer>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      <Footer />
    </div>
  );
};

export default Restaurant;
