import React,{ Component } from "react";
import Aux from '../../hoc/Auxillary/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../../src/axios-order';
import Spinner from '../../components/UI/Spinner/Spinner'; 
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
//import * as actionTypes from '../../store/actions/actionsTypes';
import * as burgerBuilderActions from '../../store/actions/index';

class BurgerBuilder extends Component{
    state={
        purchasing:false,
        loading:false,
        error:false
    };
    componentDidMount(){
        this.props.onInitIngredients();
    }

    updatePurchaseState(ingredients){
        const sum =Object.keys(ingredients)
        .map(igKey =>{
            return ingredients[igKey];
        }).reduce((sum,el)=>{
            return sum+el;
        },0);
        return sum>0;
    }

    // addIngredientHandler = (type)=>{
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice+priceAddition;
    //     this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients);
    // }

    // removeIngredientHandler = (type)=>{
    //     const oldCount = this.state.ingredients[type];
    //     if(oldCount <= 0){
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice-priceDeduction;
    //     this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients);
    // }
    purchaseHandler=()=>{
        if(this.props.isAuthenticated){
            this.setState({purchasing:true});
        }else{
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }
    purchaseCancelHandler=()=>{
        this.setState({purchasing:false});
    }
    purchaseContinueHandler = () =>{
        //alert('You continue!');
        // this.setState({loading:true});
        // const order ={
        //     ingredients:this.state.ingredients,
        //     price:this.state.totalPrice,
        //     customer:{
        //         name:'Vishu Saxena',
        //         address:{
        //             street:'Street -1 New Bay',
        //             zipcode:'564646',
        //             country:'INDIA'
        //         },
        //     email:'vishu@gmail.com',
        //     deliveryMethod:'fastest'
        //     }
        // }
        // axios.post('/orders.json',order)
        // .then(response=>{
        //     console.log(response);
        //     this.setState({loading:false,purchasing:false});
        // })
        // .catch(err=>{
        //     this.setState({loading:false,purchasing:false});
        //     console.log(err);
        // });  
        // const queryParams =[];
        // for(let i in this.state.ingredients){
        //     queryParams.push(encodeURIComponent(i)+'='+encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price='+this.props.price);
        // const queryString = queryParams.join('&');
        // this.props.history.push({
        //     pathname:'/checkout',
        //     search:'?'+queryString
        // });
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }
    render(){
        const disabledInfo = {
            ...this.props.ings
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0;
        }
        let Ordersummary = null;
        let burger =this.props.error?<p>Ingredients can't be loaded!</p>:<Spinner />;
        if(this.props.ings){
            burger =(<Aux>
                <Burger ingredients={this.props.ings}/>
                <BuildControls 
                ingredientAdded={this.props.onIngredientAdded}
                ingredientRemoved={this.props.onIngredientRemoved}
                disabled={disabledInfo}
                purchaseable={this.updatePurchaseState(this.props.ings)}
                ordered={this.purchaseHandler}
                isAuth={this.props.isAuthenticated}
                price={this.props.price}/>
            </Aux>
            );
            Ordersummary = (<OrderSummary ingredients={this.props.ings} price={this.props.price} purchaseCancelled={this.purchaseCancelHandler}purchaseContinued={this.purchaseContinueHandler}/>
            );
        }

        return (
            <Aux>
                <Modal 
                show={this.state.purchasing}
                modalClosed={this.purchaseCancelHandler}>
                    {Ordersummary}
                </Modal>
                {burger}    
            </Aux>
        );
    }
}

const mapStateToProps = state =>{
    return {
        ings:state.burgerBuilder.ingredients,
        price:state.burgerBuilder.totalPrice, 
        error:state.burgerBuilder.error,
        isAuthenticated:state.auth.token !== null,
        
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        onIngredientAdded:(ingName) =>dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved:(ingName) =>dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients:() =>dispatch(burgerBuilderActions.initIngredients()),
        onInitPurchase:()=>dispatch(burgerBuilderActions.purchaseInit()),
        onSetAuthRedirectPath:(path)=>dispatch(burgerBuilderActions.setAuthRedirectPath(path))
    }
}


export  default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));