import React from 'react';
import TopRocker from './TopBar';
import MenuClient from './Menu';
import FooterClient from './Footer';
import BotRocker from './Bot';

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Bar */}
      <TopRocker />
      
      {/* Main Menu */}
      <MenuClient />
      
      {/* Main Content */}
      <main className="flex-grow-1">
        {children}
      </main>
      
      {/* Footer */}
      <FooterClient />
      
      {/* Bottom Bar */}
      <BotRocker />
    </div>
  );
};

export default Layout;
