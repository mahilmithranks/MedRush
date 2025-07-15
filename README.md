# 🩺 MedRush AI — AI-Powered 3D Emergency Medicine Delivery Platform

**MedRush AI** is an AI-powered platform that offers real-time emergency medicine delivery with a futuristic 3D web interface. Users can upload prescriptions, chat with an AI assistant, locate nearby open pharmacies, and track delivery progress — all through an immersive experience. The platform works seamlessly on both web and mobile.

---

## 🚀 Key Features

### 👤 For Users (Web & App)
- 📄 Upload prescriptions via drag-and-drop or file input
- 🤖 Chat with an AI capsule assistant (GPT-powered)
- 🗺️ Real-time 3D map of pharmacies with availability
- ✅ Mandatory pharmacist verification before order
- 🚚 Track delivery in real-time with 3D bike/drone
- 📦 Dashboard with order history and status

### 🏪 For Pharmacy Owners
- 📍 Toggle open/closed status (live map updates)
- 💊 Manage stock availability and delivery radius
- 🧾 View prescriptions, approve or reject orders
- ✅ Upload pharmacist approval photo/document

---

## 🧠 AI & Tech Stack

| Functionality          | Tool / Service Used                   |
|------------------------|----------------------------------------|
| 3D UI                  | React Three Fiber + Drei + Tailwind   |
| AI Chatbot             | OpenAI GPT-4 API                      |
| OCR                    | Tesseract.js or Google Vision         |
| Authentication         | Firebase Auth / Clerk                 |
| Real-time Sync         | Firebase Firestore / Socket.IO        |
| Mapping                | Google Maps API + 3D overlay          |
| Backend                | Express.js + MongoDB                  |
| Delivery Visuals       | GLTF models with animation in R3F     |

---

## 🧾 Unified Experience: Web & App

| Platform       | Feature Available |
|----------------|-------------------|
| Web            | ✅ Full access     |
| Mobile App     | ✅ Full access     |

> All users, whether on mobile or web, can upload prescriptions, chat with the AI, get pharmacist approval, and place orders.

---

## 🗃 Folder Structure

```
MedRush-AI/
├── client/                      # React + R3F frontend
│   ├── canvas/                  # 3D scenes (map, chatbot, delivery)
│   ├── components/              # UI components & wrappers
│   ├── pages/                   # Routes (home, request, track)
│   ├── hooks/                   # Auth, Firestore
│   ├── utils/                   # OCR, AI, Maps
│   └── App.jsx
│
├── server/                      # Node.js backend
│   ├── routes/                  # API routes
│   ├── models/                  # MongoDB models (User, Request, Pharmacy)
│   ├── controllers/             # Logic for orders & verification
│   ├── services/                # OCR, AI, Pharmacy matcher
│   └── server.js
│
├── firebase/                    # Firestore configs & listeners
├── public/                      # 3D assets and static files
├── .env
└── README.md
```

---

## 🌐 Flow Summary

1. User uploads prescription (image file)
2. AI chatbot assists if needed
3. Pharmacist reviews and approves request
4. System matches best pharmacy (open, near, stocked)
5. Order confirmed → Delivery assigned
6. User tracks delivery with 3D animation

---

## 📦 API Sample

```bash
POST /api/auth/register                # Register user or pharmacy
POST /api/auth/login                   # Login
POST /api/medicinerequest              # Create emergency request
PATCH /api/request/:id/verify          # Pharmacist approves
GET  /api/pharmacies                   # List nearby pharmacies
POST /api/ocr                          # Extract data from prescription
POST /api/chatbot                      # AI medicine assistant
```

---

## 📸 UI Components to Include

- 3D Homepage with floating pharmacies
- Animated Chatbot Capsule
- Drag & Drop Rx Upload folder
- Pharmacist approval popup
- Delivery Tracking with bike/drone GLTF models

---

## 📅 Milestone Timeline

| Week | Goal                                      |
|------|-------------------------------------------|
| 1    | Setup Frontend + Backend + Auth           |
| 2    | Integrate OCR + Chatbot + Rx Upload       |
| 3    | Real-time pharmacy map + order system     |
| 4    | 3D delivery animation + polish + deploy   |

---

## 📜 License

Licensed under the MIT License.

---

## 🤝 Contributions

All contributions are welcome. Please fork and open a PR with your improvements or ideas.

---

## ✉️ Contact

Project by **Mahil Mithran K.S.**  
Reach out: `mahilmithranks2007@gmail.com`
