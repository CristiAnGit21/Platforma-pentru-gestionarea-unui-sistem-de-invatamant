import {useState} from 'react';
import {Bars3Icon, XmarkIcon} from '@heroicons/react/24/solid';
import Logo from '@/assets/logo.png';
type Props={}

const NavBar = (props: Props) => {
    const felxBetween = "flex items-center justify-between";
    
    return <nav>
        <div className={`${felxBetween} fixed top-0 z-30 w-full py-6`}>
            <div className={`${felxBetween} mx-auto w-5/6`}>
                <div className={`${felxBetween} w-full gap-16`}>
                    /* Left side */
                    <img src={Logo} alt="logo" className='w-16'/>
                    
                    /* Right side */
                    <div className={`${felxBetween} w-full`}>
                        <div className={`${felxBetween} gap-8 text-sm`}>
                            <p>Acasă</p>
                            <p>Catalog</p>
                            <p>Orar</p>
                            <p>Contacte</p>
                            <p>Situația financiară</p>
                            <p>Notificări</p>
                        </div>
                        <div className={`${felxBetween} gap-8`}>
                            <p>Log In</p>
                            <button className='rounded-md bg-secondary-500 px-10 py-2 text-white hover:bg-primary-500 transition duration-300'>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
                            
            </div>
        </div>
    </nav>
}

export default NavBar