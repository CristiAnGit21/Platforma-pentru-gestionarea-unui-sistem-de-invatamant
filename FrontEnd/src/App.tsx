import * as React from 'react';

import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
  
    Badge,
    MenuItem,
    Menu,

} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';


export default function App() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" color="inherit">
                    <Badge badgeContent={4} color="error">
                      
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton size="large" color="inherit">
                    <Badge badgeContent={17} color="error">
                  
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton size="large" color="inherit">
               
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f9fafb' }}>
            {/* --- BARA DE NAVIGARE --- */}
            <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        Bun Venit!
                    </Typography>
                 
                            
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        <IconButton size="large" color="inherit">
                            <Badge badgeContent={4} color="error">
                             
                            </Badge>
                        </IconButton>
                        <IconButton size="large" color="inherit">
                            <Badge badgeContent={17} color="error">
                         
                            </Badge>
                        </IconButton>
                        <IconButton size="large" edge="end" onClick={handleProfileMenuOpen} color="inherit">
                         
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton size="large" onClick={handleMobileMenuOpen} color="inherit">
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}

            {/* --- SECȚIUNEA FORMULAR (CENTRAT SUS-MIJLOC) --- */}
            <div className="flex justify-center items-center px-4 min-h-[calc(100vh-64px)]">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">

                    <div className="flex justify-between items-baseline mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
                        <p className="text-sm text-gray-600">
                            Don't have an account? <a href="#" className="font-bold text-black hover:underline">Join now</a>
                        </p>
                    </div>

                    <form className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
                            </div>
                            <input
                                type="password"
                                placeholder="Password (min. 8 character)"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="remember" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-700">Remember me</label>
                        </div>

                        <button className="w-full bg-[#1a1a1a] text-white font-semibold py-4 rounded-xl hover:bg-black transition-colors shadow-lg">
                            Sign in
                        </button>
                    </form>

                    <div className="my-8 flex justify-center overflow-hidden">
                        <div className="text-gray-200 tracking-[0.5em] font-light">
                            ///////////////////////////
                        </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-medium py-4 rounded-xl hover:bg-gray-50 transition-all">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </Box>
    );
}