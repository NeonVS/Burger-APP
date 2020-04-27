import React,{ Component } from "react";
import Aux from '../../hoc/Auxillary/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../../src/axios-order';
import Spinner from '../../components/UI/Spinner/Spinner'; 
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES={
    salad:10,
    cheese:15,
    meat:25,
    bacon:18
};
class BurgerBuilder extends Component{
    state={
        ingredients:null,
        totalPrice: 50,
        purchaseable:false,
        purchasing:false,
        loading:false,
        error:false
    };
    componentDidMount(){
        axios.get('https://burger-app-6c70b.firebaseio.com/ingredients.json').then(response => {
            this.setState({ingredients:response.data})
        }).catch(err=>{
            console.log(err);
            this.setState({error:true});
        });
    }

    updatePurchaseState(ingredients){
        const sum =Object.keys(ingredients)
        .map(igKey =>{
            return ingredients[igKey];
        }).reduce((sum,el)=>{
            return sum+el;
        },0);
        console.log(sum>0);
        this.setState({purchaseable:sum>0});
    }

    addIngredientHandler = (type)=>{
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice+priceAddition;
        this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type)=>{
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice-priceDeduction;
        this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }
    purchaseHandler=()=>{
        this.setState({purchasing:true});
    }
    purchaseCancelHandler=()=>{
        this.setState({purchasing:false});
    }
    purchaseContinueHandler = () =>{
        //alert('You continue!');
        this.setState({loading:true});
        const order ={
            ingredients:this.state.ingredients,
            price:this.state.totalPrice,
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
        }
        axios.post('/orders.json',order)
        .then(response=>{
            console.log(response);
            this.setState({loading:false,purchasing:false});
        })
        .catch(err=>{
            this.setState({loading:false,purchasing:false});
            console.log(err);
        });
    }
    render(){
        
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0;
        }
        let Ordersummary = null;
        let burger =this.state.error?<p>Ingredients can't be loaded!</p>:<Spinner />;
        if(this.state.ingredients){
            burger =(<Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler}
                disabled={disabledInfo}
                purchaseable={this.state.purchaseable}
                ordered={this.purchaseHandler}
                price={this.state.totalPrice}/>
            </Aux>
            );
            Ordersummary = (<OrderSummary ingredients={this.state.ingredients} price={this.state.totalPrice} purchaseCancelled={this.purchaseCancelHandler}purchaseContinued={this.purchaseContinueHandler}/>
            );
        }
        if(this.state.loading){
            Ordersummary = <Spinner />;
        }
        console.log("Burger Builder");
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
export  default withErrorHandler(BurgerBuilder,axios);