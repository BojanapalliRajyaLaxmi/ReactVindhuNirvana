import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_51R2UuPRtRDR7EaLmaTUN2eAO46XMHLc0R1Q5ENSvut5CTpkJpw5l4QNy5SP3ByjJQkeGySh6pXIAfztgcFA9ekmq00sIVT7w2G");

const StripePayment = () => {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        axios.post("https://vindhuservercode.onrender.com/payment", {
            items: [{ name: "Momos", amount: 40.00 }] // Sending correct item data
        })
        .then((response) => {
            setClientSecret(response.data.clientSecret);
        })
        .catch((error) => {
            console.error("Error fetching clientSecret:", error);
        });
    }, []);

    return (
        clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm />
            </Elements>
        ) : (
            <p>Loading payment...</p>
        )
    );
};

export default StripePayment;
