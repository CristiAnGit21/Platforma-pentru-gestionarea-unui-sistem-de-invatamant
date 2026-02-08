import LogIn from "./components/LogIn";
import Dashboard from "./components/Dashboard";

function App() {
   // return <div className="app bg-blue-800">app</div>
    const isAuth = localStorage.getItem("auth") === "true";
    return (
        <>
            {isAuth ? <Dashboard /> : <LogIn />}
        </>
    );
}

export default App;
