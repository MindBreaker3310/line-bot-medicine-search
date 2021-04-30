const linebot = require('linebot');
const crawler = require('./crawler.js');
const express = require('express');
const bodyParser = require('body-parser');
const big5_encode = require('./big5_encoder.js')

const bot = linebot({
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

// event.reply({ type: 'text', text: medSearchData[1][1] });
bot.on('message', async function (event) {
    try {
        // mData:[
        //     '23381',
        //     'OXBU EXTENDED TAB 5MG',
        //     'Medicament_tbDrug_Look.asp?CatID=&ModuleType=&NewsID=2084&Ordid=23381',
        //     '歐舒緩釋錠',
        //     'Oxybutynin',
        //     '/Public/tbDrug/202006011606567055.pdf',
        //     'http://www.ktgh.com.tw/tbDrugReport/tbDrug001rpt.aspx?Ordid=23381'
        // ]
        const medSearchData = await crawler.fetchSearchData(big5_encode(event.message.text));
        let messages = []
        medSearchData.forEach((mData, index) => {
            if (index !== 0 && index <= 10) {
                messages.push({
                    "title": mData[3],
                    "text": `醫令代碼: ${mData[0]}\n商品名: ${mData[1]}`,
                    "defaultAction": {
                        "type": "uri",
                        "label": "View detail",
                        "uri": `http://www.ktgh.com.tw/Drug/${mData[2]}`
                    },
                    "actions": [
                        {
                            "type": "uri",
                            "label": "仿單",
                            "uri": `http://www.ktgh.com.tw${mData[5]}`
                        },
                        {
                            "type": "uri",
                            "label": "查看更多",
                            "uri": `http://www.ktgh.com.tw/Drug/${mData[2]}`
                        },
                        {
                            "type": 'postback',
                            "label": '了解更多',
                            "data": `${medSearchData[index]}`
                        }
                    ]
                })
            }
        })

        if (messages.length === 0) {
            event.reply({ type: 'text', text: 'SORRY~跨謀😢' });
        } else {
            event.reply({
                "type": "template",
                "altText": "this is a carousel template",
                "template": {
                    "type": "carousel",
                    "columns": messages,
                    "imageAspectRatio": "rectangle",
                    "imageSize": "cover"
                }
            })
        }

    } catch (error) {
        // error
        console.log('on message錯誤');
        console.log(error);
        console.log('------------------------------');
    }
});


bot.on('postback', async function (event) {
    try {
        const medPostbackData = event.postback.data.split(',')
        if (medPostbackData.length === 1) {
            event.reply({
                "type": 'text',
                "text": `${event.postback.data}`,
            })
            return
        }

        const medDetailDataObject = await crawler.fetchDetailData(`http://www.ktgh.com.tw/Drug/${medPostbackData[2]}`);
        let quickItems = [];
        for (const [key, value] of Object.entries(medDetailDataObject)) {
            // console.log(`${key}: ${value}`);
            quickItems.push({
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": key,
                    "data": value,
                }
            })
        }
        console.log(quickItems);
        event.reply({
            "type": 'text',
            "text": `想知道關於${medPostbackData[3]}的什麼呢~?`,
            "quickReply": {
                "items": quickItems
            }
        })
    } catch (error) {
        console.log('on postback錯誤');
        console.log(error);
    }
});


// const PORT = process.env.PORT || 5000;
// bot.listen('/linewebhook', PORT);

const app = express();

const parser = bodyParser.json({
    verify: function (req, res, buf, encoding) {
        req.rawBody = buf.toString(encoding);
    }
});

app.post('/linewebhook', parser, function (req, res) {
    if (!bot.verify(req.rawBody, req.get('X-Line-Signature'))) {
        return res.sendStatus(400);
    }
    bot.parse(req.body);
    return res.json({});
});

app.listen(process.env.PORT || 5000, function () {
    console.log('LineBot is running.');
});
