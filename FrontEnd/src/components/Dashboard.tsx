const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">

            <h1 className="text-4xl font-bold text-center mb-6">
                Welcome again!
            </h1>
            <button
                onClick={() => {
                    localStorage.removeItem("auth");
                    window.location.reload();
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
