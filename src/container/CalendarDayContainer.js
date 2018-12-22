import { connect } from 'react-redux';
import CalendarDayComponent from '../components/CalendarDayComponent';
import ACTIONS from '../const/Const';
import Moment from 'moment';

const mapStateToProps = (state) => ({
    weather: state.day.weather
});
// lấy thời tiết của 5 ngày liên tiếp
const getWeather = () => (dispatch) => {
    const url = "http://api.openweathermap.org/data/2.5/forecast?q=H%C3%A0%20n%E1%BB%99i&mode=json&appid=6f259ae2c9809ee1760a5e7b9bf9d17f&lang=vi&units=metric";
    fetch(url)
        .then((resp) => resp.json())
        .then((json) => {
            if (json.cod !== "200") return;
            const playLoad = {
                data: json.list
            };
            dispatch({
                type: ACTIONS.ACTION_GET_WEATHER,
                playLoad
            })
        });
}

const getWeatherOfDay = (weather, date) => () => {
    // lấy thời gian muốn xem
    const time = Moment(date).format('YYYY-MM-DD HH:mm:ss');
    if (time.substring(0, 10) < weather[0].dt_txt.substring(0, 10)) {
        return null;
    }
    if (time < weather[0].dt_txt) {
        return weather[0];
    }
    // lấy thời tiết theo ngày và giờ
    for (let i = 0; i < weather.length - 1; i++) {
        if (weather[i].dt_txt <= time && weather[i + 1].dt_txt >= time) {
            return weather[i];
        }
    }
    return null;
}

export default connect(mapStateToProps, { getWeather, getWeatherOfDay })(CalendarDayComponent);