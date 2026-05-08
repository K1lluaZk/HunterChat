# <p align="center">🏹 HunterChat — Real-Time Messaging</p>
<p align="center"> A modern, fast, and minimalist real-time messaging application built for seamless and scalable conversations. </p> <p align="center"> <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5"> <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript"> <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js"> <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" alt="Express"> <img src="https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socketdotio&logoColor=white" alt="Socket.IO"> <img src="https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white" alt="SQLite"> <img src="https://img.shields.io/badge/Turso-4FF8D2?style=flat&logo=turso&logoColor=black" alt="Turso"> </p>



---

### 🎮 About The Project

**HunterChat** is a full-stack real-time messaging platform built for educational purposes. Unlike basic chat scripts, this project explores the fundamentals of **WebSockets** for bi-directional communication and integrates a **LibSQL (Turso)** edge database for message persistence. The core objective is to provide a seamless user experience with high-speed delivery and a clean, responsive interface.

### ✨ Key Features

* **⚡ Real-Time Bi-Directional Streaming:** Powered by Socket.io, allowing messages to be sent and received instantly without page refreshes.
* **📩 Nested Reply System:** Advanced UI logic that allows users to reply to specific messages, maintaining context in fast-moving conversations.
* **🛡️ Secure Message Persistence:** Integration with Turso DB to store chat history, ensuring that messages remain available even after server restarts.
* **🔍 Extended Message Metadata:** Contextual menu system (Right-click or Long-press) to inspect technical details such as Unique IDs, exact timestamps, and author data.
* **🎨 Modern Responsive UI:** A dark-themed, mobile-first interface built with Tailwind CSS, featuring smooth animations and Lucide icon integration.
* **🗑️ Management Tools:** Capability for users to delete their own messages with synchronized removal across all connected clients.

### 🛠️ Technologies Used

* **Frontend:** HTML5, Tailwind CSS (Custom scrollbars & glassmorphism), Lucide Icons.
* **Client Logic:** Vanilla JavaScript (ES6+), Socket.io-client.
* **Backend:** Node.js with Express for serving static files and API handling.
* **Real-time Engine:** Socket.io for WebSocket management.
* **Database:** Turso (LibSQL) for efficient, distributed data storage.

### 🚀 How to Run Locally

1. **Clone the repository:**

```bash
git clone https://github.com/K1lluaZk/HunterChat.git

```

2. **Install dependencies:**

```bash
npm install

```

3. **Environment Configuration:**

* Create a `.env` file in the root directory.
* Add your Turso credentials:

```env
TURSO_AUTH_TOKEN=your_token_here
TURSO_DATABASE_URL=your_url_here

```

4. **Launch the application:**

```bash
npm start

```

### 📁 Project Structure

```text
├── client/                 # Frontend assets
│   └── index.html          # Main Chat UI & Socket client logic
├── server/                 # Backend source code
│   └── index.js            # Express server, Socket.io logic & Turso config
├── .env                    # Environment variables (Private)
├── .gitignore              # Files excluded from Git
├── package.json            # Project dependencies and scripts
└── README.md               # Documentation

```

### ✍️ Author

**Mario Suero (K1lluaZk)** - [GitHub Profile]()

### 📄 License

This project is open-source and available under the **MIT License**.
