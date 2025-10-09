import React from 'react';
import MenuClient from './Menu';
import FooterClient from './Footer';
import BotRocker from './Bot';

const Layout = ({ children, onViewAllNotifications, onNavigateTo, onBackToHome, user, onLogout }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Main Menu */}
      <MenuClient 
        onNavigateTo={onNavigateTo}
        onBackToHome={onBackToHome}
        user={user}
        onLogout={onLogout}
        onViewAllNotifications={onViewAllNotifications}
      />
      
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
