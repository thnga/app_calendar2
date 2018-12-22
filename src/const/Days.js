const NameDays = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
const Chi_Name = ['Tý', 'Sửu', 'Dần', 'Mẹo', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const Can_Name = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

// Tinh ngay Soc
function getNewMoonDay(k, timeZone) {
    // T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
    let T = k / 1236.85; // Time in Julian centuries from 1900 January 0.5
    let T2 = T * T;
    let T3 = T2 * T;
    let dr = Math.PI / 180.0;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr); // Mean new moon
    let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3; // Sun's mean anomaly
    let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3; // Moon's mean anomaly
    let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3; // Moon's argument of latitude
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    let deltat;
    if (T < -11) {
        deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    }
    else {
        deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
    };
    let JdNew = Jd1 + C1 - deltat;
    return parseInt((JdNew + 0.5 + timeZone / 24.0));
}

// Trung khi
function getSunLongitude(jdn, timeZone) {
    //double T, T2, dr, M, L0, DL, L;
    let T = (jdn - 2451545.5 - timeZone / 24) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
    let T2 = T * T;
    let dr = Math.PI / 180; // degree to radian
    let M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2; // mean anomaly, degree
    let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; // mean longitude, degree
    let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    let L = L0 + DL; // true longitude, degree
    L = L * dr;
    L = L - Math.PI * 2 * parseInt(L / (Math.PI * 2)); // Normalize to (0, 2*PI)
    return parseInt((L / Math.PI * 6));
}

// Tim ngay bat dau thang 11 am lich
function getLunarMonth11(yy, timeZone) {
    let off = jdFromDate(31, 12, yy) - 2415021;  // truoc 31/12/yy
    let k = parseInt((off / 29.530588853));
    let nm = getNewMoonDay(k, timeZone); // tim ngay soc truoc 31/12/yy
    let sunLong = getSunLongitude(nm, timeZone); // sun longitude at local midnight
    if (sunLong >= 9) // Neu thang bat dau vau ngay soc do khong co dong chi,
    {
        nm = getNewMoonDay(k - 1, timeZone); // thi lui 1 thang va tinh lai ngay soc
    }
    return nm;
}

// Xac dinh thang nhuan
function getLeapMonthOffset(a11, timeZone) {
    let k, last, arc, i;
    k = parseInt(((a11 - 2415021.076998695) / 29.530588853 + 0.5));
    last = 0;
    i = 1; // We start with the month following lunar month 11
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc != last && i < 14);
    return i - 1;
}

function jdFromDate(dd, mm, yy) {
    let a = parseInt((14 - mm) / 12);
    let y = yy + 4800 - a;
    let m = mm + 12 * a - 3;
    let jd = dd
        + parseInt(((153 * m + 2) / 5.0))
        + (365 * y)
        + parseInt(y / 4.0) - parseInt(y / 100.0) + parseInt(y / 400.0) - 32045;
    if (jd < 2299161) {
        jd = dd + parseInt((153 * m + 2) / 5.0) + 365 * y + parseInt(y / 4.0) - 32083;
    }
    return jd;
}


function getNameYear(y) {
    return getCanChi((y + 8) % 12, (y + 6) % 10);
}

function getNameDay(d) {
    return getCanChi((d + 1) % 12, (d + 9) % 10);
}

function getNameMoth(m, y) {
    return getCanChi((m + 1) % 12, (y * 12 + m + 3) % 10);
}

function getCanChi(vChi, vCan) {
    const chi = Chi_Name[vChi];
    const can = Can_Name[vCan];
    return `${can} ${chi}`;
}

// Duong lich sang Am lich
const convertSolar2Lunar = (dd, m, yy, timeZone = 7) => {
    const mm = m + 1;
    let dayNumber = jdFromDate(dd, mm, yy);
    let k = parseInt((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k, timeZone);
    }
    let a11 = getLunarMonth11(yy, timeZone);
    let b11 = a11;

    let lunarYear;
    if (a11 >= monthStart) {
        lunarYear = yy;
        a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
        lunarYear = yy + 1;
        b11 = getLunarMonth11(yy + 1, timeZone);
    }
    let lunarDay = parseInt(dayNumber - monthStart + 1);
    let diff = parseInt((monthStart - a11) / 29);
    let lunarLeap = 0;
    let lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
        let leapMonthDiff = getLeapMonthOffset(a11, timeZone);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff == leapMonthDiff) {
                lunarLeap = 1;
            }
        }
    }
    if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
        lunarYear -= 1;
    }
    const lunar = {
        day: lunarDay,
        month: lunarMonth,
        year: lunarYear,
        nameDay: getNameDay(jdFromDate(dd, mm, yy)),
        nameYear: getNameYear(lunarYear),
        nameMonth: getNameMoth(lunarMonth, lunarYear)
    }
    return lunar;
}

export { NameDays, convertSolar2Lunar }