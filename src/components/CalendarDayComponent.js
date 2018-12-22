import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import BaseComponents from './base/BaseComponents';
import {
    NameDays,
    convertSolar2Lunar
} from '../const/Days';
import {
    icons,
    colors
} from '../assets'
import Route from '../const/Route';
import Moment from 'moment';

console.disableYellowBox = true;
export default class CalendarDayComponent extends BaseComponents {

    constructor(props) {
        super(props);
        const currentDate = new Date()
        this.state = {
            date: currentDate,
            solarDate: convertSolar2Lunar(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear()),
            weather: {}
        }
    }

    componentDidMount() {
        this.props.getWeather();
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.weather) {
            const w = this.props.getWeatherOfDay(nextProps.weather, this.state.date);
            this.setState({
                weather: w
            })
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <this.renderHeaderView />
                <this.renderMainView />
                <this.renderBottomView />
            </View>
        );
    }

    toDayPress = () => {
        // ngay hiện tại
        const currentDate = new Date()
        // lấy thông tin thời tiết
        const w = this.props.getWeatherOfDay(this.props.weather, currentDate);
        this.setState({
            date: currentDate,
            // tính lịch âm
            solarDate: convertSolar2Lunar(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear()),
            weather: w
        });
    }

    detailPress = () => {
        this.props.navigation.navigate(Route.Detail, { date: this.state.date, title: Moment(this.state.date).format('[Ngày] DD [Tháng] MM [Năm] YYYY')});
    }

    renderHeaderView = () => {
        return (
            <View style={styles.containerHeader}>
                <TouchableOpacity
                    onPress={() => this.toDayPress()}
                >
                    <Text style={styles.headerButton}>
                        Hôm nay
                    </Text>
                </TouchableOpacity>
                <View style={styles.containerTitleHeader}>
                    <TouchableOpacity
                        onPress={() => this.getNextDay(-1)}
                    >
                        <Image
                            source={icons.back}
                            tintColor='white'
                        />
                    </TouchableOpacity>
                    <Text style={styles.textHeader}>
                        {`${this.state.date.getMonth() + 1}/${this.state.date.getFullYear()}`}
                    </Text>
                    <TouchableOpacity
                        onPress={() => this.getNextDay(1)}
                    >
                        <Image
                            source={icons.next}
                            tintColor='white'
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => this.detailPress()}
                >
                    <Text style={styles.headerButton}>
                        Chi tiết
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    getNextDay = (increate) => {
        const date = this.state.date;
        date.setDate(date.getDate() + increate);
        this.setState({
            date: date,
            solarDate: convertSolar2Lunar(date.getDate(), date.getMonth(), date.getFullYear())
        }, () => {
            const w = this.props.getWeatherOfDay(this.props.weather, this.state.date);
            this.setState({
                weather: w
            })
        });
    }

    renderMainView = () => {
        return (
            <View style={styles.containerMain}>
                <Image
                    style={{
                        flex: 1,
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                    }}
                    resizeMode='stretch'
                    source={this.getBackground()}
                />
                <Text style={styles.textDay}>
                    {this.state.date.getDate()}
                </Text>
                <Text style={styles.textNameDay}>
                    {NameDays[this.state.date.getDay()]}
                </Text>
                <this.renderWeatherView />
            </View>
        );
    }

    getBackground = () => {
        if (this.state.weather === null) return null;
        const { weather = [] } = this.state.weather;
        let status = {};
        if (weather.length > 0) {
            status = weather[0];
        }
        switch (status.main) {
            case 'Clear':
                return icons.nang;
            case 'Clouds':
            case 'Atmosphere':
            case 'Snow':
                return icons.may;
            case 'Rain':
            case 'Drizzle':
                return icons.mua;
            default:
                return icons.amu;
        }
    }

    renderWeatherView = () => {
        if (this.state.weather === null) return null;
        const { main = {}, weather = [] } = this.state.weather;
        let status = {};
        if (weather.length > 0) {
            status = weather[0];
        }

        return (
            <View style={{ alignItems: 'center' }}>
                <Image
                    style={{ width: 50, height: 50 }}
                    source={{ uri: `http://openweathermap.org/img/w/${status.icon}.png` }}
                />
                <Text style={styles.textWeather}>
                    {parseFloat(main.temp).toFixed(0)} °C
                </Text>
                <Text>
                    {status.description}
                </Text>
            </View>
        );
    }

    renderBottomView = () => {
        return (
            <View style={styles.containerBottom}>
                <View style={styles.bottomCol}>
                    <Text style={styles.textTitle}>Ngày</Text>
                    <Text>{this.state.solarDate.nameDay}</Text>
                </View>
                <View style={[styles.bottomCol, styles.backgroundCricle]}>
                    <Text style={styles.textSolarDay}>
                        {this.state.solarDate.day}
                    </Text>
                    <View style={styles.line} />
                    <Text style={styles.textSolarMonth}>
                        {this.state.solarDate.month}
                    </Text>
                </View>
                <View style={styles.bottomCol}>
                    <Text style={styles.textTitle}>Tháng</Text>
                    <Text>{this.state.solarDate.nameMonth}</Text>
                    <Text style={[styles.textTitle, { marginTop: 20 }]}>Năm</Text>
                    <Text>{this.state.solarDate.nameYear}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerButton: {
        backgroundColor: '#C51162',
        borderColor: '#fff',
        borderWidth: 0.5,
        borderRadius: 50,
        color: '#fff',
        padding: 10
    },
    line: {
        height: 2,
        width: 50,
        backgroundColor: colors.red
    },
    textTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.red
    },
    textSolarDay: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.blue,
    },
    textSolarMonth: {
        fontSize: 30,
        color: colors.red
    },
    backgroundCricle: {
        borderRadius: 1000,
        backgroundColor: '#fff'
    },
    containerHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.red,
        paddingLeft: 10,
        paddingRight: 10,
    },
    containerTitleHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        color: colors.red,
    },
    textHeader: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'white'
    },
    containerMain: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerBottom: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: '#EEEEEE',
        padding: 20
    },
    bottomCol: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textDay: {
        fontWeight: 'bold',
        fontSize: 150,
        //textShadowColor:'#585858',
        //textShadowOffset:{width: 2, height: 2},
        //textShadowRadius:10,
        color: colors.blue,
    },
    textNameDay: {
        fontWeight: 'bold',
        fontSize: 20
    },
    textWeather: {
        fontWeight: 'bold',
        fontSize: 20,
        color: colors.red
    }
});