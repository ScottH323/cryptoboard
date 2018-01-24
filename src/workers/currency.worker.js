import axios from 'axios';

self.addEventListener('message', function (e) {

    setTimeout(async () => {

        const res = await axios.get('http://localhost:3000/currency/table');
        console.log(res);


        self.postMessage(res.data);

    }, 5000);

}, false);