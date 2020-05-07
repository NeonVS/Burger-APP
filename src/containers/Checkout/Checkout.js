import React,{Component} from 'react';
import {Route,Redirect} from 'react-router-dom';
import ContactData from './ContactData/ContactData'; 
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {connect} from 'react-redux';
class Checkout extends Component {
    // state = {
    //     ingredients:null,
    //     totalPrice:0
    // }
    checkoutCancelledHandler = () =>{
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () =>{
        this.props.history.replace('/checkout/contact-data');
    }
    // componentWillMount(){
    //     const query = new URLSearchParams(this.props.location.search);
    //     const ingredients = {};
    //     let price = 0;
    //     for(let param of query.entries()){
    //         if(param[0] === 'price'){
    //             price = param[1];
    //         }else{
    //             ingredients[param[0]] = +param[1];
    //         }
    //     }
    //     this.setState({ingredients:ingredients});
    //     this.setState({totalPrice:price});
    // }

    

    render(){
        let summary = <Redirect to="/"/>;
        let purchasedRedirect;
        if(this.props.ings){
            purchasedRedirect = this.props.purchased?<Redirect to="/" /> : null;
        }
        if(this.props.ings){
            summary=(
                <div>
                {purchasedRedirect}
                <CheckoutSummary ingredients={this.props.ings} checkoutCancelled={this.checkoutCancelledHandler} checkoutContinued={this.checkoutContinuedHandler}/>
                <Route 
                path={this.props.match.path+'/contact-data'} component={ContactData} />
                </div>
            );
        }
        return(
            summary
        );
    };
}

const mapStateToProps = state =>{
    return {
        ings:state.burgerBuilder.ingredients,
        purchased:state.order.purchased
    }
}
export default connect(mapStateToProps)(Checkout);