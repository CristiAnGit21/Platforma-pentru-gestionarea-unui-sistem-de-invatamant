import LogIn from "./pages/LogIn";
import { BrowserRouter} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
    const isAuth = localStorage.getItem("auth") === "true";
    return (
        <BrowserRouter>
            {isAuth ? <AppRoutes /> : <LogIn />}
        </BrowserRouter>
    );
}

export default App;
