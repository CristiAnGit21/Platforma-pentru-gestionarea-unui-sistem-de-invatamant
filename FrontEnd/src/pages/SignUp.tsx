import { useNavigate } from "react-router-dom"; 
import loginImg from "../assets/designarena_image_imvn6gn3.png";

const SignUp = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4 font-sans">
            <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full min-h-[600px] overflow-hidden">

                <div className="w-full md:w-2/5 flex items-center justify-center p-6 bg-[#f9f9ff]">
                    {/* Început Formular */}
                    <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8 w-full max-w-sm border border-gray-100">

                        <div className="mb-8 text-left">
                            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Sign Up</h2>
                            <p className="text-gray-500 text-sm">
                                I'm already a member.
                                <span
                                    onClick={() => navigate("/login")}
                                    className="text-purple-600 font-semibold cursor-pointer ml-1 hover:underline"
                                >
                                    Login
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex md:w-3/5 bg-[#fefefc] relative items-center justify-center overflow-hidden">
                    <img src={loginImg} alt="SignUp" className="w-full h-auto max-w-[90%] object-contain z-10" />
                </div>
            </div>
        </div>
    );
};

export default SignUp;