import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    BackHandler
} from 'react-native';
import { colors } from '../assets/index';
import BaseComponent from './base/BaseComponents';

export default class DetailComponent extends BaseComponent {

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
        headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
    });

    constructor(props) {
        super(props);
        this.state = {
            detail: {}
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.detail) {
            this.setState({
                detail: nextProps.detail
            });
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        const date = this.props.navigation.getParam('date', new Date());
        this.props.loadDetail(date.getDate(), date.getMonth(), date.getFullYear());
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }
    
    onBackPress = () => {
        const { navigation } = this.props;
        navigation.goBack();
        return true;
    };

    renderGio = (arr) => {
        const views = [];
        arr.forEach(item => {
            views.push(
                <Text key={item.hour} style={styles.textContent}>
                    {item.hour}
                </Text>
            );
        });
        return views;
    }

    render() {
        const { detail = {} } = this.state;
        const { gioHoangDao = [], gioHacDao = [] } = detail
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.textTitle}>
                        Bát tự:
                </Text>
                    <Text style={styles.textContent}>
                        {detail.batTu}
                    </Text>
                    <Text style={styles.textTitle}>
                        Giờ hoàng đạo:
                </Text>
                    {this.renderGio(gioHoangDao)}
                    <Text style={styles.textTitle}>
                        Giờ hắc đạo:
                </Text>
                    {this.renderGio(gioHacDao)}
                    <Text style={styles.textTitle}>
                        Nên làm:
                </Text>
                    <Text style={styles.textContent}>
                        {detail.nenLam}
                    </Text>
                    <Text style={styles.textTitle}>
                        Không nên:
                </Text>
                    <Text style={styles.textContent}>
                        {detail.khongNen}
                    </Text>
                    <Text style={styles.textTitle}>
                        Ghi chú:
                </Text>
                    <Text style={styles.textContent}>
                        {detail.ghiChu}
                    </Text>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    textTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.red,
        marginTop: 10,
    },
    textContent: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5
    }
});