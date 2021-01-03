import React, { useState } from 'react';
import { connect } from 'react-redux'

import Aux from '../../hoc/Aux/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import styles from './Layout.module.css';

const Layout = (props) => {
    const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);

    const sideDrawerClosedHandler = () => {
        setSideDrawerIsVisible(false);
    }

    const sideDrawerToggleHandler = () => {
        setSideDrawerIsVisible(!sideDrawerIsVisible);
    }

    return(
        <Aux>
            <Toolbar 
                isAuth={props.isAuth}
                drawerToggleClicked={sideDrawerToggleHandler} />
            <SideDrawer 
                isAuth={props.isAuth}
                closed={sideDrawerClosedHandler} 
                open={sideDrawerIsVisible} />
            <main className = {styles.Content}>
                {props.children}
            </main>
        </Aux>
    )
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.token !== null
    };
}

export default connect(mapStateToProps)(Layout);