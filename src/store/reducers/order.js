import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';

const initialState = {
    orders:[],
    loading:false,
    purchased:false
};

const purchaseInit = (state,action) =>{
    return updateObject(state,{purchased:false});
}
const puchaseBurgerStart = (state,action) =>{
    return updateObject(state,{loading:true});
}
const purchaseBurgerSuccess = (state,action) =>{
    return {
        ...state,
        loading:false,
        purchased:true,
        orders:[...state.orders,{...action.orderData,id:action.orderId}]
    };
}
const purchaseBurgerFail = (state,action) =>{
    return {
        ...state,
        loading:false
    };
}
const fetchOrderSuccess = (state,action) =>{
    return {
        ...state,
        orders:action.orders,
        loading:false
    };
}
const fetchOrderFail = (state,action) =>{
    return {
        ...state,
        loading:false 
    };
}
const fetchOrderStart = (state,action) =>{
    return{
        ...state,
        loading:true
    };
};

 const reducer = (state = initialState,action) =>{
    switch(action.type){
        case actionTypes.PURCHASE_BURGER_START:
            return puchaseBurgerStart(state,action);
        case actionTypes.PURCHASE_BURGER_SUCCESS:
            return purchaseBurgerSuccess(state,action);
        case actionTypes.PURCHASE_BURGER_FAIL:
            return purchaseBurgerFail(state,action);
        case actionTypes.PURCHASE_INIT:
            return purchaseInit(state,action);
        case actionTypes.FETCH_ORDERS_START:
            return fetchOrderStart(state,action);
        case actionTypes.FETCH_ORDERS_SUCCESS:
           return fetchOrderSuccess(state,action);
        case actionTypes.FETCH_ORDERS_FAIL:
            return fetchOrderFail(state,action);
        default:
            return state;
    }
}

export default reducer;