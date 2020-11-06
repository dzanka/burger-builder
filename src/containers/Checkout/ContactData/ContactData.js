import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import styles from './ContactData.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import axios from '../../../axios-orders';

class ContactData extends Component {
    state = {
        orderForm: {
            name: 'Jan',
            street: 'Hlavna 1',
            zipCode: '00000',
            country: 'Slovakia',
            email: 'test@test.sk'
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        //console.log(this.props.ingredients);
        //console.log('Continue Ordering');
        this.setState({loading: true});
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            customer: {
                name: 'Jan',
                address: {
                    street: 'Hlavna 1',
                    zipCode: '00000',
                    country: 'Slovakia'
                },
                email: 'test@test.sk'
            },
            deliveryMethod: 'fastest',
            paymentMethod: 'cash'
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

    render () {
        let form = (
            <form>
                <Input inputtype="input" type="text" name="name" placeholder="Your Name" />
                <Input inputtype="input" type="text" name="email" placeholder="Your Email" />
                <Input inputtype="input" type="text" name="street" placeholder="Street" />
                <Input inputtype="input" type="text" name="postal" placeholder="Postal Code" />
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
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

export default ContactData;