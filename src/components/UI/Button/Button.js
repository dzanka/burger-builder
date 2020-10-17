import React from 'react';
import styles from './Button.model.css'

const button = (props) => (
    <button
        className = {[styles.Button, styles[props.btnType]].join(' ')}
        onClick={props.clicked}>
        {props.children}
    </button>
);

export default button;