// import loginActionTypes from '../actionTypes/login.actiontypes';
// import Api from '.././utils/Api';
// import ApiConfig from '../config/ApiConfig';
// import isLoading from "./isloading.actions";

const cardsAction = {};

cardsAction.getAll = (result) => {
    return {
        type: "CARDS.GET_ALL",
        result
    }
}

export default cardsAction;