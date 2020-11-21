import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem';
import styles from './NavigationItems.module.css';

const navigationItems = (props) => (
        <ul className={styles.NavigationItems}>
            <NavigationItem link="/" exact>Burger Builder</NavigationItem>
            <NavigationItem link="/orders">Orders</NavigationItem>
            {props.isAuth ? 
                <NavigationItem link="/logout">Logout</NavigationItem>
            :   <NavigationItem link="/auth">Sign In</NavigationItem>}
        </ul>
);

export default navigationItems;