import React,{Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-order';
import Spinner from '../../../components/UI/Spinner/Spinner';
class ContactData extends Component{
    state={
        name:'',
        email:'',
        address:{
            street:'',
            postalCode:''
        }
    }
    orderHandler = (event)=>{
        event.preventDefault();
        this.setState({loading:true});
        const order ={
            ingredients:this.props.ingredients,
            price:this.props.price,
            customer:{
                name:'Vishu Saxena',
                address:{
                    street:'Street -1 New Bay',
                    zipcode:'564646',
                    country:'INDIA'
                },
            email:'vishu@gmail.com',
            deliveryMethod:'fastest'
            }
        };
        console.log(order);
        axios.post('/orders.json',order)
        .then(response=>{
            console.log(response);
            this.setState({loading:false});
            this.props.history.push('/');
        })
        .catch(err=>{
            this.setState({loading:false});
            console.log(err);
        });  
    }
    render(){
        let form = (
        <form>
            <input type="text" className={classes.Input} name="name" placeholder="Your Name"/>
            <input type="email" className={classes.Input} name="email" placeholder="Email"/>
            <input type="text" className={classes.Input} name="street" placeholder="Street"/>
            <input type="text" className={classes.Input} name="postal" placeholder="Postal Code"/>
            <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
        </form>
        );
        if(this.state.loading){
            form =<Spinner />
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    };
}   

export default ContactData;