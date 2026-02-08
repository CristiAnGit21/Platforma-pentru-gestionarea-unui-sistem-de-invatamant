import LogIn from "./components/LogIn";

import Dashboard from "./components/Dashboard";

function App() {
    const isAuth = localStorage.getItem("auth") === "true";
    return (
        <>
            {isAuth ? <Dashboard /> : <LogIn />}
        </>
    );
}

export default App;
