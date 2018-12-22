import DetailComponet from '../components/DetailComponent';
import { connect } from 'react-redux';
const mapStateToProps = (state) => ({
    detail: state.detail.detail
});

const parseIso = ['À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ'];

const loadDetail = (d, m, y) => (dispatch) => {
    const url = `http://tracuu.tuvisomenh.com/tool/xemlichvn?dd=${d}&mm=${m}&yy=${y}`;
    fetch(url)
        .then((resp) => {
            const data = parseData(resp._bodyText);
            const playLoad = {
                data
            };
            dispatch({
                type: ACTIONS.ACTION_GET_DETAIL,
                playLoad
            })
        })
}

const parseIsoToUtf8 = (value) => {
    let v = value;
    for (let i = 0; i < parseIso.length; i++) {
        const iso = `&#${i + 192};`
        while(v.indexOf(iso) != -1){
            v = v.replace(iso, parseIso[i]);
        }
    }
    return v;
}

parseData = (value) => {
    try {
        let html = value;
        let index = html.indexOf('clearfix t-lunar ky-thu ky-thu-2');
        let text = html.substring(0, index);
        html = html.replace(text, '');
        text = '<p><span>Bát tự:</span>';
        index = html.indexOf(text);
        html = html.substring(index + text.length);
        index = html.indexOf('</p>');
        const batTu = parseIsoToUtf8(html.substring(0, index));
        text = '<p class="t-lunar-subtitle">Giờ hoàng đạo</p>';
        index = html.indexOf(text) + text.length;
        html = html.substring(index);
        index = html.indexOf('</table>');
        const gioHoangDao = parseGio(html.substring(0, index));
        text = '<p class="t-lunar-subtitle">Giờ hắc đạo</p>';
        index = html.indexOf(text) + text.length;
        html = html.substring(index);
        index = html.indexOf('</table>');
        const gioHacDao = parseGio(html.substring(0, index));
        text = '<p class="t-lunar-subtitle">Nhị thập bát tú</p>';
        index = html.indexOf(text) + text.length;
        html = html.substring(index);
        text = '<td style="width: 30%;">';
        index = html.indexOf(text) + text.length;
        const nenLam = parseIsoToUtf8(html.substring(index, html.indexOf('</td>', index)));
        index = html.indexOf(text, index) + text.length;
        const khongNen = parseIsoToUtf8(html.substring(index, html.indexOf('</td>', index)));
        text = '<td style="width: 40%;">';
        index = html.indexOf(text) + text.length;
        const ghiChu = parseIsoToUtf8(html.substring(index, html.indexOf('</td>', index)));
        return {
            batTu,
            gioHoangDao,
            gioHacDao,
            nenLam,
            khongNen,
            ghiChu
        };
    } catch (error) {
        console.log('parseData', error);
    }
    return null;
}

parseGio = (value) => {
    const text = '<td>';
    let index = value.indexOf('<td>');
    let indexnEnd = value.indexOf('</td>', index)
    const arr = [];
    while (index != -1 && indexnEnd != -1) {
        const hour = value.substring(index + text.length, indexnEnd);
        arr.push({
            hour: parseIsoToUtf8(hour)
        });
        index = value.indexOf('<td>', indexnEnd);
        indexnEnd = value.indexOf('</td>', index)
    }
    return arr;
}

export default connect(mapStateToProps, {
    loadDetail
})(DetailComponet);