import React, {Component} from 'react';

import Button from '../../UI/Button/Button';
import Aux from '../../../hoc/Aux';

class OrderSummary extends Component {
    //this should be functional
    // componentDidUpdate(){
    //     console.log('[OrderSummary] componentDidUpdate');
    // }

    render(){ 
        const ingredientSummary = Object.keys(this.props.ingredients)
        .map(igKey => {
            return (
            <li key={igKey}>
                <span style={{textTransform: 'capitalize'}}>{igKey}</span>: {this.props.ingredients[igKey]}
            </li>);
        });
        return (
            <Aux>
                <h3>Your Order</h3>
                <p>A delicious burger with the following ingredients:</p>
                <ul>
                    {ingredientSummary}
                </ul>
                <p><strong>Total Price: {this.props.price.toFixed(2)}e</strong></p>
                <p>Continue to Checkout?</p>
                <Button clicked={this.props.purchaseCancelled} btnType='Danger'>GO BACK</Button>
                <Button clicked={this.props.purchaseContinued} btnType='Success'>CONTINUE</Button>
            </Aux>
        );
    }
}

export default OrderSummary;