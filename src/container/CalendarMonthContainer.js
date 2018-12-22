import { connect } from 'react-redux';
import CalendarMonthComponent from '../components/CalendarMonthComponent';
import ACTIONS from '../const/Const';
const mapStateToProps = (state) => ({
    data: state.month.data
});

calculatorDay = (month, year) => (dispatch) => {
    const d = new Date();
    // lay ngay hien tai
    const currentDay = `${d.getDate()}${d.getMonth()}${d.getFullYear()}`;
    const days = [];
    // lấy số ngày của tháng
    const numberOfDay = new Date(year, month + 1, 0).getDate();
    // số ngày của tháng trước
    const numberOfDayPrev = new Date(year, month, 0).getDate();
    // lay thu dau tien cua tháng
    const startDay = new Date(year, month, 1).getDay();
    // đổ dữ liệu của tháng trước
    for (let i = 0; i < startDay;  i++){
        days.push({
            day: numberOfDayPrev - startDay + 1 + i,
            month,
            year,
            enable: false,
            current: false
        });
    }
    // đồ dữ liệu của tháng đang xem
    for (let i = 1; i <= numberOfDay;  i++){
        const d = `${i}${month}${year}`;
        days.push({
            day: i,
            month,
            year,
            enable: true,
            current: currentDay === d
        });
    }
    // dữ liệu của tháng tiếp theo
    let count = days.length % 7;
    if(count > 0){
        count = (days.length / 7 + 1).toFixed(0) * 7 - days.length;
        for (let i = 1; i <= count;  i++){
            days.push({
                day: i,
                month,
                year,
                enable: false,
                current: false
            });
        }
    }
    const listDay = [];
    let items = [];
    for (let i = 1; i <= days.length;  i++){
        items.push(days[i-1]);
        if (i % 7 === 0 || i === days.length) {
            listDay.push(items)
            items = [];
        }
    }
    const playLoad = {
        data: {
            month,
            year,
            listDay
        }
    };
    // bắn dữ liệu về cho component
    dispatch({
        type: ACTIONS.ACTION_GET_DAYS_BY_MONTH,
        playLoad
    })
}

export default connect(mapStateToProps, {calculatorDay})(CalendarMonthComponent);