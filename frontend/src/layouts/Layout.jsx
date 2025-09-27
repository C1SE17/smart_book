import React from 'react';
import TopRocker from './TopRocker';
import MenuClient from './MenuClient';
import FooterClient from './FooterClient';
import BotRocker from './BotRocker';

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
