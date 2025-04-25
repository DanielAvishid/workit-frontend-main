export const utilService = {
    makeId,
    saveToStorage,
    loadFromStorage,
    getDateToShow,
    formatDateFromTimestamp,
    getTimePassed,
    calculateDaysDifference,
    getRandomLabelColor,
    isEmailValid,
    darkenColor,
    getHexColor,
    getHeroBtnBg,
    getHeroIcons,
    getLogos,
    capitalizeFirstLetter,
    getEmptyUserCredentials
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}


function getDateToShow(timeStamps = []) {
    if (!timeStamps || timeStamps.length === 0) {
        return ''
    }

    const currentDate = new Date()
    const date1 = new Date(timeStamps[0])
    const date2 = new Date(timeStamps[1])

    const formatDateDay = (date) => {
        const day = date.getDate()
        return day
    }

    const totalDays = (date2 - date1) / (1000 * 60 * 60 * 24);
    const daysPassed = (currentDate - date1) / (1000 * 60 * 60 * 24);
    let percentage = ((daysPassed / totalDays) * 100).toFixed(0);

    const formatDateMonth = (date) => {
        const month = date.toLocaleString('en-US', { month: 'short' })
        return month
    }

    if (date1.getFullYear() === currentDate.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        formatDateDay(date1) === formatDateDay(date2)) {
        percentage = (currentDate > date2) ? 100 : 0
        return { text: `${formatDateDay(date1)} ${formatDateMonth(date1)}`, percentage }
    }

    if (date1.getFullYear() === currentDate.getFullYear() && date1.getMonth() === date2.getMonth()) {
        return { text: `${formatDateDay(date1)} - ${formatDateDay(date2)} ${formatDateMonth(date2)}`, percentage }
    }

    if (date1.getFullYear() === date2.getFullYear()) {
        return { text: `${formatDateDay(date1)} ${formatDateMonth(date1)} - ${formatDateDay(date2)} ${formatDateMonth(date2)}`, percentage }
    }

    const getShortYear = (date) => {
        const year = date.getFullYear().toString().slice(-2);
        return year;
    };

    const year1 = getShortYear(date1)
    const year2 = getShortYear(date2)

    return { text: `${formatDateMonth(date1)} ${formatDateDay(date1)}, '${year1} - ${formatDateMonth(date2)} ${formatDateDay(date2)}, '${year2}`, percentage }
}

function formatDateFromTimestamp(timestamp, full = false) {
    if (!timestamp) {
        return '';
    }

    const date = new Date(timestamp);
    const currentDate = new Date();
    const isCurrentYear = date.getFullYear() === currentDate.getFullYear();

    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: isCurrentYear && !full ? undefined : 'numeric'
    });
}

function getTimePassed(timestamp) {
    const now = new Date().getTime();
    const timeDifference = now - timestamp;
    if (timeDifference < 0) return "Invalid timestamp";

    const minutes = Math.floor(timeDifference / 60 / 1000);
    const hours = Math.floor(minutes / 60);
    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;

    const date = new Date(timestamp);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;

}

function calculateDaysDifference(timeStamps) {
    const [minDate, maxDate] = timeStamps;
    return Math.floor((new Date(maxDate) - new Date(minDate)) / (1000 * 60 * 60 * 24) + 1);
}

function isEmailValid(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    return emailRegex.test(email)
}

function darkenColor(color, factor = 0.2) {
    const isHexWithAlpha = color.length === 9;
    const hexColor = color.slice(1, isHexWithAlpha ? 7 : undefined);
    const hexValue = parseInt(hexColor, 16);

    const red = (hexValue >> 16) & 255;
    const green = (hexValue >> 8) & 255;
    const blue = hexValue & 255;

    const newRed = Math.max(0, Math.round(red - red * factor));
    const newGreen = Math.max(0, Math.round(green - green * factor));
    const newBlue = Math.max(0, Math.round(blue - blue * factor));

    const newHexColor = `#${(newRed << 16 | newGreen << 8 | newBlue).toString(16).padStart(6, '0')}`;

    return isHexWithAlpha ? `${newHexColor}${color.slice(7)}` : newHexColor;
}

function getHexColor(colorName) {
    const colorPallete = [{ colorName: 'grass_green', colorHex: '#037f4c' }, { colorName: 'done-green', colorHex: '#00c875' }, { colorName: 'bright-green', colorHex: '#9cd326' }, { colorName: 'saladish', colorHex: '#cab641' }, { colorName: 'egg_yolk', colorHex: '#ffcb00' }, { colorName: 'working_orange', colorHex: '#fdab3d' }, { colorName: 'dark-orange', colorHex: '#ff642e' }, { colorName: 'peach', colorHex: '#ffadad' }, { colorName: 'sunset', colorHex: '#ff7575' }, { colorName: 'stuck-red', colorHex: '#e2445c' }, { colorName: 'dark-red', colorHex: '#bb3354' }, { colorName: 'sofia_pink', colorHex: '#ff158a' }, { colorName: 'lipstick', colorHex: '#ff5ac4' }, { colorName: 'bubble', colorHex: '#faa1f1' }, { colorName: 'purple', colorHex: '#a25ddc' }, { colorName: 'dark_purple', colorHex: '#784bd1' }, { colorName: 'berry', colorHex: '#7e3b8a' }, { colorName: 'dark_indigo', colorHex: '#401694' }, { colorName: 'indigo', colorHex: '#5559df' }, { colorName: 'navy', colorHex: '#225091' }, { colorName: 'bright-blue', colorHex: '#579bfc' }, { colorName: 'dark-blue', colorHex: '#0086c0' }, { colorName: 'aquamarine', colorHex: '#4eccc6' }, { colorName: 'chili-blue', colorHex: '#66ccff' }, { colorName: 'river', colorHex: '#68a1bd' }, { colorName: 'winter', colorHex: '#9aadbd' }, { colorName: 'explosive', colorHex: '#c4c4c4' }, { colorName: 'american_gray', colorHex: '#808080' }, { colorName: 'blackish', colorHex: '#333333' }, { colorName: 'brown', colorHex: '#7f5347' }, { colorName: 'orchid', colorHex: '#d974b0' }, { colorName: 'tan', colorHex: '#ad967a' }, { colorName: 'sky', colorHex: '#a1e3f6' }, { colorName: 'coffee', colorHex: '#bd816e' }, { colorName: 'royal', colorHex: '#2b76e5' }, { colorName: 'teal', colorHex: '#175a63' }, { colorName: 'lavender', colorHex: '#bda8f9' }, { colorName: 'steel', colorHex: '#a9bee8' }, { colorName: 'lilac', colorHex: '#9d99b9' }, { colorName: 'pecan', colorHex: '#563e3e' }]
    const currColor = colorPallete.find(color => color.colorName === colorName)
    return currColor.colorHex
}

