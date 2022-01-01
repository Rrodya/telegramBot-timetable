const axios = require('axios');

const documentId = '1n7dSYgtH8LAuvOdFNJ-SeukYXWn0Gy_F';

axios.get(`https://docs.googleapis.com/v1/documents/${documentId}`).then(res => {
    console.log(res);
})