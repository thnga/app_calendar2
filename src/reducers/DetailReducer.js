import ACTIONS from  '../const/Const';

const initialState = {
    detail: {}
}

export default (state = initialState, action) => {
    switch(action.type){
        case ACTIONS.ACTION_GET_DETAIL:
            return{
                detail: action.playLoad.data
            }
    }
    return state;
}