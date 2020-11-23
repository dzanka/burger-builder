import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import styles from './Auth.module.css';
import * as actions from '../../store/actions/auth';
import Spinner from '../../components/UI/Spinner/Spinner';

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
        isRegistration: false
    }

    componentDidMount(){
        //console.log(this.props);
        if (!this.props.buildingBurger && (this.props.authRedirectPath !== '/')){
            //console.log('redirect homepage');
            this.props.onSetAuthRedirectPath();
        }

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
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isRegistration);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isRegistration: !prevState.isRegistration};
        })
    }

    render (){
        const formElementsArray = [];
        for (let key in this.state.controls){
            formElementsArray.push({
                id: key, 
                config: this.state.controls[key]
            });
        }
        
        let form = formElementsArray.map(formElement => (
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

        if (this.props.loading){
            form = <Spinner />
        }

        let errorMessage = null;

        if (this.props.error){
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }

        let authRedirect = null;
        //console.log(this.props.authRedirectPath);
        if (this.props.isAuth){
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        return (
            <div className={styles.Auth}> 
                {authRedirect}
                {errorMessage}
                <form onSubmit = {this.submitHandler}>
                    {form}
                    <Button btnType="Success" >Submit</Button>
                </form>
                <Button 
                    clicked={this.switchAuthModeHandler}
                    btnType="Danger">Switch to {this.state.isRegistration ? 'Sign In' : 'Register'}</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuth: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch =>{
    return {
        onAuth: (email, password, isRegistration) => dispatch(actions.auth(email, password, isRegistration)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);