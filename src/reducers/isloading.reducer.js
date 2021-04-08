import isLoadingActionType from '../actionTypes/isloading.actiontypes';

let initialState = {
  isLoading: false
};

const isLoadingReducer = (state = initialState, action) => {
    switch (action.type) {
        case isLoadingActionType.SHOW_LOADING:{
            return {
                isLoading: true
            };
        }
        // hide loader
        case isLoadingActionType.HIDE_LOADING:{
            return {
                isLoading: false
            };
        }
        default:{
            return state;
        }
            
    }
}

export default isLoadingReducer;