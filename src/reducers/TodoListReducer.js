import ACTIONS from  '../const/Const';

const initialState = {
    todolist: {}
}

export default (state = initialState, action) => {
    switch(action.type){
        case ACTIONS.ACTION_GET_TODOLIST:
            return{
                todolist: action.playLoad.data
            }
    }
    return state;
}