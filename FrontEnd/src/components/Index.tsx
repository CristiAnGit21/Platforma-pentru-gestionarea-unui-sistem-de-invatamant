import Logo from '@/assets/logo.png';

const NavBar = () => {
    const flexBetween = "flex items-center justify-between";
    
    return <nav>
        <div className={`${flexBetween} fixed top-0 z-30 w-full py-6`}>
            <div className={`${flexBetween} mx-auto w-5/6`}>
                <div className={`${flexBetween} w-full gap-16`}>
                    { /* Left side */}
                    <img src={Logo} alt="logo" className='w-30'/>

                    {/* Right side */} 
                    <div className={`${flexBetween} w-full`}>
                        <div className={`${flexBetween} gap-8 text-sm`}>
                            <button>Acasă</button>
                            <button>Catalog</button>
                            <button>Orar</button>
                            <button>Contacte</button>
                            <button>Situația financiară</button>
                            <button>Notificări</button>
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