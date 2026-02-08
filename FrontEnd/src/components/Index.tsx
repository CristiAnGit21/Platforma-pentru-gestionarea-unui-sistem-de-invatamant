import Logo from '@/assets/logo.png';
import Link from "./Link.tsx";

type Props = {
    selectedPage: string;
    setSelectedPage: (value: string) => void;
}
const NavBar = ({selectedPage, setSelectedPage}: Props) => {
    const flexBetween = "flex items-center justify-between";
    
    return <nav>
        <div className={`${flexBetween} fixed top-0 z-30 w-full py-6`}>
            <div className={`${flexBetween} mx-auto w-5/6`}>
                <div className={`${flexBetween} w-full gap-16`}>
                    { /* Left side */}
                    <img src={Logo} alt="logo" className='w-24'/>

                    {/* Right side */} 
                    <div className={`${flexBetween} w-full`}>
                        <div className={`${flexBetween} gap-8 text-sm`}>
                            <Link 
                                page = "Acasă"
                                selectedPage={selectedPage}
                                setSelectedPage={setSelectedPage}
                            />
                            <Link 
                                page = "Catalog"
                                selectedPage={selectedPage}
                                setSelectedPage={setSelectedPage}
                            />
                            <Link 
                                page = "Orar"
                                selectedPage={selectedPage}
                                setSelectedPage={setSelectedPage}
                            />
                            <Link 
                                page = "Contacte"
                                selectedPage={selectedPage}
                                setSelectedPage={setSelectedPage}
                            />
                            <Link 
                                page = "Situația financiară"
                                selectedPage={selectedPage}
                                setSelectedPage={setSelectedPage}
                            />
                            <Link 
                                page = "Notificări"
                                selectedPage={selectedPage}
                                setSelectedPage={setSelectedPage}
                            />
                        </div>
                        <div>
                            <button>
                                    Ieșire
                            </button>
                        </div>
                    </div>
                </div>
                            
            </div>
        </div>
    </nav>
}

export default NavBar