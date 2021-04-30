const fetch = require('node-fetch');
const cheerio = require('cheerio');
const iconv = require('iconv-lite')


const fetchSearchData = async function (title) {
    try {
        //HTTP請求
        const res = await fetch(`http://www.ktgh.com.tw/Drug/Medicament_tbDrug_list.asp?CatID=&ModuleType=&xSubject=${title}`)

        let html = await res.buffer();
        html = iconv.decode(html, 'big5');


        //解析HTML
        const $ = cheerio.load(html, { decodeEntities: false });
        let medList = [];
        $('table[summary="列表"]').find('tbody > tr').each(function (index, element) {
            //每一筆藥
            let med = [];
            $(element).find('td').each(function (index, element) {
                //每一筆藥裡面的項目
                let content = $(element).text().trim();
                if (content && content !== '下載檔案') {
                    // console.log($(element).text());
                    med.push(content);
                }
                let href = $(element).find('a').attr('href');
                if (href) {
                    med.push(href);
                }
            })
            if ($(element).text().trim()) {
                medList.push(med);
            }
        });
        return medList;
    } catch (err) {
        console.log("ERROR抓資料途中出事了");
        console.error(err.message);
    }
}


const fetchDetailData = async function (url) {
    try {
        //POST請求
        const res = await fetch(url)
        let html = await res.buffer();
        html = iconv.decode(html, 'big5');
        //解析HTML
        const $ = cheerio.load(html, { decodeEntities: false });
        let medDetailData = []
        let temp = []
        $('body > table > tbody > tr > td > table:nth-child(3) > tbody').find('tr').each((index, element) => {
            let content = $(element).text().trim();
            if (content && !content.startsWith('UpToDate')) {
                if(content.length>150){
                    temp.push(content.slice(0, 140)+'...');
                }else{
                    temp.push(content);
                }
            }
            if (temp.length === 2) {
                medDetailData.push(temp);
                temp = [];
            }
        })
        const medDetailDataObject = Object.fromEntries(medDetailData);
        console.log(medDetailDataObject);
        return medDetailDataObject;
    } catch (err) {
        console.log("ERROR抓資料途中出事了");
        console.error(err.message);
    }
}
let url = 'http://www.ktgh.com.tw/Drug/Medicament_tbDrug_Look.asp?CatID=&ModuleType=&NewsID=1719&Ordid=33045'
fetchDetailData(url)
module.exports = { fetchSearchData , fetchDetailData}
