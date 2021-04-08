import paymentActionTypes from "../actionTypes/payment.actiontypes"; 
var initialState = {
    userRole: {},
    chargeCard: {},
    chargeAtm: {},
    chargeAtmSuccess: {},
}

var paymentReducer = (state = initialState, action) => {
    switch(action.type){
        case paymentActionTypes.CHARGE_CARD:{
            state.chargeCard = action.result.data
            return state;
        }
        case paymentActionTypes.CHARGE_ATM:{
            state.chargeAtm = action.result.data
            return state;
        }
        case paymentActionTypes.GET_USER_ROLE:{
            state.userRole = action.result.data
            return state;
        }
        case paymentActionTypes.CHARGE_ATM_SUCCESS:{
            state.chargeAtmSuccess = action.result
            return state;
        }
        default: {
            return state;
        }
    }
}

export default paymentReducer;