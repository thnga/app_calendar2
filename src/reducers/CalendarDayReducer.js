import ACTIONS from  '../const/Const';

const initialState = {
    weather: []
}

export default (state = initialState, action) => {
    switch(action.type){
        case ACTIONS.ACTION_GET_WEATHER:
            return{
                weather: action.playLoad.data
            }
    }
    return state;
}