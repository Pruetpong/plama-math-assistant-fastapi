# 🧮 PLAMA - Personalized Learning AI Mathematics Assistant

![PLAMA Banner](https://img.shields.io/badge/PLAMA-Mathematics_Assistant-2C7BE5?style=for-the-badge&logo=google-scholar&logoColor=white)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-00C9A7?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--5-412991?style=flat-square&logo=openai)](https://openai.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

> **AI-powered mathematics tutoring system** ที่ใช้ Socratic Method ในการสอน โดยจำลองนักคณิตศาสตร์ประวัติศาสตร์มาช่วยสอนตามหลักสูตรคณิตศาสตร์ไทย

---

## ✨ Features

### 🎓 **4 โหมดการสอน**
- **PLAMA (Student Mode)** - Socratic Method ไม่ให้คำตอบตรง กระตุ้นให้คิดเอง
- **PLAMA-EXAM** - โหมดติวสอบ ให้คำตอบและกลยุทธ์โดยตรง
- **PLAMA-TA** - ผู้ช่วยอาจารย์ วางแผนการสอน ออกแบบหลักสูตร
- **PLAMA-EXAM-TA** - ที่ปรึกษาการสอบ ช่วยออกแบบการประเมิน

### 👨‍🏫 **13+ นักคณิตศาสตร์ประวัติศาสตร์**
| นักคณิตศาสตร์ | ยุค | ความเชี่ยวชาญ | Icon |
|--------------|-----|--------------|------|
| **Euclid** | 300 BCE | เรขาคณิต, ตรรกศาสตร์ | 📏 |
| **Pythagoras** | 570-495 BCE | ทฤษฎีบทพีทาโกรัส | 📐 |
| **Leibniz** | 1646-1716 | แคลคูลัส | 🎓 |
| **Gauss** | 1777-1855 | ทฤษฎีจำนวน, สถิติ | 🔢 |
| **Ramanujan** | 1887-1920 | อนุกรมอนันต์ | 🌟 |
| **Newton** | 1643-1727 | แคลคูลัส, ฟิสิกส์ | 🍎 |
| **Hypatia** | 370-415 CE | เรขาคณิต, ดาราศาสตร์ | 🌙 |
| **Archimedes** | 287-212 BCE | เรขาคณิต, กลศาสตร์ | ⚙️ |
| และอื่นๆ... | | | |

### 🤝 **ระบบการร่วมมือ (Collaboration System)**
- **Harmony Mode** - นักคณิตศาสตร์ 2 คนร่วมมือกันสอน
- **Debate Mode** - โต้วาทีทางวิชาการ แสดงมุมมองที่แตกต่าง
- **12+ Collaboration Pairs** - คู่ที่ออกแบบมาแล้ว เช่น Newton + Leibniz, Euclid + Gauss

### 📚 **หลักสูตรคณิตศาสตร์ไทย**
- สอดคล้องกับ **Thai Basic Education Core Curriculum (2017 revision)**
- รองรับ **ประถมศึกษาปีที่ 6** และ **มัธยมศึกษาปีที่ 1-6**
- ครอบคลุมหัวข้อ: พีชคณิต, เรขาคณิต, ตรีโกณมิติ, แคลคูลัส, สถิติ, ความน่าจะเป็น

### 🛠️ **เครื่องมือทางคณิตศาสตร์**
- **KaTeX** - Render LaTeX expressions
- **MathLive** - Math input field
- **Desmos Calculator** - Interactive graphing
- **3D Calculator** - 3D visualization
- **GraspableMath** - Interactive algebra

### 💬 **Multi-modal Learning**
- รองรับข้อความ (Text)
- อัปโหลดรูปภาพปัญหา (Image Analysis)
- กราฟและสมการ (Graph & Equation)
- การสนทนาแบบ real-time streaming

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | FastAPI, Uvicorn, Gunicorn |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **AI Engine** | OpenAI GPT-5 |
| **Template** | Jinja2 |
| **Image Processing** | Pillow (PIL) |
| **Math Rendering** | KaTeX, MathLive |
| **Middleware** | CORS, Session (Starlette) |
| **Deployment** | Docker, Docker Compose |

---

## 📋 Prerequisites

- Python 3.9 หรือสูงกว่า
- OpenAI API Key
- Docker & Docker Compose (สำหรับ deployment)
- Node.js (optional - สำหรับ development tools)

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/plama-math-assistant-fastapi.git
cd plama-math-assistant-fastapi
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` จาก template:

```bash
cp .env.example .env
```

แก้ไข `.env` และใส่ API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
FLASK_SECRET_KEY=your_secret_key_here
PORT=8001
HOST=0.0.0.0
```

### 3. รันด้วย Docker (แนะนำ)

```bash
# Build และรัน
docker-compose up -d

# ตรวจสอบ logs
docker-compose logs -f

# หยุดการทำงาน
docker-compose down
```

เข้าถึงแอปที่: **http://localhost:8001/app**

### 4. รันแบบ Local (Development)

```bash
# ติดตั้ง dependencies
pip install -r requirements.txt

# รันแอปพลิเคชัน
python app.py
```

หรือใช้ uvicorn:

```bash
uvicorn app:app --host 0.0.0.0 --port 8001 --reload
```

---

## 📁 Project Structure

```
plama-math-assistant-fastapi/
├── app.py                      # Main application file (3,960 lines)
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose configuration
├── .env.example               # Environment variables template
├── .dockerignore              # Docker ignore rules
├── README.md                   # This file
├── DEPLOYMENT.md              # Deployment guide for Hostinger
├── static/                     # Static assets
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   └── js/
│       └── main.js            # Frontend JavaScript
└── templates/                  # Jinja2 templates
    ├── index.html             # Main application page
    └── assessment.html        # Assessment page
```

---

## 🔌 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Assessment page |
| `GET` | `/app`, `/index` | Main application |
| `GET` | `/api/chatbots` | Get available chatbots |
| `GET` | `/api/curriculum` | Get Thai curriculum data |
| `GET` | `/api/scientists` | Get mathematician profiles |
| `POST` | `/api/initialize` | Initialize bot with settings |
| `POST` | `/api/chat` | Send chat message |
| `GET` | `/api/chat/stream` | Stream chat response (SSE) |
| `POST` | `/api/save_conversation` | Save conversation to file |
| `POST` | `/api/retry_last` | Retry last message |
| `POST` | `/api/undo_last` | Undo last message |
| `POST` | `/api/clear_chat` | Clear chat history |

### Collaboration Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/collaboration/modes` | Get collaboration modes |
| `GET` | `/api/collaboration/pairs/{mode}` | Get pairs by mode |
| `GET` | `/api/collaboration/all` | Get all collaboration data |

### Utility Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/save_graph` | Save Desmos graph state |
| `GET` | `/api/load_graph/{id}` | Load graph by ID |
| `POST` | `/api/upload_conversation` | Upload conversation file |

---

## 🎯 Usage Examples

### 1. เลือกนักคณิตศาสตร์และหัวข้อ

```javascript
// Initialize bot
POST /api/initialize
{
  "bot_key": "plama",
  "grade": "มัธยมศึกษาปีที่ 1 (Grade 7)",
  "topic": "สมการเชิงเส้นตัวแปรเดียว",
  "scientist_key": "euclid",
  "user_mode": "student",
  "collaboration_mode": "single",
  "temperature": 0.6,
  "max_completion_tokens": 1800
}
```

### 2. ส่งข้อความแชท

```javascript
// Send message
POST /api/chat
{
  "history": [],
  "api_state": {...},
  "grade": "มัธยมศึกษาปีที่ 1",
  "topic": "สมการเชิงเส้น",
  "message": {
    "text": "อธิบาย 2x + 3 = 7 ให้หน่อยครับ",
    "type": "text"
  }
}
```

### 3. Streaming Response

```javascript
// Connect to stream
const eventSource = new EventSource('/api/chat/stream?request_id=xxx');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'content') {
    console.log(data.content);
  }
};
```

---

## 🔧 Configuration

### Temperature Settings

ควบคุมความคิดสร้างสรรค์ของ AI:

- **0.0-0.3**: Deterministic, เน้นความแม่นยำ
- **0.4-0.7**: Balanced (แนะนำ: 0.6)
- **0.8-1.0**: Creative, หลากหลาย

### Max Tokens

จำนวน tokens สูงสุดในการตอบกลับ:

- **Default**: 1800 tokens
- **Range**: 500-4000 tokens

### User Modes

- **student**: โหมดนักเรียน (PLAMA, PLAMA-EXAM)
- **lecturer**: โหมดอาจารย์ (PLAMA-TA, PLAMA-EXAM-TA)

---

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t plama-math-assistant .
```

### Run Container

```bash
docker run -d \
  -p 8001:8001 \
  -e OPENAI_API_KEY=your_key_here \
  --name plama \
  plama-math-assistant
```

### Using Docker Compose

```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f plama

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## 🚢 Deployment on Hostinger VPS

ดูคู่มือการ deploy แบบละเอียดใน **[DEPLOYMENT.md](DEPLOYMENT.md)**

### Quick Deploy Steps

1. เชื่อมต่อ VPS ผ่าน SSH
2. Clone repository
3. ตั้งค่า environment variables
4. รัน `docker-compose up -d`
5. ตั้งค่า Nginx reverse proxy (optional)
6. ตั้งค่า SSL certificate ด้วย Let's Encrypt

---

## 🧪 Testing

### Manual Testing

1. เปิดเบราว์เซอร์ไปที่ `http://localhost:8001/app`
2. เลือก Bot Type, Grade, Topic
3. เลือกนักคณิตศาสตร์
4. กด "Start Learning"
5. ทดสอบส่งข้อความ

### API Testing

```bash
# Test health check
curl http://localhost:8001/

# Test chatbots endpoint
curl http://localhost:8001/api/chatbots?user_mode=student

# Test curriculum
curl http://localhost:8001/api/curriculum
```

---

## 🔒 Security

### Environment Variables

**ห้าม** commit ไฟล์ `.env` เข้า Git!

```bash
# เพิ่มใน .gitignore
.env
*.env
!.env.example
```

### API Key Protection

- เก็บ API key ใน environment variables เท่านั้น
- ใช้ HTTPS ใน production
- ตั้งค่า rate limiting
- ใช้ CORS policy ที่เหมาะสม

### Session Security

```python
# Session middleware
SECRET_KEY = os.getenv("FLASK_SECRET_KEY", os.urandom(24).hex())
```

---

## 📊 Performance

### Optimization Tips

1. **Caching**: ใช้ Redis cache ผลลัพธ์ที่ query บ่อย
2. **CDN**: ใช้ CDN สำหรับ static files
3. **Connection Pooling**: ใช้ connection pool สำหรับ OpenAI API
4. **Load Balancing**: ใช้ Nginx load balancer สำหรับ multiple instances
5. **Monitoring**: ติดตั้ง monitoring tools (Prometheus, Grafana)

### Expected Performance

- **Response Time**: 2-5 วินาที (streaming)
- **Concurrent Users**: 10-50 users/instance
- **Memory Usage**: ~200-500MB/instance
- **CPU Usage**: 10-30% idle, 50-80% under load

---

## 🐛 Troubleshooting

### ปัญหาที่พบบ่อย

**1. OpenAI API Error**
```bash
Error: OPENAI_API_KEY not found
Solution: ตั้งค่า OPENAI_API_KEY ใน .env file
```

**2. Port Already in Use**
```bash
Error: Address already in use
Solution: เปลี่ยน PORT ใน .env หรือหยุด process ที่ใช้ port 8001
```

**3. Docker Build Failed**
```bash
Error: Docker build failed
Solution: ตรวจสอบ Dockerfile และ requirements.txt
```

**4. CORS Error**
```bash
Error: CORS policy blocked
Solution: ตรวจสอบ CORS middleware configuration
```

### Debug Mode

เปิด debug logging:

```python
logging.basicConfig(level=logging.DEBUG)
```

---

## 📈 Roadmap

### Version 2.0 (Upcoming)

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication & authorization
- [ ] Student progress tracking
- [ ] Custom exercise creation
- [ ] Multi-language support (English, Chinese)
- [ ] Mobile app (React Native)
- [ ] Voice interaction
- [ ] Gamification features
- [ ] Teacher dashboard
- [ ] Analytics & reporting

### Version 3.0 (Future)

- [ ] Offline mode
- [ ] AR/VR integration
- [ ] Collaborative learning rooms
- [ ] AI-generated exercises
- [ ] Adaptive learning paths
- [ ] Integration with LMS platforms

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow PEP 8 for Python code
- Use ESLint for JavaScript
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- OpenAI for GPT-5 API
- FastAPI framework
- KaTeX for LaTeX rendering
- Desmos for graphing calculator
- Thai Ministry of Education for curriculum standards
- All the great mathematicians who inspire this project

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/plama-math-assistant-fastapi/issues)
- **Email**: your.email@example.com
- **Documentation**: [Wiki](https://github.com/your-username/plama-math-assistant-fastapi/wiki)

---

## 🌟 Star History

If you find this project helpful, please give it a ⭐ on GitHub!

---

<div align="center">

**Made with ❤️ for Thai Education**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-username/plama-math-assistant-fastapi)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)

</div>
