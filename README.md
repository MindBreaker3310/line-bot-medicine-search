# line-bot-medicine-search

<img src="https://github.com/MindBreaker3310/line-bot-medicine-search/blob/main/demo.gif" width = "200px" height = "auto">

## ▶執行專案
- **[LINE帳號連結]** 
 <img src="https://github.com/MindBreaker3310/line-bot-medicine-search/blob/main/qrcode.png" width = "200px" height = "auto">  
 
- **仿單** 直接透過line內建瀏覽器顯示仿單
- **查看更多** 直接透過line內建瀏覽器查看藥物資訊
- **了解更多** 透過quicy reply回應藥物資訊

## 📃技術
- **linebot**：Node.js的line bot SDK
- **express**：Node.js的網路框架
- **node-fetch**：在Node.js內使用fetch做http的請求
- **iconv**：編碼解碼套件
- **cheerio**：解析HTML套件

## 🚩架構
- **index.js**：控制line bot回應message與postback
- **crawler.js**：爬蟲抓取與解析網站
- **big5_encoder**：將中文轉成big5

## 💪收穫
1. 了解line bot元件、事件監聽、event object、message types與相關的限制
2. 學會使用javascript等爬蟲套件
3. 處理中文編碼問題

## 🧭後續
line bot的回應裡面限制了很多關於字數數量，導致部分內容無法完全顯示，在搜尋方面都是直接搜尋用戶傳入的文字，少了許多對話之間的互動，沒有運用的line bot的優勢，這也是未來要改善的。
