import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image
} from 'react-native';
import { icons } from '../assets';
import BaseComponents from './base/BaseComponents';

export default class CalendarMonthComponent extends BaseComponents {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
        }
    }

    componentDidMount() {
        const date = new Date();
        this.props.calculatorDay(date.getMonth(), date.getFullYear());
    }

    componentWillReceiveProps(nextProp) {
        this.setState({
            data: nextProp.data
        })
    }

    render() {
        return (
            <View>
                <this.renderHeader />
                <this.renderTitle />
                <this.renderCalendar />
            </View>
        );
    }

    renderHeader = () => {
        return (
            <View style={[styles.viewTitle, styles.header]}>
                <TouchableOpacity
                    onPress={() => this.getNextMonth(-1)}
                >
                    <Image
                        source={icons.back}
                    />
                </TouchableOpacity>
                <Text style={styles.textHeader}>
                    {`${this.state.data.month + 1}/${this.state.data.year}`}
                </Text>
                <TouchableOpacity
                    onPress={() => this.getNextMonth(1)}
                >
                    <Image
                        source={icons.next}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    getNextMonth = (increate) => {
        let { year, month } = this.state.data;
        month = month + increate;
        if (month >= 12){
            month = 0;
            year = year + 1;
        }else if (month < 0) {
            year = year - 1;
            month = 11;
        }
        console.log(month, year);
        
        this.props.calculatorDay(month, year);
    }

    renderTitle = () => {
        return (
            <View style={styles.viewTitle}>
                {this.renderTitleCol('SUN', styles.viewColSpecial)}
                {this.renderTitleCol('MON')}
                {this.renderTitleCol('TUE')}
                {this.renderTitleCol('WED')}
                {this.renderTitleCol('THU')}
                {this.renderTitleCol('FRI')}
                {this.renderTitleCol('SAT')}
            </View>
        );
    }

    renderTitleCol = (title, style = {}) => {
        return (
            <Text style={[styles.viewCol, style]}>
                {title}
            </Text>
        );
    }

    renderCalendar = () => {
        return (
            <View>
                <FlatList
                    data={this.state.data.listDay}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={styles.viewTitle}>
                {this.renderDay(item[0], styles.viewColSpecial)}
                {this.renderDay(item[1])}
                {this.renderDay(item[2])}
                {this.renderDay(item[3])}
                {this.renderDay(item[4])}
                {this.renderDay(item[5])}
                {this.renderDay(item[6])}
            </View>
        );
    }

    renderDay = (day, style = {}) => {
        let viewDisable = {}
        if (!day.enable) {
            viewDisable = styles.viewDisable
        }
        let current = {
            flex: 1
        };
        if (day.current) {
            current = styles.currentDay
        }
        return (
            <TouchableOpacity
                disabled={!day.enable}
                style={current}
            >
                <Text
                    style={[styles.viewCol, style, viewDisable]}
                >
                    {day.day}
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    viewTitle: {
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    viewCol: {
        paddingTop: 15,
        paddingBottom: 15,
        flex: 1,
        textAlign: 'center',
        width: '100%',
        color: 'black',
    },
    viewColSpecial: {
        color: 'red',
    },
    viewDisable: {
        color: '#ccc'
    },
    currentDay: {
        flex: 1,
        backgroundColor: '#ccc'
    },
    textHeader: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    header: {
        padding: 30
    }
});