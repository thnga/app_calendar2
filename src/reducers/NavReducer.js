import Router from '../navigators/Router';
import Route from '../const/Route';

const firstAction = Router.router.getActionForPathAndParams(Route.Home);
const initialNavState = Router.router.getStateForAction(firstAction);

export default (state = initialNavState, action) => {
  const nextState = Router.router.getStateForAction(action, state);;
  return nextState || state;
};
