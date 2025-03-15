import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const Payment= () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!stripe || !elements) return;
  
      setIsLoading(true);
      setMessage("Processing payment...");
  
      const resp = await stripe.confirmPayment({
          elements,
          confirmParams: {
              return_url: window.location.origin + "/success", // Ensure correct URL
          },
          redirect: "if_required", // ✅ Prevents iframe navigation issues
      });
  
      if (resp.error) {
          setMessage(`Error: ${resp.error.message}`);
      } else {
          setMessage("Payment successful!");
          window.location.href = "/success"; // ✅ Manual redirection
      }
  
      setIsLoading(false);
  };
  
    return (
        <div className="container mx-auto">
            <form onSubmit={handleSubmit}>
                <div className="card w-full bg-gray-200 shadow-2xl rounded-lg">
                    <div className="card-body p-6">
                        <h1 className="card-title font-bold text-2xl mb-4 text-center">
                            Complete Your Payment
                        </h1>
                        <PaymentElement />
                        <div className="card-actions justify-center">
                            <button
                                className="btn btn-primary rounded-xl text-white px-4 py-2 mt-6"
                                disabled={isLoading || !stripe || !elements}
                            >
                                {isLoading ? "Processing..." : "Pay Now"}
                            </button>
                        </div>
                        {message && (
                            <div className="mt-4 text-center text-red-500">{message}</div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Payment;
