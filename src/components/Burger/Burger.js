import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import styles from './Burger.module.css';
//import withRouter from 'react-router-dom';

const burger = (props) => {
    /*const transformedIngredients = Object.keys(props.ingredients).map(igkey => {
        return [...Array(props.ingredients[igKey])].map(); //[,]
    }); //z objektu pole
    */
   // if (props.ingredients){
        let transformedIngredients = Object.keys(props.ingredients).map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                return <BurgerIngredient key={igKey + i} type={igKey} />
            }); //[,]
        }).reduce((arr, el) => {
            return arr.concat(el)
        }, []); //Object. z objektu pole

        if (transformedIngredients.length === 0){
            transformedIngredients = <p>Please start adding ingredients</p>
        }

        return (
            <div className={styles.Burger}>
                <BurgerIngredient type="bread-top" />
                {transformedIngredients}
                <BurgerIngredient type="bread-bottom" />
            </div>
        );
    //} else return null;
};

//export default withRouter(burger);
export default burger;