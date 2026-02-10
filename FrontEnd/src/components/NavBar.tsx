import { useState } from 'react';
import Logo from '@/assets/logo.png';
import { Home, BookOpen, Calendar, Phone, DollarSign, Bell, LogOut, Menu } from 'lucide-react';

type Props = {
    selectedPage: string;
    setSelectedPage: (value: string) => void;
}

const NavBar = ({selectedPage, setSelectedPage}: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            {/* Overlay - apare când navbar este deschis */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
                    isExpanded ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsExpanded(false)}
            />

            <main className="flex-1 ml-[92px] overflow-y-auto p-6 space-y-6 transition-all duration-300">
                <nav>
                    <div
                        className={`fixed left-0 top-0 h-full bg-white shadow-2xl z-50 transition-all duration-300 ease-in-out ${
                            isExpanded ? 'w-64' : 'w-24'
                        }`}
                    >
                        <div className="flex flex-col h-full p-6">
                            {/* Logo - apare doar când navbar este deschis */}
                            <div className={`transition-all duration-300 overflow-hidden mb-6 ${
                                isExpanded ? 'opacity-100 h-auto' : 'opacity-0 h-0'
                            }`}>
                                <div className="flex items-center justify-center">
                                   <img src={Logo}
                                        alt="logo"
                                   />
                                </div>
                            </div>

                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors justify-center mb-4"
                            >
                                <Menu size={27} />
                            </button>

                            <div className="flex flex-col gap-4 flex-1">
                                <LinkWithIcon
                                    icon={<Home size={27} />}
                                    page="Acasă"
                                    selectedPage={selectedPage}
                                    setSelectedPage={setSelectedPage}
                                    isExpanded={isExpanded}
                                />
                                <LinkWithIcon
                                    icon={<BookOpen size={27} />}
                                    page="Catalog"
                                    selectedPage={selectedPage}
                                    setSelectedPage={setSelectedPage}
                                    isExpanded={isExpanded}
                                />
                                <LinkWithIcon
                                    icon={<Calendar size={27} />}
                                    page="Orar"
                                    selectedPage={selectedPage}
                                    setSelectedPage={setSelectedPage}
                                    isExpanded={isExpanded}
                                />

                                <LinkWithIcon
                                    icon={<DollarSign size={27} />}
                                    page="Situația financiară"
                                    selectedPage={selectedPage}
                                    setSelectedPage={setSelectedPage}
                                    isExpanded={isExpanded}
                                />
                                <LinkWithIcon
                                    icon={<Bell size={27} />}
                                    page="Notificări"
                                    selectedPage={selectedPage}
                                    setSelectedPage={setSelectedPage}
                                    isExpanded={isExpanded}
                                />
                                <LinkWithIcon
                                    icon={<Phone size={27} />}
                                    page="Contacte"
                                    selectedPage={selectedPage}
                                    setSelectedPage={setSelectedPage}
                                    isExpanded={isExpanded}
                                />
                            </div>

                            {/* Logout Button */}
                            <div className="mt-auto pt-4 border-t">
                                <button
                                    className={`w-full py-2 rounded hover:bg-red-600 transition-all duration-300 bg-red-500 text-white flex items-center gap-2 ${
                                        isExpanded ? 'px-4 justify-center' : 'px-2 justify-center'
                                    }`}
                                    onClick={() => {
                                        localStorage.removeItem("auth");
                                        window.location.reload();
                                    }}
                                >
                                    <LogOut size={20} className="shrink-0" />
                                    <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
                                        isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                                    }`}>
                                         Ieșire
                                     </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </main>
        </>
    );
}

const LinkWithIcon = ({icon, page, setSelectedPage, isExpanded, selectedPage}: any) => {
    const isSelected = selectedPage === page;

    return (
        <div
            className={`flex items-center gap-3 cursor-pointer p-2 rounded transition-colors ${
                isExpanded ? 'justify-start' : 'justify-center'
            } ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
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