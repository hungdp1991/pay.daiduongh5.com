import postActionTypes from "../actionTypes/post.actiontypes"; 

var initialState = {
    listPost: {},
    detailPost: null,
    errors: null
}
;

var postReducer = (state = initialState, action) => {
    
    switch(action.type){
        case postActionTypes.GET_ALL_POST:{
            state.listPost = action.result.data.data;
            return state;
        }
        case postActionTypes.GET_DETAIL_POST:{
            state.detailPost = action.result.data.data[0];
            return {...state};

        }
        default:{
            return state;
        }
    }
}

export default postReducer;