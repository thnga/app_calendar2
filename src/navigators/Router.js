import { createStackNavigator } from 'react-navigation';
import DetailCotainer from '../container/DetailCotainer';
import HomeComponent from '../components/HomeComponent';
const appNavigations = createStackNavigator({
    Home: {
        screen: HomeComponent,
        navigationOptions: {
            header: null
        }
    },
    Detail: {
        screen: DetailCotainer
    }
});
export default appNavigations;