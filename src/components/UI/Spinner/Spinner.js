/* https://projects.lukehaas.me/css-loaders/ */
import React from 'react';

import styles from './Spinner.module.css';

const spinner = () =>  (
    <div className={styles.Spinner}>Loading...</div>
);

export default spinner;