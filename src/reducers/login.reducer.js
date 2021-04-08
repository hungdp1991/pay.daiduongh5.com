import loginActionTypes from '../actionTypes/login.actiontypes';
import {REHYDRATE} from 'redux-persist/lib/constants';
// let initialState = {
//     isLogged : localStorage.getItem('user') ? true : false,
//     data: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {"id": null,"username": null,"email": null,"fullname": null,"birthday": null,"sex": null,"identityNumber": null,"mobile": null,"address": null,"city": null,"company": null,"companyAddress": null,"createDate": null,"fastReg": null,"lastLogin": null,"identityDate": null,"identityPlace": null,"ip": null,"status": null},
//     error: null
// }

let initialState = {
    isLogged: false,
    data: {},
    error:null
}

const loginReducer = (state = initialState, action) => {
    switch(action.type){
        case loginActionTypes.LOGIN_RESQUEST: {
            return {
                ...state
            };
        }
        case loginActionTypes.LOGIN_SUCCESS:{
            //localStorage.setItem("user", JSON.stringify(action.result.data));
            state.data = action.result.data.data;
            state.isLogged = true;
            return {
                ...state,
                error: null
            };
        }
        case loginActionTypes.LOGIN_FAILURE:{
            state.isLogged = false;
            state.error = action.result.data
            return {
                ...state
            };
        }
        case loginActionTypes.LOGOUT:{
            // localStorage.removeItem("user");
            localStorage.removeItem("persist:data");
            state.data = null;
            state.error = null;
            state.isLogged = false;
            return {
                ...state
            };
        }
        case REHYDRATE: {
            // var incoming = action.payload.loginReducer
            if (action.payload) {
                var incoming = action.payload.loginReducer
                if (incoming) return {...state, ...incoming}
            }

            return state
        }
        default: return {
            ...state
        }
    }

}

export default loginReducer;