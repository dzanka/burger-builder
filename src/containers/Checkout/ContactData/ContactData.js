import React, {useState} from 'react';
import {connect} from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import styles from './ContactData.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import {updateObject, checkValidity } from '../../../shared/utility';

const ContactData = (props) => {
    const [orderForm, setOrderForm] = useState({
            name: {
                elementType:'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true,
                    errorMessage: 'This field is required.'
                },
                valid: false,
                touched: false
            },
            street: {
                elementType:'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true,
                    errorMessage: 'This field is required.'
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType:'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3,
                    maxLength: 6,
                    errorMessage: 'This field is required, min. 3 and max. 6 chars'
                },
                valid: false,
                touched: false
            },
            country: {
                elementType:'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true,
                    errorMessage: 'This field is required.'
                },
                valid: false,
                touched: false
            },
            email: {
                elementType:'input',
                elementConfig: {
                    type:'email',
                    placeholder: 'Your E-mail'
                },
                value: '',
                validation: {
                    required: false,
                    errorMessage: 'This field is required. Format: something@domain.com',
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType:'select',
                elementConfig: {
                    options:[
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'},
                    ]
                },
                value: 'fastest',
                valid: true,
                validation: {
                    errorMessage: '',
                },
                touched: false
            }
        });
    const [formIsValid, setFormIsValid] =  useState(false);

    const orderHandler = (event) => {
        event.preventDefault();
        //this.setState({loading: true});
        const formData = {};
        for (let formElementId in orderForm){
            formData[formElementId] = orderForm[formElementId].value;
        }
        const orderData = {
            ingredients: props.ings,
            price: props.price,
            paymentMethod: 'cash',
            orderData : formData,
            userId: props.userId
        } 
        props.onOrderBurger(orderData, props.token);
        //price by bolo fajn vyratat na serveri

    }

    const inputChangedHandler = (event, id) => {

        const updatedFormElement = updateObject(orderForm[id], {
            value: event.target.value,
            valid: checkValidity(event.target.value, orderForm[id].validation),
            touched: true
        });

        const updatedOrderForm = updateObject(orderForm, {
            [id]: updatedFormElement
        });
        // /updatedFormElement;

        let currFormIsValid = true;

        for (let id in updatedOrderForm) {
            currFormIsValid = updatedOrderForm[id].valid && currFormIsValid;
        }

        setOrderForm(updatedOrderForm);
        setFormIsValid(currFormIsValid);
    };

    const formElementsArray = [];
    for (let key in orderForm){
        formElementsArray.push({
            id: key, 
            config: orderForm[key]
        });
    }

    let form = (
        <form onSubmit={orderHandler}>
            {formElementsArray.map(formElement => (
                    <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig} 
                    value={formElement.config.value}
                    touched={formElement.config.touched}
                    changed={(event) => inputChangedHandler(event,formElement.id)} 
                    valid={formElement.config.valid} 
                    errorMessage={formElement.config.validation.errorMessage} />
            ))}
            <Button btnType="Success" disabled={!formIsValid}>ORDER</Button>
        </form>);

    if (props.loading){
        form = <Spinner />;
    }

    return (
        <div className = {styles.ContactData}>
            <h4>Enter your Contact data</h4>
            {form}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch (actions.purchaseBurger(orderData, token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));