import loginImg from "../assets/designarena_image_imvn6gn3.png";

const SignUp = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4 font-sans">
            <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full min-h-[600px] overflow-hidden">

                
                <div className="w-full md:w-2/5 flex items-center justify-center p-6 bg-[#f9f9ff]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800"></h2>
                    </div>
                </div>

                
                <div className="hidden md:flex md:w-3/5 bg-[#fefefc] relative items-center justify-center overflow-hidden">
                    <img
                        src={loginImg}
                        alt="SignUp illustration"
                        className="w-full h-auto max-w-[90%] object-contain z-10"
                    />
                </div>

            </div>
        </div>
    );
};

export default SignUp;