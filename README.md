# Travel Lover
旅遊記事地圖

## 測試帳號
    管理員:
    account:manager
    password: 12345678
    使用者:
    account:user1
    password: 12345678


## Features

### Blog ######
*   列出所有部落格資料
*   可依照時間顯示
*   可新增、變更、刪除支出明細

### Tracker ######
*   列出所有記帳的資料並計算總金額
*   可依照類別分類和時間顯示
*   可新增、變更、刪除支出明細
### Map ######
*   列出所有標記位置
*   可依照類別分類和時間顯示
*   可透過標記紀錄部落格或記帳

### Filter
select category,year or month to filter the list

### Create
click the create button to add information

### Record Edit
click the edit button bellow to edit the information

### Record Delete
click the delete button bellow to delete the information


### Environment SetUp - 環境建置

*   Node.js
*   Express: 4.17.1
*   nodemon
*   body-parser: 1.19.0
*   connect-flash: 0.1.1
*   dotenv: 8.2.0
*   passport: 0.4.1
*   bcryptjs: 2.4.3,
*   connect-flash: 0.1.1,
*   dayjs: 1.10.3,
*   express-handlebars: 5.2.0,
*   express-session: 1.17.1,
*   imgur: 0.3.1,
*   imgur-node-api: 0.1.0,
*   method-override: 3.0.0,
*   multer: 1.4.2,
*   mysql2: 2.2.5,
*   sequelize: 6.3.5,
*   sequelize-cli: 6.2.0

### Installing - 專案安裝流程
打開你的 terminal，Clone 此專案至本機電腦
```
git clone https://github.com/LeonardoRoosevelt/TravelLover
```
開啟終端機(Terminal)，進入存放此專案的資料夾
```
cd TravelLover
```
安裝 npm 套件
```
在 Terminal 輸入 npm install 指令
```
安裝 nodemon 套件
```
在 Terminal 輸入 nodemon app.js 指令
```
啟動伺服器，執行 app.js 檔案
```
nodemon app.js
```
導入預設資料
```
npm run seed
```
當 terminal 出現以下字樣，表示伺服器與資料庫已啟動並成功連結
```
The Express server is running on http://localhost:3000
```

現在，你可開啟任一瀏覽器瀏覽器輸入 "http://localhost:3000" 開始使用



### Contributor - 專案開發人員
[Leonardo Roosevelt](https://github.com/LeonardoRoosevelt)
