import React, {Component} from 'react';
import {connect} from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import styles from './ContactData.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import axios from '../../../axios-orders';

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
                    type:'text',
                    placeholder: 'Your E-mail'
                },
                value: '',
                validation: {
                    required: false,
                    errorMessage: 'This field is required.'
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
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        //console.log(this.props.ingredients);
        //console.log('Continue Ordering');
        this.setState({loading: true});
        const formData = {};
        for (let formElementId in this.state.orderForm){
            formData[formElementId] = this.state.orderForm[formElementId].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            paymentMethod: 'cash',
            orderData : formData
        } //price by bolo fajn vyratat na serveri
        axios.post('/orders.json', order)
        .then(
            response => {
                this.setState({loading: false});
                this.props.history.push('/');
                console.log('order succesfull');
            })
        .catch(error => {
            this.setState({loading: false});
        });
    }

    checkValidty(value, rules){
        let isValid  = true;

        if ((rules.required) && isValid){
            isValid = value.trim() !== '';
        }

        if ((rules.minLength) && isValid){
            isValid = value.length >= rules.minLength;
        }

        if ((rules.maxLength) && isValid){
            isValid = value.length <= rules.maxLength;
        }

        return isValid;
    }

    inputChangedHandler = (event, id) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };

        const updatedFormElement = {
            ...updatedOrderForm[id]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidty(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[id] = updatedFormElement;

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

        //console.log(formElementsArray);
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
        if (this.state.loading){
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
        ings: state.ingredients,
        price: state.totalPrice
    }
}

export default connect(mapStateToProps)(ContactData);