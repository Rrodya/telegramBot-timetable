const cheerio = require('cheerio');
const axios = require('axios');

axios.get('https://www.uksivt.ru/zameny').then(html => {
    const $ = cheerio.load(html.data);
    let text = '';

    // $('p[class="MsoNormal"]').each((i, item) => {
    //     const el = $(item);
    //     if(el.text() === 'Декабрь 2021'){
    //         console.log($(`${el} ~ table`).find('a[rel="noopener"]'));
    //     }
    // })

    try{
        // const tablesTest = $(`.ui-datepicker-calendar`);
        // const stTable = tablesTest[0];
        // const trElement = $(stTable).find('tr');
        
        // trElement.splice(0, 2);
        // trElement.splice(trElement.length - 1, 1);        
        // const el = $(trElement).find('td');
        // const arr = [];
        // $(el).each((i, item) => {
        //     if($(item).attr('class') === 'type5' || $(item).attr('class') === ''){
        //         arr.push($(item));
        //     }
        // })

        // const objUrl = [];

        // const convertToObj = (day, url) => {
        //     if(day !== ''){
        //         return {
        //             day: day,
        //             url: url
        //         }
        //     }
        // }

        // $(arr).each((i, element) => {
        //     let le = $(element).children('a');
        //     // console.log(`${le.text()}\n${le.attr('href')}`);

        //     objUrl.push(convertToObj(le.text(), le.attr('href')));            
        // })

        const date = new Date();
        const tablesTest = $(`.ui-datepicker-calendar`);
        const stTable = tablesTest[0];
        const arrUrl = [];
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'avg', 'sep', 'oct', 'nov', 'dec'];
        const convertToObj = (day, url) => {
            if(day !== ''){
                return {
                    day: day,
                    url: url
                }
            }
        }

        tablesTest.each((index, item) => {
            if(!index){
                $(item).attr("data-cal", `${months[date.getMonth()]}`);
            }
        })
        $(stTable).attr('data-cal', 'dec');


        const links = $('table[data-cal] a[href^="https://docs.google.com/document/d/"]');

        links.each((i, item) => {
            arrUrl.push(convertToObj($(item).text(), $(item).attr('href')));
        })
        console.log(arrUrl[arrUrl.length - 1]);

    } catch(err) {
        console.log(err);
    }



})