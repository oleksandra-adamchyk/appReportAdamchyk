const datetimePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;

if (!window.flatpickr) {
    console.error('Flatpickr is not loaded');
    iziToast.error({
        title: 'Error',
        message: 'Failed to load date picker library',
        position: 'topRight'
    });
} else if (!datetimePicker) {
    console.error('Datetime picker input not found');
    iziToast.error({
        title: 'Error',
        message: 'Input element not found',
        position: 'topRight'
    });
} else {
    const options = {
        enableTime: true,
        time_24hr: true,
        defaultDate: new Date(),
        minuteIncrement: 1,
        onClose(selectedDates) {
            const selectedDate = selectedDates[0];
            const currentDate = new Date();
            
            if (selectedDate <= currentDate) {
                iziToast.error({
                    title: 'Error',
                    message: 'Please choose a date in the future',
                    position: 'topRight'
                });
                startBtn.disabled = true;
                userSelectedDate = null;
            } else {
                userSelectedDate = selectedDate;
                startBtn.disabled = false;
            }
        },
    };

    flatpickr(datetimePicker, options);
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function updateTimerInterface({ days, hours, minutes, seconds }) {
    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}

startBtn.addEventListener('click', () => {
    if (!userSelectedDate) return;

    startBtn.disabled = true;
    datetimePicker.disabled = true;

    const intervalId = setInterval(() => {
        const currentTime = new Date();
        const timeLeft = userSelectedDate - currentTime;

        if (timeLeft <= 0) {
            clearInterval(intervalId);
            updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            datetimePicker.disabled = false;
            startBtn.disabled = true;
            userSelectedDate = null;
            return;
        }

        const timeComponents = convertMs(timeLeft);
        updateTimerInterface(timeComponents);
    }, 1000);
});