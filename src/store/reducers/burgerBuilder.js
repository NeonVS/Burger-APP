import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/rutility';

const INGREDIENT_PRICES={
    salad:10,
    cheese:15,
    meat:25,
    bacon:18
};

const initialState={
    ingredients:null,
    totalPrice:40,
    error:false,
    building:false
};

const addIngredient = (state,action) =>{
    const updatedIngredient = {[action.ingredientName]:state.ingredients[action.ingredientName]+1};
            const updatedIngredients = updateObject(state.ingredients,updatedIngredient);
            const updatedState = {
                ingredients:updatedIngredients,
                totalPrice:state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
                building:true
            }
            return updateObject(state,updatedState);
}
const removeIngredient = (state,action) =>{
    return {
        ...state,
        ingredients:{
            ...state.ingredients,
            [action.ingredientName]:state.ingredients[action.ingredientName]-1
        },
        totalPrice:state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
        building:true
    };
}
const setIngredient = (state,action) =>{
    return updateObject (state,{
        ingredients:{
            salad:action.ingredients.salad,
            bacon:action.ingredients.bacon,
            cheese:action.ingredients.cheese,
            meat:action.ingredients.meat,
        },
        totalPrice:40,
        error:false,
        building:false
    });
}
const fetchIngredientFailed = (state,action) =>{
    return updateObject(state,{error:true});
}

const reducer = (state=initialState,action) =>{
    switch(action.type){
        case actionTypes.ADD_INGREDIENT:
            return addIngredient(state,action);
        case actionTypes.REMOVE_INGREDIENT:
            return removeIngredient(state,action);
        case actionTypes.SET_INGREDIENTS:
            return setIngredient(state,action);
        case actionTypes.FETCH_INGREDIENTS_FAILED:
            return fetchIngredientFailed(state,action);
        default:
            return state;
    }
};

export default reducer