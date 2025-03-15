// import React, { useState, useEffect } from "react";
// import "./feed.css";
// import Masonry from "react-masonry-css";

// const Api = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       let response = await fetch(
//         "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/storage/master/data/db.json",
//         { cache: "no-store" }
//       );
//       let result = await response.json();
//       setData(result);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const breakpointColumns = {
//     default: 3,
//     1100: 2,
//     700: 1,
//   };

//   return (
//     <>
//       <div className="container">
//         {loading ? (
//           <div className="loading-container">
//             <video
//               src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/non-veg-food-animated-icon-download-in-lottie-json-gif-static-svg-file-formats--meat-dish-masala-plate-restaurant-foods-pack-drink-icons-8786833.mp4"
//               autoPlay
//               loop
//               muted
//               className="loading-animation"
//             />
//           </div>
//         ) : error ? (
//           <p className="error">Error: {error}</p>
//         ) : (
//           <Masonry breakpointCols={breakpointColumns} className="masonry-grid" columnClassName="masonry-column">
//             {data.length === 0 ? (
//               <p>No media available</p>
//             ) : (
//               data.map((item, index) => (
//                 <div key={index} className="media-item">
//                   {item.image ? (
//                     <img src={item.image} alt={item.alt || `Image ${index + 1}`} className="media-image" />
//                   ) : item.video ? (
//                     <video className="media-video" src={item.video} controls muted autoPlay loop playsInline />
//                   ) : null}
//                 </div>
//               ))
//             )}
//           </Masonry>
//         )}
//       </div>
//     </>
//   );
// };

// export default Api;
import React, { useState, useEffect } from "react";
import "./feed.css";
import Masonry from "react-masonry-css";

const Api = () => {
  const [data, setData] = useState([]); // Stores media data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null); // Track selected media index
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility

  const fetchData = async () => {
    setLoading(true);
    try {
      let response = await fetch(
        "https://raw.githubusercontent.com/BojanapalliRajyaLaxmi/storage/master/data/db.json",
        { cache: "no-store" }
      );
      let result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1,
  };

  // Open Modal with Selected Item
  const openModal = (index) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIndex(null);
  };

  // Navigate to Previous Item
  const prevItem = () => {
    setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : data.length - 1));
  };

  // Navigate to Next Item
  const nextItem = () => {
    setSelectedIndex((prevIndex) => (prevIndex < data.length - 1 ? prevIndex + 1 : 0));
  };

  // Handle Keyboard Navigation (Arrow Keys & Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;

      if (e.key === "ArrowRight") nextItem();
      if (e.key === "ArrowLeft") prevItem();
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  return (
    <>
      <div className="container">
        {loading ? (
          <div className="loading-container">
            <video
              src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/non-veg-food-animated-icon-download-in-lottie-json-gif-static-svg-file-formats--meat-dish-masala-plate-restaurant-foods-pack-drink-icons-8786833.mp4"
              autoPlay
              loop
              muted
              className="loading-animation"
            />
          </div>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-column"
          >
            {data.length === 0 ? (
              <p>No media available</p>
            ) : (
              data.map((item, index) => (
                <div key={index} className="media-item" onClick={() => openModal(index)}>
                  {item.image ? (
                    <img src={item.image} alt={item.alt || `Image ${index + 1}`} className="media-image" />
                  ) : item.video ? (
                    <video className="media-video" src={item.video} controls muted autoPlay loop playsInline />
                  ) : null}
                </div>
              ))
            )}
          </Masonry>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedIndex !== null && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>✖</button>

            <div className="navigation-buttons">
              <button className="prev-btn" onClick={prevItem}>
                <img src="https://cdn-icons-png.flaticon.com/128/271/271220.png" alt="Previous" />
              </button>
             

              {data[selectedIndex].image ? (
                <img src={data[selectedIndex].image} alt="Selected media" className="modal-media" />
              ) : (
                <video className="modal-media" src={data[selectedIndex].video} controls autoPlay loop playsInline />
              )}

              <button className="next-btn" onClick={nextItem}>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
                  alt="Next"
                  
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Api;
