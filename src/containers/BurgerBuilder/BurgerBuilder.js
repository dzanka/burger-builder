import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Aux from '../../hoc/Aux/Aux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';//
import axios from '../../axios-orders';
//import * as actionTypes from '../../store/actions/actionTypes';
import * as actions from '../../store/actions/index';
//import burger from '../../components/Burger/Burger';

const BurgerBuilder = (props) => {
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients;
    });

    const price = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuth = useSelector(state => { return state.auth.token !== null});

    useEffect(()=> {
        onInitIngredients();
    },[onInitIngredients]);

    const updatePurchaseState =  (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey =>{
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            },0);
        return sum > 0;    
    }

    const purchaseHandler = () => {
        if (isAuth)
            setPurchasing(true);
        else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }    
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push({
            pathname: '/checkout'
        });
    }

    const disabledInfo = {
        ...ings
    };

    for (let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;

    let burger = error ? <p>Ingredients cant be loaded</p> : <Spinner />;

    if (ings) {
    burger = (
        <Aux>
            <Burger ingredients={ings} />
            <BuildControls 
                ingredientAdded = {onIngredientAdded}
                ingredientRemoved = {onIngredientRemoved}
                disabled = {disabledInfo}
                price = {price}
                purchaseable= {updatePurchaseState(ings)}
                ordered={purchaseHandler}
                isAuth = {isAuth}
            />
        </Aux>
        );
        orderSummary = <OrderSummary 
            ingredients={ings}
            purchaseContinued={purchaseContinueHandler}
            purchaseCancelled={purchaseCancelHandler}
            price={price} />
    }

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler} >
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );
}


export default (withErrorHandler(BurgerBuilder, axios));
