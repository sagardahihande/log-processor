# Full-Stack Log Processing Microservice

## 📌 Project Overview
This project is a **full-stack log processing microservice** that allows users to upload log files for processing. It uses **Node.js (Express) for the backend**, **React.js for the frontend**, **BullMQ for job queuing**, **Redis for background processing**, and **Supabase for database storage and authentication**. Real-time updates are pushed using **WebSockets**.

---

## 📂 Project Structure
```
log-processor/
├── backend/            # Node.js + Express backend
│   ├── server.js       # Main backend server
│   ├── worker.js       # BullMQ worker for processing logs
│   ├── lib/            # Utility functions
│   ├── uploads/        # Log file storage (temporary)
│   ├── .env            # Environment variables
│   ├── package.json    # Backend dependencies
├── frontend/           # React.js frontend
│   ├── src/
│   │   ├── App.tsx     # Main React component
│   │   ├── components/ # UI components
│   ├── package.json    # Frontend dependencies
├── docker-compose.yml  # Docker setup
├── README.md           # Project documentation
```

---

## 🛠 Technologies Used
### **Backend (Node.js + BullMQ + Express)**
- **Node.js 20.x**
- **Express.js** (API routes)
- **BullMQ** (Job queue)
- **Redis** (Job storage & queue management)
- **Supabase** (Database + Authentication)
- **WebSockets** (Real-time updates)

### **Frontend (React.js + WebSockets)**
- **React 18.x** (Frontend framework)
- **Axios** (API requests)
- **Socket.io-client** (Real-time updates)

### **Other**
- **Docker** (Containerization)
- **Multer** (File upload handling)
- **Jest** (Unit testing)

---

## 🔧 Setup Instructions

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-repo/log-processor.git
cd log-processor
```

### **2️⃣ Backend Setup**
```bash
cd backend
npm install
```

### **3️⃣ Create `.env` File in Backend**
```env
REDIS_URL=redis://localhost:6379
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=5000
```
🔹 Replace `your-supabase-project.supabase.co` and `your-anon-key` with actual values from [Supabase Dashboard](https://app.supabase.io/).

### **4️⃣ Start Redis (Required for BullMQ)**
```bash
docker run --name redis -p 6379:6379 -d redis
```

### **5️⃣ Start Backend**
```bash
cd backend
npm start
```

### **6️⃣ Frontend Setup**
```bash
cd ../frontend
npm install
npm start
```

🔹 The frontend will be available at **http://localhost:3000**.

---

## 📡 API Endpoints
### **1️⃣ Upload a Log File**
```http
POST /api/upload
```
**Request (multipart/form-data):**
```json
{
  "file": "logfile.log"
}
```
**Response:**
```json
{
  "jobId": "12345"
}
```

### **2️⃣ Get Processed Log Stats**
```http
GET /api/stats
```
**Response:**
```json
[
  {
    "errors": 5,
    "keywords": 2,
    "unique_ips": ["192.168.1.1", "10.0.0.2"]
  }
]
```

### **3️⃣ Real-time WebSocket Updates**
- WebSocket URL: `ws://localhost:5000`
- Emits updates when jobs are processed.

---

## 🐳 Docker Setup
You can run everything using **Docker Compose**.

### **1️⃣ Create `docker-compose.yml`**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - redis
  redis:
    image: "redis:latest"
    ports:
      - "6379:6379"
```

### **2️⃣ Run with Docker**
```bash
docker-compose up --build
```

---

## ✅ Testing
Run unit tests using Jest:
```bash
cd backend
npm test
```

---

## 🚀 Features
✅ **Log File Uploading**
✅ **Background Processing with BullMQ**
✅ **Real-Time WebSocket Updates**
✅ **Supabase Database for Storage**
✅ **Dockerized Deployment**
✅ **Authentication with Supabase**
✅ **Unit & Integration Testing**

---

## ❓ Troubleshooting
### **1️⃣ Backend Fails to Start?**
- Ensure Redis is running:
  ```bash
  docker ps
  ```
- If Redis is missing, run:
  ```bash
  docker run --name redis -p 6379:6379 -d redis
  ```

### **2️⃣ Network Error in Frontend?**
- Ensure backend is running on **port 5000**.
- Enable CORS in `server.js`:
  ```js
  const cors = require('cors');
  app.use(cors({ origin: 'http://localhost:3000' }));
  ```

### **3️⃣ WebSockets Not Working?**
- Ensure backend WebSocket server is running on **port 5000**:
  ```js
  const { Server } = require('ws');
  const wss = new Server({ port: 5000 });
  ```

---

## 📌 Future Improvements
🔹 **Add OAuth Authentication (Google/GitHub Login)**
🔹 **Improve UI with Tailwind CSS**
🔹 **Use Node.js Cluster for Faster Processing**
🔹 **Implement a Caching Layer for Performance**

---

## 🏆 Conclusion
This full-stack microservice efficiently processes large log files with real-time updates. 🚀 Feel free to **fork, modify, and contribute!**

---

Made with ❤️ by **Sagar Dahihande**

