🔗 URL Shortener Service

A scalable and production-ready URL Shortener built with Node.js, Express, and Redis, designed to handle high traffic with low latency and high availability.

🚀 Features

✅ Shorten long URLs into unique short links

✅ Redirect short URLs to original destination

✅ Custom alias support (optional)

✅ Expiration support (optional)

✅ Rate limiting

✅ Analytics (click count, timestamps, IP tracking)

✅ Redis caching for high performance

✅ Production-ready architecture

✅ Authenticaton and Authorizaton

🏗️ System Architecture
Client → Load Balancer → Node.js API → Redis Cache → Database
                                      ↓
                                   Analytics DB


Node.js + Express → REST API layer

Redis → Caching + rate limiting

Database (PostgreSQL / MongoDB) → Persistent storage

Load Balancer → Horizontal scaling

📦 Tech Stack
Layer	Technology
Backend	Node.js, Express
Database	PostgreSQL / MongoDB
Cache	Redis
Authentication	JWT
Deployment	Docker
CI/CD	GitHub Actions / Jenkins
⚙️ Installation
1️⃣ Clone the Repository
git clone https://github.com/your-username/url-shortner.git
cd url-shortner

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables

Create a .env file:

PORT=5000
BASE_URL=http://localhost:5000
DB_URL=your_database_connection_string
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key

4️⃣ Run the Application
npm run dev


Production:

npm start

📌 API Endpoints
🔹 Shorten URL
POST /api/url/shorten


Request Body

{
  "longUrl": "https://example.com/very/long/url"
}


Response

{
  "shortUrl": "http://localhost:5000/abc123"
}

🔹 Redirect
GET /:shortCode


Redirects user to original URL.

🔹 Get Analytics (Optional)
GET /api/url/:shortCode/stats


Returns:

{
  "clicks": 120,
  "createdAt": "2026-02-10T12:00:00Z"
}

🧠 Scaling Strategy

Use horizontal scaling (multiple Node.js instances)

Redis for high-speed reads

CDN for static responses

Database indexing on shortCode

Use Base62 encoding for short code generation

Rate limiting using Redis

🔐 Security Considerations

Input validation & sanitization

Prevent open redirect vulnerabilities

Rate limiting to prevent abuse

JWT authentication for admin APIs

HTTPS in production

Helmet for secure headers

🐳 Docker Support

Build image:

docker build -t url-shortner .


Run container:

docker run -p 5000:5000 url-shortner

🧪 Testing
npm test

📊 Future Improvements

QR code generation

Link expiration

Custom domains

Geo-based analytics

Admin dashboard

Distributed ID generation (Snowflake)

📈 Performance Goal

20k+ requests per second (with Redis + Horizontal Scaling)

Sub-10ms average redirect latency

👨‍💻 Author

Byas Paswan
Backend Developer (Node.js)
