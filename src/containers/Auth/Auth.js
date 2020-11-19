import React, {Component} from 'react';
import {connect} from 'react-redux';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import styles from './Auth.module.css';
import * as actions from '../../store/actions/auth';

class Auth extends Component {
    state = {
        controls:{
            email: {
                elementType:'input',
                elementConfig: {
                    type:'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true,
                    errorMessage: 'This field is required with email format.'
                },
                valid: false,
                touched: false
            },
            password: {
                elementType:'input',
                elementConfig: {
                    type:'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6,
                    errorMessage: 'This field is required with min. 6 characters.'
                },
                valid: false,
                touched: false
            },
        },
    }

    checkValidity(value, rules){
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

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&A-Z'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }

    inputChangedHandler = (event, controlName) => {
        const updatedForm = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        };

        this.setState({controls: updatedForm});
    };

    submitHandler = (event) =>{
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value);
    }

    render (){
        const formElementsArray = [];
        for (let key in this.state.controls){
            formElementsArray.push({
                id: key, 
                config: this.state.controls[key]
            });
        }
        
        const form = formElementsArray.map(formElement => (
            <Input 
                key={formElement.id}
                elementType={formElement.config.elementType} 
                elementConfig={formElement.config.elementConfig} 
                value={formElement.config.value}
                touched={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event,formElement.id)} 
                valid={formElement.config.valid} 
                errorMessage={formElement.config.validation.errorMessage}
            />
        ));
        return (
            <div className={styles.Auth}> 
                <form onSubmit = {this.submitHandler}>
                    {form}
                    <Button btnType="Success" >Submit</Button>
                </form>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        onAuth: (email, password) => dispatch(actions.auth(email, password))
    };
};

export default connect(null, mapDispatchToProps)(Auth);