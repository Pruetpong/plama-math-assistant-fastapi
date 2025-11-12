# 🚢 PLAMA Deployment Guide - Hostinger VPS Docker Hosting

คู่มือการ deploy แอปพลิเคชัน PLAMA บน Hostinger VPS โดยใช้ Docker

---

## 📋 สารบัญ

1. [ข้อกำหนดเบื้องต้น](#ข้อกำหนดเบื้องต้น)
2. [เตรียม Hostinger VPS](#เตรียม-hostinger-vps)
3. [ติดตั้ง Docker และ Docker Compose](#ติดตั้ง-docker-และ-docker-compose)
4. [Clone Repository](#clone-repository)
5. [ตั้งค่า Environment Variables](#ตั้งค่า-environment-variables)
6. [Build และ Deploy ด้วย Docker](#build-และ-deploy-ด้วย-docker)
7. [ตั้งค่า Nginx Reverse Proxy](#ตั้งค่า-nginx-reverse-proxy)
8. [ติดตั้ง SSL Certificate (Let's Encrypt)](#ติดตั้ง-ssl-certificate-lets-encrypt)
9. [การจัดการ Docker Container](#การจัดการ-docker-container)
10. [Monitoring และ Logging](#monitoring-และ-logging)
11. [Backup และ Restore](#backup-และ-restore)
12. [Troubleshooting](#troubleshooting)

---

## 🔧 ข้อกำหนดเบื้องต้น

### ฝั่ง Local
- ✅ Git installed
- ✅ OpenAI API Key ([Get it here](https://platform.openai.com/api-keys))
- ✅ SSH client (Terminal, PuTTY, etc.)

### ฝั่ง Hostinger VPS
- ✅ Hostinger VPS plan (KVM 1 หรือสูงกว่า)
- ✅ Ubuntu 20.04/22.04 LTS (แนะนำ)
- ✅ RAM: อย่างน้อย 2GB (แนะนำ 4GB+)
- ✅ Storage: อย่างน้อย 20GB
- ✅ Root access หรือ sudo privileges

---

## 🖥️ เตรียม Hostinger VPS

### 1. เชื่อมต่อ VPS ผ่าน SSH

```bash
ssh root@your-vps-ip-address
# หรือ
ssh username@your-vps-ip-address
```

### 2. Update System

```bash
# Update package list
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git vim htop net-tools
```

### 3. สร้าง User ใหม่ (แนะนำ - สำหรับ security)

```bash
# สร้าง user ใหม่
sudo adduser plama

# เพิ่ม sudo privileges
sudo usermod -aG sudo plama

# Switch to new user
su - plama
```

### 4. ตั้งค่า Firewall (UFW)

```bash
# Enable UFW
sudo ufw enable

# Allow SSH (สำคัญ! ห้ามลืม)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Allow custom port (ถ้าใช้)
sudo ufw allow 8001/tcp

# Check status
sudo ufw status
```

---

## 🐳 ติดตั้ง Docker และ Docker Compose

### 1. ติดตั้ง Docker

```bash
# Remove old versions (if any)
sudo apt remove docker docker-engine docker.io containerd runc

# Install prerequisites
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker --version
```

### 2. ตั้งค่า Docker (Post-installation)

```bash
# Add current user to docker group
sudo usermod -aG docker $USER

# Activate changes
newgrp docker

# Test Docker without sudo
docker run hello-world

# Enable Docker to start on boot
sudo systemctl enable docker
sudo systemctl start docker
```

### 3. ติดตั้ง Docker Compose

```bash
# Docker Compose มาพร้อม Docker Engine แล้ว (v2)
docker compose version

# ถ้าต้องการใช้ docker-compose (v1) แบบเก่า
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

---

## 📦 Clone Repository

### 1. Clone Project จาก GitHub

```bash
# Navigate to home directory
cd ~

# Clone repository
git clone https://github.com/your-username/plama-math-assistant-fastapi.git

# Enter project directory
cd plama-math-assistant-fastapi

# Check files
ls -la
```

### 2. ตรวจสอบไฟล์ที่จำเป็น

```bash
# ควรมีไฟล์เหล่านี้
ls -1
# app.py
# requirements.txt
# Dockerfile
# docker-compose.yml
# .env.example
# .dockerignore
# README.md
# DEPLOYMENT.md
```

---

## 🔐 ตั้งค่า Environment Variables

### 1. สร้างไฟล์ .env

```bash
# Copy from example
cp .env.example .env

# Edit .env file
nano .env
# หรือ
vim .env
```

### 2. กรอกข้อมูล Environment Variables

```env
# OpenAI API Key (สำคัญ!)
OPENAI_API_KEY=sk-proj-your-actual-openai-api-key-here

# Flask Secret Key (generate random string)
FLASK_SECRET_KEY=your-super-secret-random-string-here

# Server Configuration
PORT=8001
HOST=0.0.0.0

# Environment
APP_ENV=production
LOG_LEVEL=INFO
```

### 3. สร้าง Secret Key

```bash
# วิธีที่ 1: ใช้ Python
python3 -c "import os; print(os.urandom(24).hex())"

# วิธีที่ 2: ใช้ OpenSSL
openssl rand -hex 24

# นำ output มาใส่ใน FLASK_SECRET_KEY
```

### 4. ตรวจสอบและรักษาความปลอดภัย

```bash
# ตรวจสอบว่า .env มี API key แล้ว
cat .env | grep OPENAI_API_KEY

# ตั้งค่า permissions
chmod 600 .env

# ห้าม commit .env เข้า git!
echo ".env" >> .gitignore
```

---

## 🚀 Build และ Deploy ด้วย Docker

### 1. Build Docker Image

```bash
# Build image
docker build -t plama-math-assistant .

# ตรวจสอบ image ที่สร้าง
docker images | grep plama
```

### 2. Test รัน Container (ทดสอบก่อน)

```bash
# Run container แบบทดสอบ
docker run -d \
  --name plama-test \
  -p 8001:8001 \
  --env-file .env \
  plama-math-assistant

# ตรวจสอบ logs
docker logs -f plama-test

# Test เข้าถึง
curl http://localhost:8001/

# หยุดและลบ container ทดสอบ
docker stop plama-test
docker rm plama-test
```

### 3. Deploy ด้วย Docker Compose (แนะนำ)

```bash
# Start services
docker compose up -d

# ตรวจสอบสถานะ
docker compose ps

# ดู logs
docker compose logs -f

# ดู logs แบบ real-time (ใช้ Ctrl+C เพื่อออก)
docker compose logs -f plama
```

### 4. ตรวจสอบการทำงาน

```bash
# Check container status
docker ps

# Check logs
docker compose logs plama

# Test API
curl http://localhost:8001/
curl http://localhost:8001/api/chatbots

# Test from external (ใช้ IP ของ VPS)
curl http://your-vps-ip:8001/
```

---

## 🌐 ตั้งค่า Nginx Reverse Proxy

### 1. ติดตั้ง Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### 2. สร้าง Nginx Configuration

```bash
# สร้างไฟล์ config
sudo nano /etc/nginx/sites-available/plama
```

**เนื้อหาไฟล์ (ไม่มี SSL ก่อน):**

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    # หรือใช้ IP ถ้าไม่มี domain: server_name your-vps-ip;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeout settings for streaming
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static files (optional optimization)
    location /static/ {
        proxy_pass http://localhost:8001/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Enable Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/plama /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 4. ทดสอบผ่าน Domain/IP

```bash
# Test from server
curl http://your-domain.com
# หรือ
curl http://your-vps-ip

# Test from browser
# เปิด: http://your-domain.com/app
```

---

## 🔒 ติดตั้ง SSL Certificate (Let's Encrypt)

### 1. ติดตั้ง Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

### 2. ขอ SSL Certificate

```bash
# ต้องมี domain ชี้มาที่ VPS ก่อน!
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# ตอบคำถาม:
# - Email address: your-email@example.com
# - Agree to Terms: Yes (Y)
# - Redirect HTTP to HTTPS: Yes (2)
```

### 3. Auto-renewal Setup

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot จะ auto-renew ทุก 12 ชั่วโมง
# ตรวจสอบ timer
sudo systemctl status certbot.timer
```

### 4. Nginx Config จะถูกอัปเดตอัตโนมัติ

```bash
# ตรวจสอบ config ที่อัปเดต
sudo cat /etc/nginx/sites-available/plama

# จะมี SSL configuration เพิ่มเข้ามา
# - listen 443 ssl
# - ssl_certificate
# - ssl_certificate_key
```

### 5. ทดสอบ HTTPS

```bash
# Test from command line
curl https://your-domain.com

# Test SSL grade
# เข้า: https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com
```

---

## 🎛️ การจัดการ Docker Container

### Start/Stop Services

```bash
# Start
docker compose up -d

# Stop
docker compose down

# Restart
docker compose restart

# Restart specific service
docker compose restart plama
```

### View Logs

```bash
# All logs
docker compose logs

# Follow logs (real-time)
docker compose logs -f

# Last 100 lines
docker compose logs --tail=100

# Specific service
docker compose logs plama
```

### Update Application

```bash
# Pull latest code from GitHub
git pull origin main

# Rebuild and restart
docker compose down
docker compose build --no-cache
docker compose up -d

# Or use one command
docker compose up -d --build
```

### Remove Containers and Images

```bash
# Stop and remove containers
docker compose down

# Remove with volumes
docker compose down -v

# Remove unused images
docker image prune -a

# Clean everything
docker system prune -a --volumes
```

---

## 📊 Monitoring และ Logging

### 1. ตรวจสอบ Resource Usage

```bash
# Docker stats
docker stats

# System resources
htop
# หรือ
top

# Disk usage
df -h
du -sh /var/lib/docker/
```

### 2. Application Logs

```bash
# Real-time logs
docker compose logs -f plama

# Save logs to file
docker compose logs plama > plama-logs-$(date +%Y%m%d).log

# Search logs
docker compose logs plama | grep ERROR
docker compose logs plama | grep "OpenAI"
```

### 3. Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log

# Search for errors
sudo grep -i error /var/log/nginx/error.log
```

### 4. ติดตั้ง Monitoring Tools (Optional)

```bash
# Install ctop (Container monitoring)
sudo wget https://github.com/bcicen/ctop/releases/download/v0.7.7/ctop-0.7.7-linux-amd64 -O /usr/local/bin/ctop
sudo chmod +x /usr/local/bin/ctop
ctop
```

---

## 💾 Backup และ Restore

### 1. Backup Application

```bash
# Create backup directory
mkdir -p ~/backups

# Backup code
cd ~
tar -czf backups/plama-app-$(date +%Y%m%d).tar.gz plama-math-assistant-fastapi/

# Backup .env file
cp plama-math-assistant-fastapi/.env backups/.env-$(date +%Y%m%d)

# List backups
ls -lh ~/backups/
```

### 2. Backup Docker Images

```bash
# Save Docker image
docker save plama-math-assistant:latest | gzip > ~/backups/plama-image-$(date +%Y%m%d).tar.gz

# List images
docker images
```

### 3. Restore from Backup

```bash
# Stop current application
cd ~/plama-math-assistant-fastapi
docker compose down

# Restore code
cd ~
tar -xzf backups/plama-app-20240101.tar.gz

# Restore .env
cp backups/.env-20240101 plama-math-assistant-fastapi/.env

# Restart application
cd plama-math-assistant-fastapi
docker compose up -d
```

### 4. Automated Backup Script

```bash
# Create backup script
nano ~/backup-plama.sh
```

**เนื้อหา script:**

```bash
#!/bin/bash
BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d-%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application
cd ~
tar -czf $BACKUP_DIR/plama-app-$DATE.tar.gz plama-math-assistant-fastapi/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "plama-app-*.tar.gz" -mtime +7 -delete

echo "Backup completed: plama-app-$DATE.tar.gz"
```

```bash
# Make executable
chmod +x ~/backup-plama.sh

# Test backup
~/backup-plama.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
# 0 2 * * * /home/plama/backup-plama.sh >> /home/plama/backup.log 2>&1
```

---

## 🔧 Troubleshooting

### ปัญหา 1: Container ไม่สามารถ Start

```bash
# ตรวจสอบ logs
docker compose logs plama

# ตรวจสอบ port conflict
sudo netstat -tulpn | grep 8001
sudo lsof -i :8001

# Kill process ที่ใช้ port
sudo kill -9 $(sudo lsof -t -i:8001)

# Restart
docker compose down
docker compose up -d
```

### ปัญหา 2: OpenAI API Error

```bash
# ตรวจสอบ .env file
cat .env | grep OPENAI_API_KEY

# ตรวจสอบว่า container ได้รับ env variable
docker compose exec plama env | grep OPENAI

# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### ปัญหา 3: Nginx 502 Bad Gateway

```bash
# ตรวจสอบว่า container ทำงาน
docker ps

# ตรวจสอบ port
curl http://localhost:8001/

# Restart Nginx
sudo systemctl restart nginx

# ตรวจสอบ Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### ปัญหา 4: Disk Space Full

```bash
# ตรวจสอบ disk usage
df -h

# ลบ Docker resources ที่ไม่ใช้
docker system prune -a --volumes

# ลบ old logs
sudo journalctl --vacuum-time=7d
```

### ปัญหา 5: SSL Certificate Error

```bash
# ตรวจสอบ certificate
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### ปัญหา 6: Out of Memory

```bash
# Check memory
free -h

# Check Docker memory
docker stats

# Restart container with memory limit
docker compose down
# Edit docker-compose.yml: add memory limit
docker compose up -d

# Or upgrade VPS plan
```

### ปัญหา 7: Slow Performance

```bash
# Check CPU/Memory
htop

# Check Docker resources
docker stats

# Optimize Gunicorn workers (in Dockerfile)
# --workers = (2 × CPU cores) + 1

# Add Redis caching (future enhancement)
# Add CDN for static files
```

---

## 📝 Maintenance Checklist

### รายวัน
- [ ] ตรวจสอบ application logs
- [ ] ตรวจสอบ container status
- [ ] Monitor resource usage

### รายสัปดาห์
- [ ] Review Nginx logs
- [ ] Check disk space
- [ ] Test backup restore
- [ ] Update packages: `sudo apt update && sudo apt upgrade`

### รายเดือน
- [ ] Review SSL certificates
- [ ] Check security updates
- [ ] Optimize Docker images
- [ ] Review and clean old backups
- [ ] Performance testing
- [ ] Security audit

---

## 🎯 Best Practices

### Security
1. ใช้ non-root user
2. ตั้งค่า UFW firewall
3. เปิดเฉพาะ port ที่จำเป็น
4. ใช้ HTTPS (SSL/TLS)
5. เก็บ API keys ใน environment variables
6. Regular security updates

### Performance
1. ใช้ Nginx reverse proxy
2. Enable caching
3. Optimize Docker images (multi-stage build)
4. Monitor resource usage
5. Scale horizontally (multiple containers)

### Reliability
1. Auto-restart containers
2. Regular backups
3. Health checks
4. Monitoring และ alerting
5. Load balancing (สำหรับ high traffic)

---

## 🆘 Getting Help

### Official Resources
- **PLAMA Documentation**: [README.md](README.md)
- **Docker Documentation**: https://docs.docker.com
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Hostinger Support**: https://www.hostinger.com/tutorials/

### Community
- **GitHub Issues**: [Create an issue](https://github.com/your-username/plama-math-assistant-fastapi/issues)
- **Stack Overflow**: Tag `fastapi`, `docker`, `nginx`

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] Code tested locally
- [ ] Environment variables prepared
- [ ] OpenAI API key obtained
- [ ] Domain name configured (optional)
- [ ] VPS purchased and accessible

### During Deployment
- [ ] VPS connected via SSH
- [ ] System updated
- [ ] Docker installed
- [ ] Repository cloned
- [ ] .env file configured
- [ ] Docker containers running
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Firewall configured

### After Deployment
- [ ] Application accessible
- [ ] HTTPS working
- [ ] Logs reviewed
- [ ] Backup configured
- [ ] Monitoring setup
- [ ] Documentation updated

---

## 🎉 สรุป

คุณได้ deploy PLAMA สำเร็จบน Hostinger VPS แล้ว! 🚀

**URL ในการเข้าถึง:**
- HTTP: `http://your-domain.com/app`
- HTTPS: `https://your-domain.com/app`

**คำสั่งที่ใช้บ่อย:**
```bash
# View logs
docker compose logs -f plama

# Restart application
docker compose restart plama

# Update application
git pull && docker compose up -d --build

# Backup
~/backup-plama.sh
```

**Happy Teaching! 🧮📚✨**

---

<div align="center">

**Made with ❤️ for Thai Education**

[⬆ Back to Top](#-plama-deployment-guide---hostinger-vps-docker-hosting)

</div>