function getRandomLabelColor() {
    const colorPallete = ['#037f4c', '#00c875', '#9cd326', '#cab641', '#ffcb00', '#fdab3d', '#ff642e', '#ffadad', '#ff7575', '#e2445c', '#bb3354', '#ff158a', '#ff5ac4', '#faa1f1', '#a25ddc', '#784bd1', '#7e3b8a', '#401694', '#5559df', '#225091', '#579bfc', '#0086c0', '#4eccc6', '#66ccff', '#68a1bd', '#9aadbd', '#c4c4c4', '#808080', '#333333', '#7f5347', '#d974b0', '#ad967a', '#a1e3f6', '#bd816e', '#2b76e5', '#175a63', '#bda8f9', '#a9bee8', '#9d99b9', '#563e3e']
    const randomIndex = Math.floor(Math.random() * colorPallete.length)
    return colorPallete[randomIndex]
}

function getHeroBtnBg(colors, isHover = false) {
    let res = '#6161FF'
    if (isHover) {
        res = '#5151d5'
    }
    if (colors.length === 1) res = `linear-gradient(90deg, ${colors[0].color} 0%, ${colors[0].color}ee 100%)`
    if (colors.length === 2) res = `linear-gradient(90deg, ${colors[0].color} 0%, ${colors[1].color} 100%)`
    else if (colors.length === 3) res = `linear-gradient(90deg, ${colors[0].color} 0%, ${colors[1].color} 50%, ${colors[2].color} 100%)`
    else if (colors.length === 4) res = `linear-gradient(90deg, ${colors[0].color} 0%, ${colors[1].color} 33.333333333333336%, ${colors[2].color} 66.66666666666667%, ${colors[3].color} 100%)`
    else if (colors.length === 5) res = `linear-gradient(90deg, ${colors[0].color} 0%, ${colors[1].color} 25%, ${colors[2].color} 50%, ${colors[3].color} 75%, ${colors[4].color} 100%)`
    else if (colors.length === 6) res = `linear-gradient(90deg, ${colors[0].color} 0%, ${colors[1].color} 20%, ${colors[2].color} 40%, ${colors[3].color} 60%, ${colors[4].color} 80%, ${colors[5].color} 100%)`
    else if (colors.length === 7) res = `linear-gradient(90deg, ${colors[0].color} 0%, ${colors[1].color} 16.666666666666668%, ${colors[2].color} 33.333333333333336%, ${colors[3].color} 50%, ${colors[4].color} 66.66666666666667%, ${colors[5].color} 83.33333333333334%, ${colors[6].color} 100%)`
    else if (colors.length === 8) res = `linear-gradient(90deg, ${colors[0].color} 0%, ${colors[1].color} 14.285714285714286%, ${colors[2].color} 28.571428571428573%, ${colors[3].color} 42.85714285714286%, ${colors[4].color} 57.142857142857146%, ${colors[5].color} 71.42857142857143%, ${colors[6].color} 85.71428571428572%, ${colors[7].color} 100%)`
    else if (colors.length === 9) res = `linear-gradient(90deg, ${colors[0].color} 0%, ${colors[1].color} 12.5%, ${colors[2].color} 25%, ${colors[3].color} 37.5%, ${colors[4].color} 50%, ${colors[5].color} 62.5%, ${colors[6].color} 75%, ${colors[7].color} 87.5%, ${colors[8].color} 100%)`
    return res
}

function getHeroIcons() {
    return ["https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured images/Home Page - 2022 Rebrand/first_fold/icons/design_icon.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured images/Home Page - 2022 Rebrand/first_fold/icons/dev_icon.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured images/Home Page - 2022 Rebrand/first_fold/icons/marketing_icon.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured images/Home Page - 2022 Rebrand/first_fold/icons/pmo_icon.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured images/Home Page - 2022 Rebrand/first_fold/icons/crm_icon.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured images/Home Page - 2022 Rebrand/first_fold/icons/task_icon.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured images/Home Page - 2022 Rebrand/first_fold/icons/hr_icon.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured images/Home Page - 2022 Rebrand/first_fold/icons/operations_icon.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured images/Home Page - 2022 Rebrand/first_fold/icons/workflows_icon.png"]
}

function getLogos() {
    return ["https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/HoltCat.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/canva.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/coca_cola.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/oxy.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/lionsgate.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/carrefour.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/bd.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/glossier.png", "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/universal.png"]
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getEmptyUserCredentials() {
    return {
        username: '',
        password: ''
    }
}
