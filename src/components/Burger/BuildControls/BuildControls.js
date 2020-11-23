import React from 'react';

import styles from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    { label: 'Bacon', type: 'bacon'},
    { label: 'Cheese', type: 'cheese'},
    { label: 'Meat', type: 'meat'},
    { label: 'Salad', type: 'salad'},
]; //type musi sediet so state ingredients type

const buildControls = (props) => (
    <div className={styles.BuildControls}>
        <p> Current Price: <strong>{props.price.toFixed(2)}e</strong></p>
        { controls.map(ctrlKey => (
            <BuildControl 
                key={ctrlKey.label} 
                label={ctrlKey.label} 
                added = {() => props.ingredientAdded(ctrlKey.type)}
                removed = {() => props.ingredientRemoved(ctrlKey.type)}
                disabled= {props.disabled[ctrlKey.type]}
            />
        ))}
        <button 
            className={styles.OrderButton}
            disabled = {!props.purchaseable}
            onClick = {props.ordered}
        >{props.isAuth ? 'ORDER NOW' : 'SIGN UP TO ORDER'}</button>
    </div>
);

export default buildControls;