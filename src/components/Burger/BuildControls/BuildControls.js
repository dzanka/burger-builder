import React from 'react';

import styles from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    { label: 'Salad', type: 'salad'},
    { label: 'Bacon', type: 'bacon'},
    { label: 'Cheese', type: 'cheese'},
    { label: 'Meat', type: 'meat'}
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
        >ORDER NOW</button>
    </div>
);

export default buildControls;