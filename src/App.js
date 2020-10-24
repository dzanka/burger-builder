import React, {Component} from 'react';
import styles from './App.module.css';
import Layout from './containers/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';

class App extends Component {
  state = {
    show: true
  }; 

  /*componentDidMount(){
    setTimeout(() => {
    this.setState({show: false})
    }, 5000);
  }*/

  render() {
    return (
      <div className={styles.App}>
        <Layout>
           <BurgerBuilder />
        </Layout>
      </div>
    );
  }
}

export default App;
