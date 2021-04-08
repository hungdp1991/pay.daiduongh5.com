import sliderActionTypes from "../actionTypes/slider.actiontypes"; 
import CommonConfig from "../config/CommonConfig";
var initialState = [
];

var sliderReducer = (state = initialState, action) => {
    switch(action.type){
        case sliderActionTypes.GET_ALL:{
            if(action.result.data.data.length > 0){
                let data = JSON.parse(action.result.data.data[0].items);
                let newSlider = [];
                for(var i = 0; i < data.length; i++)
                {
                    newSlider.push({
                        title: data[i].imageTitle ,
                        link: data[i].imageRedirect ,
                        image: CommonConfig.assetDomain + data[i].imagePath ,
                        description: data[i].imageDescription ,
                    });
                }
                state = newSlider
            }
            
            return state;
        }
            
        default: {
            return [...state];
        }
    }
}

export default sliderReducer;