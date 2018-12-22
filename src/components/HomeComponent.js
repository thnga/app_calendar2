import React from 'react';
import { Image } from 'react-native';
import {
    createMaterialBottomTabNavigator
} from 'react-navigation-material-bottom-tabs';
import CalendarDayContainer from '../container/CalendarDayContainer';
import CalendarMonthContainer from '../container/CalendarMonthContainer';
import { icons, colors } from '../assets';
import allSchemas from '../container/allSchemas';
import TodoListComponent from './TodoListComponent';
import DetailCotainer from '../container/DetailCotainer';
import HeaderComponent from './HeaderComponent';
import PopupDialogComponent from './PopupDialogComponent';
import NoteComponent from './NoteComponent';
import Note from './Note';

const tabNavigations = createMaterialBottomTabNavigator(
    {
        Day: {
            screen: CalendarDayContainer,
            navigationOptions: {
                title: 'Lịch ngày',
                tabBarIcon: ({ tintColor, focused }) => (
                    <Image
                        tintColor={tintColor}
                        source={icons.calendarDay}
                    />
                )
            }
        },
        Month: {
            screen: CalendarMonthContainer,
            navigationOptions: {
                title: 'Lịch tháng',
                tabBarIcon: ({ tintColor, focused }) => (
                    <Image
                        tintColor={tintColor}
                        source={icons.calendarMonth}
                    />
                )
            }
        },
        TodoList: {
            screen: NoteComponent,
            navigationOptions: {
                title: 'Ghi chú',
                tabBarIcon: ({ tintColor, focused }) => (
                    <Image
                        tintColor={tintColor}
                        source={icons.calendarTodoList}
                    />
                )
            }
        }
    },
    {
        barStyle: { backgroundColor: colors.red },
        shifting: true,
    });

export default tabNavigations;