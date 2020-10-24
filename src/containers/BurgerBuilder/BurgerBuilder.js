import React, { Component} from 'react';
import Aux from '../../hoc/Aux/Aux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.2
}

class BurgerBuilder extends Component{
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
}

componentDidMount() {
    axios.get('ingredients.json')
        .then(response => {          
            this.setState({ingredients: response.data});
        })
        .catch(error => {
            this.setState({error: true});
        });
}

updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
        .map(igKey =>{
            return ingredients[igKey];
        })
        .reduce((sum, el) => {
            return sum + el;
        },0);
    this.setState({purchaseable: sum > 0});    
}

addIngredientHandler = (type) =>{
    const updatedCount = this.state.ingredients[type] + 1;
    const updatedIngredients = {
        ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
}

removeIngredientHandler = (type) =>{
    if (this.state.ingredients[type] <= 0)  return;

    const updatedCount = this.state.ingredients[type] - 1;
    const updatedIngredients = {
        ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
}

purchaseHandler = () => {
    this.setState({purchasing:true});
}

purchaseCancelHandler = () => {
    this.setState({purchasing: false});
}

purchaseContinueHandler = () => {
    this.setState({loading: true});
    const order = {
        ingredients: this.state.ingredients,
        price: this.state.totalPrice,
        customer: {
            name: 'Jan',
            address: {
                street: 'Hlavna 1',
                zipCode: '00000',
                country: 'Slovakia'
            },
            email: 'test@test.sk'
        },
        deliveryMethod: 'fastest',
        paymentMethod: 'cash'
    } //price by bolo fajn vyratat na serveri
    axios.post('/orders', order)
    .then( response => {
            this.setState({loading: false, purchasing: false});
        })
    .catch(error => {
        //console.log('ERROR');
        this.setState({loading: false, purchasing: false});
    });
}

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;

        let burger =  this.state.error ? <p>Ingredients can't be loaded.</p> : <Spinner />
        //let burger = <Spinner />
        if (this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls 
                            ingredientAdded = {this.addIngredientHandler}
                            ingredientRemoved = {this.removeIngredientHandler}
                            disabled = {disabledInfo}
                            price = {this.state.totalPrice}
                            purchaseable= {this.state.purchaseable}
                            ordered={this.purchaseHandler}
                        />
                </Aux>);   
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                purchaseContinued={this.purchaseContinueHandler}
                purchaseCancelled={this.purchaseCancelHandler}
                price={this.state.totalPrice} />
        }   
        
        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                   {orderSummary}
                </Modal>
               {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);
//export default BurgerBuilder;
