import React from 'react';

import styles from './Order.module.css';

const order = (props) => {
    const ingredients = [];

    for (let ingredientName in props.ingredients){
        ingredients.push({name: ingredientName, amount: props.ingredients[ingredientName]});
    }

    const ingredientOutput = ingredients.map(ig => {
        return <span className={styles.OrderItem}
                key={ig.name}>{ig.name} ({ig.amount})</span>
    })

    return (
        <div className={styles.Order}>
            <p>Ingredients: {ingredientOutput}</p>
            <p>Price: <strong>{props.price.toFixed(2)}e</strong></p>
        </div>
    );
};

export default order;