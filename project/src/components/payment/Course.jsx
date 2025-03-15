import { useNavigate } from "react-router-dom";

const Course = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center">
            <div className="card w-96 bg-gray-200 shadow-xl">
                <figure className="px-10 pt-10">
                    <img
                        src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png"
                        alt="GeeksForGeeks Course"
                        className="w-full"
                    />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">
                        Full Stack Development with React & Node JS - Live
                    </h2>
                    <p>
                        Looking to become a full-stack developer? This live, online course
                        with a focus on the popular JS library React for front-end and
                        Node.js for back-end along with APIs and deployment is a must-have
                        program for any aspiring developer.
                    </p>
                    <p>
                        <b>Course Price: $40.00</b>
                    </p>
                    <div className="card-actions justify-center">
                        <button
                            className="btn btn-primary rounded-lg text-white mt-5"
                            onClick={() => navigate("/payment")}
                        >
                            Purchase
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Course;
