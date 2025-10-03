import React from 'react';
import MenuClient from './Menu';
import FooterClient from './Footer';
import BotRocker from './Bot';

const Layout = ({ children, onViewAllNotifications }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
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
