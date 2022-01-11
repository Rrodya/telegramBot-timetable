const cheerio = require('cheerio');
const axios = require('axios');

const TelegramApi = require('node-telegram-bot-api');
const token = '5028959484:AAH1hYVCcpTkZMz2ONXHtce_c3SvKUMxhso';
const bot = new TelegramApi(token, {polling: true});
let chatId;
let url = ''
let otdelenie = '';
const buttonsRaspisanie = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Отделение экономики и ЗИО', callback_data: 'zio'}],
            [{text: 'Отделение права', callback_data: 'pravo'}],
            [{text: 'Отделение информатики и программирования', callback_data: 'program'}],
            [{text: 'Отделение вычислительной техники', callback_data: 'tech'}],
            [{text: 'Общеобразовательное отделение', callback_data: 'perv'}],
        ]
    })
}

const urlOtdelenie = [
    {
        otdel: 'zio',
        url: 'https://docs.google.com/spreadsheets/d/1y4E6WsZOvR12TytWM5MFffD7QDzZp2Nq/edit?usp=sharing&ouid=110468935385081609098&rtpof=true&sd=true'
    },
    {
        otdel: 'pravo',
        url: 'https://docs.google.com/spreadsheets/d/1Xr8BTeoWXRPJZ7jGKH5RvBenFe1vksEo/edit?usp=sharing&ouid=110468935385081609098&rtpof=true&sd=true'
    },
    {
        otdel: 'program',
        url: 'https://docs.google.com/spreadsheets/d/1Ofgk9p7lLHv4kradp30U5X04Li4f7hH8/edit?usp=sharing&ouid=110468935385081609098&rtpof=true&sd=true'
    },
    {
        otdel: 'tech',
        url: 'https://docs.google.com/spreadsheets/d/12UUTZFS7nwaJCe0GYhEDeZJQlJhWcSmu/edit?usp=sharing&ouid=110468935385081609098&rtpof=true&sd=true'
    },
    {
        otdel: 'perv',
        url: 'https://docs.google.com/spreadsheets/d/13LvjUBNhuhd3R9Mk7ChXzo6X_Vyj0MoC/edit?usp=sharing&ouid=110468935385081609098&rtpof=true&sd=true'
    },
]


// стетчик для if  в filterHtml для того чтобы только самый первый вызов workBot() запускал бота, остальные
let checked = 0;
// для отправки обновленных данных
let correct = 0; upd = 0;




function workBot(data){

    bot.setMyCommands([
        {command: '/start', description: 'Информация о боте'},
        {command: '/zameny', description:'Показать замены'},
        {command: '/raspisanie', description:'Показать расписание'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        chatId = msg.chat.id;
        
        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/22c/b26/22cb267f-a2ab-41e4-8360-fe35ac048c3b/1.webp');
            await bot.sendMessage(chatId, 'Привет, здесь будут выкладывается замены расписания сразу после того как они загружаются на официальный сайт уксивта. Команда /zameny покажет замены в расписании на сегодня/завтра. Команда /raspisanie покажет расписание');
        }
        if(text === '/zameny'){
            await bot.sendMessage(chatId, `Замены на сегодня: ${data[data.length - 1].url}`);
            // console.log(data[data.length - 1].day);
        } 
        if(text === '/raspisanie'){
            // if(!otdelenie){
                await bot.sendMessage(chatId, 'Выбери своё отделение ', buttonsRaspisanie);
            // } else {
            //     await bot.sendMessage(chatId, `Расписание: ${url}`, );
            // }
        }
        if(checked === 1){
            sendTable(data);
            checked++;
        }
    });

    bot.on('callback_query', msg => {
        chatId = msg.message.chat.id;
        otdelenie = msg.data;

        urlOtdelenie.forEach(item => {
            if(item.otdel === otdelenie){
                url = item.url
            }
        })

        bot.sendMessage(chatId, `Расписание: ${url}`);
    })
}

function sendTable(tableTime){
    bot.sendMessage(chatId, `Расписание на ${tableTime[tableTime.length - 1].day}: ${tableTime[tableTime.length - 1].url}`);
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

    correct = arrUrl[arrUrl.length - 1].day;
    
    if(correct !== upd){
        if(checked === 0){
            checked++;

            workBot(arrUrl);  

            upd = arrUrl[arrUrl.length - 1].day;

            return arrUrl;
        }
        sendTable(arrUrl);      // Task: сделать чтобы при вызови бота автоматически без команды отправлялась ссылка
        upd = arrUrl[arrUrl.length - 1].day;

    }
    return arrUrl;
}

getAxios();

setInterval(getAxios, 15000);   /* Task: Условие по времени, чтобы например сет интервал работал только с 9:00 по 14:00*/

function getAxios(){
    axios.get('https://www.uksivt.ru/zameny').then(async (html) => {
        const filterResponse = await filterHtml(html);

        return filterResponse;
    })
}

