import { useState } from 'react';
import { Link } from 'react-router-dom';
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
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
                    isExpanded ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsExpanded(false)}
            />

            <nav
                className={`fixed left-0 top-0 h-full bg-white shadow-2xl z-50 transition-all duration-300 ease-in-out ${
                    isExpanded ? 'w-64' : 'w-24'
                }`}
            >
                <div className="flex flex-col h-full p-4">
                    <div className={`transition-all duration-300 overflow-hidden mb-6 ${
                        isExpanded ? 'opacity-100 h-auto' : 'opacity-0 h-0'
                    }`}>
                        <div className="flex items-center justify-center">
                            <img src={Logo} alt="logo" />
                        </div>
                    </div>

                    <div className="w-full flex justify-center mb-4">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center justify-center hover:bg-gray-100 p-3 rounded-xl transition-colors text-gray-600 w-12 h-12"
                        >
                            <Menu size={27} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 flex-1 items-center">
                        <LinkWithIcon icon={<Home size={27} />} page="Acasă" path="/" selectedPage={selectedPage} setSelectedPage={setSelectedPage} isExpanded={isExpanded} />
                        <LinkWithIcon icon={<BookOpen size={27} />} page="Catalog" path="/students" selectedPage={selectedPage} setSelectedPage={setSelectedPage} isExpanded={isExpanded} />
                        <LinkWithIcon icon={<Calendar size={27} />} page="Orar" path="/orar" selectedPage={selectedPage} setSelectedPage={setSelectedPage} isExpanded={isExpanded} />
                        <LinkWithIcon icon={<DollarSign size={27} />} page="Situația financiară" path="#" selectedPage={selectedPage} setSelectedPage={setSelectedPage} isExpanded={isExpanded} />
                        <LinkWithIcon icon={<Bell size={27} />} page="Notificări" path="#" selectedPage={selectedPage} setSelectedPage={setSelectedPage} isExpanded={isExpanded} />
                        <LinkWithIcon icon={<Phone size={27} />} page="Contacte" path="#" selectedPage={selectedPage} setSelectedPage={setSelectedPage} isExpanded={isExpanded} />
                    </div>

                    <div className="mt-auto pt-4 border-t w-full flex justify-center">
                        <button
                            className={`transition-all duration-300 bg-red-500 text-white flex items-center justify-center rounded-xl h-12 ${
                                isExpanded ? 'w-full px-4 gap-2' : 'w-12 px-0'
                            } hover:bg-red-600`}
                            onClick={() => {
                                localStorage.removeItem("auth");
                                window.location.reload();
                            }}
                        >
                            <LogOut size={20} className="shrink-0" />
                            {isExpanded && <span className="whitespace-nowrap overflow-hidden opacity-100 transition-opacity">Ieșire</span>}
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}

const LinkWithIcon = ({icon, page, setSelectedPage, isExpanded, selectedPage, path}: any) => {
    const isSelected = selectedPage === page;

    return (
        <Link to={path} className="w-full flex justify-center no-underline text-inherit">
            <div
                className={`flex items-center transition-all duration-300 cursor-pointer rounded-xl h-12 ${
                    isExpanded ? 'w-full px-4 gap-3 justify-start' : 'w-12 justify-center'
                } ${isSelected ? 'bg-violet-100 text-violet-700' : 'hover:bg-gray-100 text-gray-600'}`}
                onClick={() => setSelectedPage(page)}
            >
                <div className="flex items-center justify-center shrink-0">
                    {icon}
                </div>
                {isExpanded && (
                    <span className="whitespace-nowrap font-medium opacity-100 transition-opacity">
                        {page}
                    </span>
                )}
            </div>
        </Link>
    );
}

export default NavBar;