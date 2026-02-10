import Logo from '@/assets/logo.png';
import { useState } from 'react';

type Props = {
    selectedPage: string;
    setSelectedPage: (value: string) => void;
}

import { Home, BookOpen, Calendar, Phone, DollarSign, Bell, LogOut } from 'lucide-react';

const NavBar = ({selectedPage, setSelectedPage}: Props) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <nav>
            <div
                className={`fixed left-0 top-0 h-full bg-white shadow-2xl z-50 transition-all duration-300 ease-in-out ${
                    isHovered ? 'w-64' : 'w-20'  // SCHIMBĂ: width dinamic
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex flex-col h-full p-6">
                    {/* Logo */}
                    <div className="mb-8 flex items-center justify-center">
                        <img
                            src={Logo}
                            alt="logo"
                            className={`transition-all duration-300 ${isHovered ? 'w-24' : 'w-12'}`}
                        />
                    </div>

                    <div className="flex flex-col gap-4 flex-1">
                        <LinkWithIcon
                            icon={<Home size={20} />}
                            page="Acasă"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                            isExpanded={isHovered}
                        />
                        <LinkWithIcon
                            icon={<BookOpen size={20} />}
                            page="Catalog"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                            isExpanded={isHovered}
                        />
                        <LinkWithIcon
                            icon={<Calendar size={20} />}
                            page="Orar"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                            isExpanded={isHovered}
                        />
                        <LinkWithIcon
                            icon={<Phone size={20} />}
                            page="Contacte"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                            isExpanded={isHovered}
                        />
                        <LinkWithIcon
                            icon={<DollarSign size={20} />}
                            page="Situația financiară"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                            isExpanded={isHovered}
                        />
                        <LinkWithIcon
                            icon={<Bell size={20} />}
                            page="Notificări"
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                            isExpanded={isHovered}
                        />
                    </div>

                    {/* Logout Button */}
                    <div className="mt-auto pt-4 border-t">
                        <button
                            className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                            onClick={() => {
                                localStorage.removeItem("auth");
                                window.location.reload();
                            }}
                        >
                            <LogOut size={20} />
                            <span className={`transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 w-0'}`}>
                                Ieșire
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

const LinkWithIcon = ({icon, page, setSelectedPage, isExpanded}: any) => {
    return (
        <div
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
            onClick={() => setSelectedPage(page)}
        >
            <div className="shrink-0">
                {icon}
            </div>
            <span className={`whitespace-nowrap transition-all duration-300 ${
                isExpanded ? 'opacity-100' : 'opacity-0 w-0'
            }`}>
                {page}
            </span>
        </div>
    );
}
export default NavBar