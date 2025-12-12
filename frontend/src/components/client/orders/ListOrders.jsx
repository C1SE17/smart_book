import React from 'react';
import MyOrders from './MyOrders';

const ListOrders = ({ onNavigateTo }) => {
        return (
        <MyOrders 
            onBackToHome={() => onNavigateTo('home')}
            onNavigateTo={onNavigateTo}
        />
    );
};

export default ListOrders;
