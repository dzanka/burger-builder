import React from 'react';
import styles from './Input.module.css';

const input = (props) => {
    let inputElement = null;
    let validationError = null;
    const inputStyles = [styles.InputElement];
    
    if (!props.valid && props.touched){
        inputStyles.push(styles.Invalid);
        validationError = <p className={styles.ValidationError}>{props.errorMessage}</p>;
    }

    switch (props.elementType){
        case ('input') : 
            inputElement = <input 
                className={inputStyles.join(' ')} 
                {...props.elementConfig} 
                value={props.value} 
                onChange={props.changed} />;
            break;
        case ('textarea') : 
            inputElement = <textarea 
                className={inputStyles.join(' ')} 
                {...props.elementConfig} 
                value={props.value} 
                onChange={props.changed} />;   
            break; 
        case ('select') :
            inputElement = (
                <select 
                    className={inputStyles.join(' ')}  
                    value={props.value} 
                    onChange={props.changed} >
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.displayValue}
                        </option>
                    ))}
                </select>
            )
            break;
        default : 
            inputElement = <input 
                className={inputStyles.join(' ')} 
                {...props.elementConfig}  
                value={props.value}
                onChange={props.changed} />;
    }

    return(
        <div className={styles.Input}>
            <label className={styles.Label}>{props.label}</label>
            {inputElement}
            {validationError}
        </div>
    );
};

export default input;

