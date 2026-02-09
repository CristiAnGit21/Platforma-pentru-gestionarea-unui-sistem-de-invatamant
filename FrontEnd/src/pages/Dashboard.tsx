import NavBar from "../components/Index.tsx";
import {useState} from "react";

const Dashboard = () => {
    const [selectedPage, setSelectedPage] = useState<string>("acasa");
    return <div className="app bg-gray-20">
        <NavBar
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
        />
      
    </div>
    
};

export default Dashboard;
