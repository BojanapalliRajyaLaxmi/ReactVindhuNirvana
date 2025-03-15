import { useNavigate } from "react-router-dom";
import "./success.css"; // Import CSS file

const Success = () => {
    const navigate = useNavigate();

    return (
        <div className="success-container">
            <h1 className="success-message">✅ Payment Successful!</h1>
            <p className="success-text">Thank you for your purchase.</p>
            <button className="success-button" onClick={() => navigate("/")}>
                Go to Home
            </button>
        </div>
    );
};

export default Success;
