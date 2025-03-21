// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./Newsletter.css";

// const HeroSection = () => {
//   const navigate = useNavigate();

//   const handleFindFood = (e) => {
//     e.preventDefault();
//     navigate("/login");
//   };

//   return (
//     <section className="py-5 overflow-hidden" id="home">
//       <div className="container">
//         <div className="row flex-center">
//           {/* Image Section */}
//           <div className="col-md-5 col-lg-6 order-0 order-md-1 mt-8 mt-md-0">
//             <a className="img-landing-banner" href="#!">
//               <img
//                 className="img-fluid"
//                 src="https://themewagon.github.io/foodwagon/v1.0.0/assets/img/gallery/burger.png"
//                 alt="hero-header"
//               />
//             </a>
//           </div>

//           {/* Content Section */}
//           <div className="col-md-7 col-lg-6 py-8 text-md-start text-center">
//             <h1 className="display-2 text-black" id="text">Are you starving?</h1>
//             <h2 className="text-800 mb-5 fs-4">
//               Within a few clicks, find meals that <br className="d-none d-xxl-block" />
//               are accessible near you
//             </h2>

//             {/* Tabs */}
//             <div className="card w-xxl-75">
//               <div className="card-body">
//                 <nav>
//                   <div className="nav nav-tabs" id="nav-tab" role="tablist">
//                     <button
//                       className="nav-link active mb-3"
//                       id="nav-home-tab"
//                       data-bs-toggle="tab"
//                       data-bs-target="#nav-home"
//                       type="button"
//                       role="tab"
//                       aria-controls="nav-home"
//                       aria-selected="true"
//                     >
//                       🚚 Delivery
//                     </button>
//                     <button
//                       className="nav-link mb-3"
//                       id="nav-profile-tab"
//                       data-bs-toggle="tab"
//                       data-bs-target="#nav-profile"
//                       type="button"
//                       role="tab"
//                       aria-controls="nav-profile"
//                       aria-selected="false"
//                     >
//                       🛍️ Pickup
//                     </button>
//                   </div>
//                 </nav>

//                 {/* Tab Content */}
//                 <div className="tab-content mt-3" id="nav-tabContent">
//                   <div
//                     className="tab-pane fade show active"
//                     id="nav-home"
//                     role="tabpanel"
//                     aria-labelledby="nav-home-tab"
//                   >
//                     <form className="row gx-2 gy-2 align-items-center" onSubmit={handleFindFood}>
//                       <div className="col">
//                         <div className="input-group">
//                           <input
//                             className="form-control"
//                             id="inputDelivery"
//                             type="email"
//                             placeholder="Enter Your email"
//                           />
//                         </div>
//                       </div>
//                       <div className="d-grid gap-3 col-sm-auto">
//                         <button className="btn btn-danger" type="submit">
//                           Find Food
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;


import React from "react";
import { useNavigate } from "react-router-dom";
import "./Newsletter.css";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleFindFood = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <section className="hero-section py-5" id="home">
      <div className="container text-center text-md-start">
        <div className="row align-items-center">
          {/* Content Section */}
          <div className="col-md-6">
            <h1 className="display-3 fw-bold text-dark">Are you starving?</h1>
            <p className="fs-5 text-muted">
              Within a few clicks, find meals that are accessible near you.
            </p>

            {/* Tabs */}
            <div className="card p-3 shadow-lg rounded">
              <div className="card-body">
                <nav>
                 
                </nav>

                {/* Input & Button */}
                <form className="d-flex mt-3" onSubmit={handleFindFood}>
                  <input className="form-control me-2" type="email" placeholder="Enter your email" required />
                  <button className="btn btn-danger" type="submit">Find Food</button>
                </form>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="col-md-6 text-center mt-4 mt-md-0">
            <img
              className="img-fluid rounded shadow-lg"
              src="https://themewagon.github.io/foodwagon/v1.0.0/assets/img/gallery/burger.png"
              alt="Delicious Burger"
              style={{ maxWidth: "80%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
