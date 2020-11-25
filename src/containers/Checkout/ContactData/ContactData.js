import React, {Component} from 'react';
import {connect} from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import styles from './ContactData.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import {updateObject, checkValidity } from '../../../shared/utility';

class ContactData extends Component {
    state = {
        orderForm: {
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
        },
        formIsValid: false,
        //loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        //this.setState({loading: true});
        const formData = {};
        for (let formElementId in this.state.orderForm){
            formData[formElementId] = this.state.orderForm[formElementId].value;
        }
        const orderData = {
            ingredients: this.props.ings,
            price: this.props.price,
            paymentMethod: 'cash',
            orderData : formData,
            userId: this.props.userId
        } 
        this.props.onOrderBurger(orderData, this.props.token);
        //price by bolo fajn vyratat na serveri

    }

    inputChangedHandler = (event, id) => {

        const updatedFormElement = updateObject(this.state.orderForm[id], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.orderForm[id].validation),
            touched: true
        });

        const updatedOrderForm = updateObject(this.state.orderForm, {
            [id]: updatedFormElement
        });
        // /updatedFormElement;

        let formIsValid = true;

        for (let id in updatedOrderForm) {
            formIsValid = updatedOrderForm[id].valid && formIsValid;
        }

        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    };

    render () {
        const formElementsArray = [];
        for (let key in this.state.orderForm){
            formElementsArray.push({
                id: key, 
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                     <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType} 
                        elementConfig={formElement.config.elementConfig} 
                        value={formElement.config.value}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event,formElement.id)} 
                        valid={formElement.config.valid} 
                        errorMessage={formElement.config.validation.errorMessage} />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>);

        if (this.props.loading){
            form = <Spinner />;
        }

        return (
            <div className = {styles.ContactData}>
                <h4>Enter your Contact data</h4>
                {form}
            </div>
        );
    }
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