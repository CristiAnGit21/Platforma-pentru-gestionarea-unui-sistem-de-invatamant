const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
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
