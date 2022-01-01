const cheerio = require('cheerio')
const axios = require('axios');
const TelegramApi = require('node-telegram-bot-api')

const token = '5028959484:AAH1hYVCcpTkZMz2ONXHtce_c3SvKUMxhso';
const bot = new TelegramApi(token, {polling: true});



function workBot(data){

    bot.setMyCommands([
        {command: '/start', description: 'Информация о боте'},
        {command: '/zameny', description:'Показать замены'},
        {command: '/lox', description:'Кто лох'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/22c/b26/22cb267f-a2ab-41e4-8360-fe35ac048c3b/1.webp');
            await bot.sendMessage(chatId, 'Привет, здесь будут выкладывается замены расписания сразу после того как они загружаются на официальный сайт уксивта. Команда /zameny покажет замены в расписании на сегодня/завтра. Команда /lox скажет кто лох');
        }
        if(text === '/zameny'){
            await bot.sendMessage(chatId, `Замены на сегодня: ${data[data.length - 1].url}`);
            // console.log(data[data.length - 1].day);
        } 
        if(text === '/lox'){
            await bot.sendMessage(chatId, 'Stas is lox');
        }
    })
}




function filterHtml(html) {
    const convertToObj = (day, url) => {
        if(day !== ''){
            return {
                day: day,
                url: url
            }
        }
    }

    const $ = cheerio.load(html.data),
          date = new Date(),
          tablesTest = $(`.ui-datepicker-calendar`),
          stTable = tablesTest[0],
          arrUrl = [],
          months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'avg', 'sep', 'oct', 'nov', 'dec'];

    tablesTest.each((index, item) => {
        if(!index){
            $(item).attr("data-cal", `${months[date.getMonth()]}`);
            $(stTable).attr('data-cal', 'dec');

            const links = $('table[data-cal] a[href^="https://docs.google.com/document/d/"]');

            links.each((i, item) => {
                arrUrl.push(convertToObj($(item).text(), $(item).attr('href')));
            })
        }
    })

    objData.infoArr = arrUrl;
    workBot(arrUrl);
    return arrUrl;
}

let objData = {};
axios.get('https://www.uksivt.ru/zameny').then(async (html) => {
    const filterResponse = await filterHtml(html);

    return filterResponse;
})

