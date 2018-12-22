import {
    combineReducers
} from 'redux';
import day from './CalendarDayReducer';
import nav from './NavReducer';
import month from './CalendarMonthReducer';
import detail from './DetailReducer';
import todolist from './TodoListReducer';
const reducer = combineReducers({
    nav,
    month,
    day,
    detail,
    todolist
})

const appReducer = (state, action) => {
    return reducer(state, action);
}

export default appReducer;