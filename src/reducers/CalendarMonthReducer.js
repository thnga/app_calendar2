import ACTIONS from  '../const/Const';

const initialState = {
    data: {},
}

export default (state = initialState, action) => {
    switch(action.type){
        case ACTIONS.ACTION_GET_DAYS_BY_MONTH:
            return{
                data: action.playLoad.data
            }
    }
    return state;
}