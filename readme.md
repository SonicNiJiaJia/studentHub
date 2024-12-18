# StudentHub 安裝與 API 文件

## 目錄
1. [安裝指南](#安裝指南)
2. [環境設定](#環境設定)
3. [資料庫設定](#資料庫設定)
4. [API 文件](#api-文件)
5. [系統架構](#系統架構)

## 安裝指南

### 前置作業
```bash
# 下載專案
git clone https://github.com/DanielTseng2004/studentHub.git
cd studentHub
```

### 前端設定
```bash
# 進入前端目錄並安裝依賴
cd front
npm i

# 啟動開發伺服器
npm run dev
```

### 後端設定
```bash
# 進入後端目錄並安裝依賴
cd backDB
npm i

# 啟動後端伺服器
npm run dev
```

## 環境設定

將 `.env.example` 重命名為 `.env` 並設定以下參數：

```env
# 資料庫設定
DBUSER=user                # 資料庫使用者名稱
DBPASSWORD=password        # 資料庫密碼
DBHOST=127.0.0.1          # 資料庫主機位址
DBPORT=DBport             # 資料庫連接埠
DBNAME=name               # 資料庫名稱

# 系統設定
PORT=8888                 # 後端服務埠
LogPath=logs              # 日誌存放路徑
assetsPath=/assets        # 靜態資源路徑
HomePagePath=/index.html  # 首頁路徑
privateKey=key            # 私鑰
```

## 資料庫設定

### MongoDB 設定步驟
1. 安裝並啟動 MongoDB
2. 建立 `students` collection
3. 匯入 `studentslist.csv` 範例數據

### 數據格式範例
```json
{
    "userName": "tkume2253",
    "sid": 4,
    "name": "***",
    "department": "機械工程系",
    "grade": "四年級",
    "class": "B",
    "email": "tkume2253@tkuim.com"
}
```

## API 文件

### 1. 查詢所有學生
- **端點**: `GET /api/v1/user/findAll`
- **描述**: 取得所有學生資料
- **回應**: 200 OK
  ```json
  {
      "code": 200,
      "message": "find success",
      "body": [
          {
              "_id": "675a5c96a4d2295a34f77b58",
              "userName": "tkubm1760",
              "name": "劉嘉豪",
              "department": "企業管理系",
              "grade": "一年級",
              "class": "D",
              "email": "tkubm1760@tkuim.com"
          }
      ]
  }
  ```

### 2. 查詢單一學生
- **端點**: `GET /api/v1/user/findOne`
- **描述**: 根據 ID 查詢特定學生資料
- **回應**:
  - 200 OK: 查詢成功
  - 404 Not Found: 找不到該學生
  - 500 Server Error: 查詢錯誤

### 3. 新增學生
- **端點**: `GET /api/v1/user/insertOne`
- **描述**: 新增單一學生資料
- **回應**:
  - 200 OK: 新增成功
  - 403 Forbidden: 重複的使用者帳號
  - 500 Server Error: 伺服器錯誤

### 4. 刪除學生
- **端點**: `GET /api/v1/user/deletedById`
- **描述**: 根據 ID 刪除學生資料
- **回應**:
  - 500 Server Error: 伺服器錯誤

### 5. 更新學生資料
- **端點**: `GET /api/v1/user/updateNameById`
- **描述**: 根據 ID 更新學生資料
- **回應**:
  - 500 Server Error: 伺服器錯誤

## 系統架構
![diagram](架構圖.drawio.png)
