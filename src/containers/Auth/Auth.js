import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import styles from './Auth.module.css';
import * as actions from '../../store/actions/auth';
import Spinner from '../../components/UI/Spinner/Spinner';
import {updateObject, checkValidity} from '../../shared/utility';

const Auth  = (props) => {
    const [authForm, setAuthForm] = useState({
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
        });
    const [isRegistration, setIsRegistration] = useState(false);    

    const {buildingBurger, authRedirectPath, onSetAuthRedirectPath}  = props;
    
    useEffect(()=>{
        if (!buildingBurger && (authRedirectPath !== '/')){
            onSetAuthRedirectPath();
        }
    }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

    const inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(authForm, {
            [controlName]: updateObject(authForm[controlName],{
                value: event.target.value,
                valid: checkValidity(event.target.value, authForm[controlName].validation),
                touched: true
            })
        });
        setAuthForm(updatedControls);
    };

    const submitHandler = (event) =>{
        event.preventDefault();
        props.onAuth(authForm.email.value, authForm.password.value, isRegistration);
    }

    const switchAuthModeHandler = () => {
        setIsRegistration(!isRegistration);
    }

    const formElementsArray = [];
    for (let key in authForm){
        formElementsArray.push({
            id: key, 
            config: authForm[key]
        });
    }
    
    let form = formElementsArray.map(formElement => (
        <Input 
            key={formElement.id}
            elementType={formElement.config.elementType} 
            elementConfig={formElement.config.elementConfig} 
            value={formElement.config.value}
            touched={formElement.config.touched}
            changed={(event) => inputChangedHandler(event,formElement.id)} 
            valid={formElement.config.valid} 
            errorMessage={formElement.config.validation.errorMessage}
        />
    ));

    if (props.loading){
        form = <Spinner />
    }

    let errorMessage = null;

    if (props.error){
        errorMessage = (
            <p>{props.error.message}</p>
        );
    }

    let authRedirect = null;
    if (props.isAuth){
        authRedirect = <Redirect to={props.authRedirectPath} />
    }

    return (
        <div className={styles.Auth}> 
            {authRedirect}
            {errorMessage}
            <form onSubmit = {submitHandler}>
                {form}
                <Button btnType="Success" >Submit</Button>
            </form>
            <Button 
                clicked={switchAuthModeHandler}
                btnType="Danger">Switch to {isRegistration ? 'Sign In' : 'Register'}</Button>
        </div>
    );
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