import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "antd";
import "./Search.css"; // Ensure your CSS file contains dish-card styles

const stateLinks = {
  "TS & AP": "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/ts&ap.json",
  Kerala: "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/kerala.json",
  Tamilnadu: "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/tamilnadu.json",
  Haryana: "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/haryana.json",
  Punjab: "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/punjab.json",
  Uttarakhand: "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/uttarakhand.json",
  Maharashtra: "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/maharastra.json",
  Rajasthan: "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/vindhudata/master/data/rajasthan.json",
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allData, setAllData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("query") || "");
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          Object.values(stateLinks).map(async (url) => {
            const res = await fetch(url);
            return res.ok ? res.json() : [];
          })
        );

        const formattedData = responses.flatMap((stateData) =>
          stateData.flatMap((categoryObj) =>
            Object.entries(categoryObj).flatMap(([category, items]) =>
              items.map((item) => ({
                id: item.id,
                name: item.name || "Unknown",
                category: category || "Unknown",
                image: item.image || "", 
                description: item.description || "No description available.",
                ingredients: item.ingredients || [],
                price: item.price || "N/A",
                rating: item.rating || "N/A",
              }))
            )
          )
        );

        setAllData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleWishlist = (dish) => {
    setWishlist((prev) =>
      prev.some((item) => item.name === dish.name)
        ? prev.filter((item) => item.name !== dish.name)
        : [...prev, dish]
    );
  };

  const addToCart = (dish) => {
    if (!cart.some((item) => item.name === dish.name)) {
      setCart([...cart, dish]);
    }
  };

  const filteredResults = searchQuery
    ? allData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div style={{ padding: "20px", maxWidth: "800px", justifyContent:'center' }}>
      <Input.Search
        placeholder="Search for a dish..."
        allowClear
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSearch={() => navigate(`/search?query=${searchQuery}`)}
        style={{ width: "100%", marginBottom: "20px" }}
      />

      <div className="dish-list">
        {filteredResults.length > 0 ? (
          filteredResults.map((dish, index) => (
            <article key={index} className="dish-card">
              <div className="dish-card__image-container">
                <img
                  className="dish-card__background"
                  src={
                    dish.image?.trim()
                      ? `https://tse1.mm.bing.net/th?q=${encodeURIComponent(
                          dish.name
                        )}&pid=Api`
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
                <p>
                  <strong>Description:</strong> {dish.description}
                </p>
                <p>
                  <strong>Ingredients:</strong> {dish.ingredients?.join(", ") || "N/A"}
                </p>
                <p>
                  <strong>Price:</strong> ₹{dish.price || "N/A"}
                </p>
                <p>
                  <strong>Rating:</strong> ⭐{dish.rating || "N/A"}
                </p>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(dish.name)}+recipe`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="preparation-button">Preparation 🍽️ ▶️</button>
                </a>
              </div>
            </article>
          ))
        ) : (
          <p style={{ color: "red", textAlign: "center" }}>No matching results found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
