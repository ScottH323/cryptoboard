import axios from 'axios';

const POLL_TIME = 10000;

self.addEventListener('message', function (e) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${e.data.token}`;

    getCurrency().then(() => {
        setTimeout(getCurrency, POLL_TIME);
    }); //Initial call

}, false);

async function getCurrency() {
    console.log('Checking currency index');

    const res = await axios.get('http://localhost:3000/currency/table');

    if (res.status === 200)
        self.postMessage(res.data);
}