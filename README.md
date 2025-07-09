Product Analytics Web App
This full-stack project is built using Node.js (Express) for the backend and React.js for the frontend. It displays product transaction data, monthly statistics, and charts using Recharts.

🔧 Technologies Used

Backend
  Node.js
  Express.js
  MongoDB

Frontend
  React.js
  Recharts
  
🔍 Features

📦 Product Listing with Search & Pagination
GET /a/product?search=phone&page=1
  Search by title, description, or price
  Pagination supported (10 items per page)

📊 Monthly Statistics
GET /a/stats?month=3&year=2022
  Total sales
  Number of items sold
  Number of items not sold

📈 Price Range Bar Chart
GET /a/price?month=1&year=2022
  Returns data to visualize items across different price ranges
  Shown in a bar chart using Recharts

🥧 Category-wise Pie Chart
GET /a/category?month=3
  Displays number of items in each category for selected month
  Shown in a pie chart using Recharts

🧩 Combined Data
GET /a/combined?month=3&year=2022
  Combines stats, price, and category data in one response
  Shown in a dashboard components.

Web Application UI
https://drive.google.com/drive/folders/1EseY8SK6L09f95DIrSV7IPVwkbweBFps?usp=drive_link
