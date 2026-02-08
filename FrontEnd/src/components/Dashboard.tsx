import NavBar from "./Index.tsx";
import {useState} from "react";

const Dashboard = () => {
    const [selectedPage, setSelectedPage] = useState<string>("acasa");
    return <div className="app bg-gray-20">
        <NavBar
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
        />
        <h1></h1>
    </div>
    
};

export default Dashboard;
