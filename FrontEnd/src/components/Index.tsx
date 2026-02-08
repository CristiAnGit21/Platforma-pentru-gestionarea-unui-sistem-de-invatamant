import Logo from '@/assets/logo.png';

const NavBar = () => {
    const flexBetween = "flex items-center justify-between";
    
    return <nav>
        <div className={`${flexBetween} fixed top-0 z-30 w-full py-6`}>
            <div className={`${flexBetween} mx-auto w-5/6`}>
                <div className={`${flexBetween} w-full gap-16`}>
                    /* Left side */
                    <img src={Logo} alt="logo" className='w-16'/>
                    
                    /* Right side */
                    <div className={`${flexBetween} w-full`}>
                        <div className={`${flexBetween} gap-8 text-sm`}>
                            <p>Acasă</p>
                            <p>Catalog</p>
                            <p>Orar</p>
                            <p>Contacte</p>
                            <p>Situația financiară</p>
                            <p>Notificări</p>
                        </div>
                        <div>
                            <button>
                                    Log Out
                            </button>
                        </div>
                    </div>
                </div>
                            
            </div>
        </div>
    </nav>
}

export default NavBar