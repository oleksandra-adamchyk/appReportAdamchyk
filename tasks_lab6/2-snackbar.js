const form = document.querySelector('.form');

if (!window.iziToast) {
    console.error('iziToast is not loaded');
} else {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const delay = Number(form.elements.delay.value);
        const state = form.elements.state.value;

        // Validate delay
        if (delay <= 0) {
            iziToast.warning({
                title: 'Warning',
                message: 'Please enter a positive delay value',
                position: 'topRight'
            });
            return;
        }

        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (state === 'fulfilled') {
                    resolve(delay);
                } else {
                    reject(delay);
                }
            }, delay);
        });

        promise
            .then((delay) => {
                iziToast.success({
                    title: 'OK',
                    message: `✅ Fulfilled promise in ${delay}ms`,
                    position: 'topRight'
                });
            })
            .catch((delay) => {
                iziToast.error({
                    title: 'Error',
                    message: `❌ Rejected promise in ${delay}ms`,
                    position: 'topRight'
                });
            });
    });
}