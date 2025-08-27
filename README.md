# 📸 **Dobbt** 
### *Modern Image Management Platform*

![Dobbt Hero](./frontend/public/Landing.png)

**A beautiful, powerful, and intuitive image management platform for organizing your digital memories**

---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Powered-orange.svg?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=for-the-badge&logo=typescript)](https://typescriptlang.org/)

[🚀 **Live Demo**](https://pictura-1.onrender.com/) •
---

## 🌟 **Why Choose Dobbt?**

<table>
<tr>
<td width="50%">

### 🎯 **Key Highlights**
- 🚀 **Lightning Fast** - Optimized performance
- 🎨 **Beautiful UI** - Modern, intuitive design
- 🔒 **Secure** - Your data stays private
- 📱 **Responsive** - Works on all devices
- 🌙 **Dark Mode** - Easy on the eyes
- 💡 **Smart Search** - Find images instantly

</td>
<td width="50%">

### 📊 **Quick Stats**
- ⚡ **Upload Speed**: < 2 seconds
- 🗂️ **Folder Limit**: Unlimited
- 🏷️ **Tag Support**: Advanced tagging
- 📱 **Mobile Ready**: 100% responsive
- 🔄 **Auto Sync**: Real-time updates
- ☁️ **Cloud Storage**: Reliable & secure

</td>
</tr>
</table>

---

## 🖼️ **Screenshots Gallery**

<div align="center">

### 🎯 **Landing Page**
*Beautiful hero section with compelling call-to-action*
<br><br>
<img src="./frontend/public/Landing.png" alt="Landing Page" width="800" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

<br><br>

### 🔐 **Authentication**
*Secure and elegant sign-in experience*
<br><br>
<img src="./frontend/public/Login.png" alt="Sign In Page" width="800" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

<br><br>

### 🏠 **Dashboard**
*Clean, organized dashboard with personalized welcome and folder overview*
<br><br>
<img src="./frontend/public/Dashboard.png" alt="Dashboard" width="800" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

<br><br>

### 📁 **Folder Management**
*Beautiful color-coded folders with subfolders and image organization*
<br><br>
<img src="./frontend/public/Create-folder.png" alt="Folder Management" width="800" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

<br><br>

### 📤 **Upload Interface**
*Intuitive drag & drop upload with folder selection and file management*
<br><br>
<img src="./frontend/public/Upload-folder.png" alt="Upload Modal" width="800" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

</div>

---

## ✨ **Feature Showcase**

<details>
<summary><b>🖼️ Smart Image Management</b></summary>

- **🎯 Drag & Drop Upload** - Effortlessly upload multiple images with intuitive interface
- **📁 Nested Folders** - Create organized folder hierarchies with custom colors
- **🏷️ Advanced Tagging** - Tag images for quick categorization and retrieval
- **🔍 Powerful Search** - Find images by name, tags, or metadata
- **📋 Bulk Operations** - Select and manage multiple images simultaneously
- **📊 Image Analytics** - View detailed metadata and statistics

</details>

<details>
<summary><b>🎨 Beautiful User Interface</b></summary>

- **🎭 Modern Design** - Clean, minimalist interface with smooth animations
- **🌓 Theme Switching** - Dark/Light mode with system preference detection
- **📱 Responsive Layout** - Perfect experience across all device sizes
- **🔲 Multiple Views** - Switch between grid, list, and masonry layouts
- **🎯 Intuitive Navigation** - Easy-to-use interface with logical flow
- **⚡ Smooth Animations** - Delightful micro-interactions throughout

</details>

<details>
<summary><b>🔐 Security & Privacy</b></summary>

- **🔑 JWT Authentication** - Secure token-based authentication system
- **🛡️ Data Encryption** - Your images and data are fully encrypted
- **☁️ Cloud Storage** - Reliable backup powered by Cloudinary CDN
- **🔒 Private by Default** - Your content is completely private
- **🚫 No Data Mining** - We never access or analyze your images
- **✅ GDPR Compliant** - Full compliance with privacy regulations

</details>

<details>
<summary><b>🚀 Performance Features</b></summary>

- **⚡ Lightning Fast** - Optimized loading with image compression
- **💾 Smart Caching** - Intelligent caching for faster load times
- **📱 Offline Support** - Basic functionality works offline
- **🔄 Auto-backup** - Automatic cloud synchronization
- **📈 Scalable** - Handles thousands of images efficiently
- **🎯 Lazy Loading** - Images load as you scroll for better performance

</details>

---

## 🚀 **Quick Start Guide**

### 📋 **Prerequisites**

<table>
<tr>
<td><b>Node.js</b></td>
<td>v18.0.0 or higher</td>
<td><a href="https://nodejs.org/">Download</a></td>
</tr>
<tr>
<td><b>MongoDB</b></td>
<td>v6.0.0 or higher</td>
<td><a href="https://mongodb.com/">Download</a></td>
</tr>
<tr>
<td><b>Package Manager</b></td>
<td>npm or yarn</td>
<td>Included with Node.js</td>
</tr>
</table>

### ⚡ **Installation**

```bash
# 1️⃣ Clone the repository
git clone https://github.com/yourusername/dobbt.git
cd dobbt

# 2️⃣ Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# 3️⃣ Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# 4️⃣ Start development servers
npm run dev
```

### 🔧 **Environment Configuration**

Create `backend/.env` file:

```env
# 🗄️ Database Configuration
MONGODB_URI=mongodb://localhost:27017/dobbt

# 🔐 JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_make_it_very_long_and_secure_dobbt_2024
JWT_EXPIRE=30d

# ☁️ Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# 🌐 Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env` file:

```env
# 🌐 API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Dobbt
```

For production deployment, create `frontend/.env.production`:

```env
# 🌐 Production API Configuration
VITE_API_URL=https://your-backend-app-name.onrender.com/api
VITE_APP_NAME=Dobbt
```

### 🚀 **Deployment on Render**

#### Backend Deployment:
1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Set the following environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string (use a password generator)
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render's default)
   - `CLIENT_URL`: `https://your-frontend-app-name.onrender.com`

#### Frontend Deployment:
1. Create a new **Static Site** on Render
2. Connect your GitHub repository
3. Set **Root Directory**: `frontend`
4. Set **Build Command**: `npm run build`
5. Set **Publish Directory**: `dist`
6. Add environment variable:
   - `VITE_API_URL`: `https://your-backend-app-name.onrender.com/api`

#### Important Notes:
- Deploy backend first, then update frontend environment with backend URL
- Update CORS origins in backend server.js with your actual frontend URL
- Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) for Render

#### CORS Configuration:
After deployment, update your backend `server.js` to include your production URLs:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend-app-name.onrender.com', // Add your actual frontend URL
  process.env.CLIENT_URL
].filter(Boolean);
```

### 🎉 **Launch**

Once everything is set up, navigate to `http://localhost:5173` and start organizing your images! 

---

## 📂 **Project Architecture**

```
📁 dobbt/
┣ 📁 backend/                 # 🖥️ Node.js + Express Server
┃ ┣ 📁 config/               # ⚙️ Configuration files
┃ ┣ 📁 controllers/          # 🎮 Route controllers
┃ ┣ 📁 middleware/           # 🛡️ Custom middleware
┃ ┣ 📁 models/               # 📊 MongoDB models
┃ ┣ 📁 routes/               # 🛣️ API routes
┃ ┣ 📁 uploads/              # 📤 Temporary uploads
┃ ┣ 📄 .env                  # 🔐 Environment variables
┃ ┣ 📄 server.js             # 🚀 Backend entry point
┃ ┗ 📄 package.json          # 📦 Backend dependencies
┃
┣ 📁 frontend/                # ⚛️ React Application
┃ ┣ 📁 public/               # 🌐 Public assets & screenshots
┃ ┃ ┣ 📷 Landing.png
┃ ┃ ┣ 📷 Login.png
┃ ┃ ┣ 📷 Dashboard.png
┃ ┃ ┣ 📷 Create-folder.png
┃ ┃ ┗ 📷 Upload-folder.png
┃ ┣ 📁 src/                  # 💻 Source code
┃ ┣ 📄 .env                  # ⚙️ Frontend config
┃ ┣ 📄 index.html            # 📄 Main HTML file
┃ ┣ 📄 App.js                # ⚛️ Main React component
┃ ┗ 📄 package.json          # 📦 Frontend dependencies
┃
┣ 📁 data/                   # 🗄️ Local MongoDB data
┃ ┗ 📁 db/                   # 💾 Database files
┃
┣ 📄 .gitignore              # 🚫 Ignored files
┗ 📄 README.md               # 📖 This file
```

---

## 🛠️ **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 Start both frontend and backend in development mode |
| `npm run build` | 📦 Build production version |
| `npm run start` | ▶️ Start production server |
| `npm run test` | 🧪 Run test suite |
| `npm run lint` | 🔍 Check code quality |

---

## 🤝 **Contributing**

We welcome contributions from the community! Here's how you can help:

<div align="center">


</div>

### 🔄 **How to Contribute**

1. **🍴 Fork** the repository
2. **🌿 Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **💾 Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **📤 Push** to the branch (`git push origin feature/AmazingFeature`)
5. **📬 Open** a Pull Request

### 📝 **Contribution Guidelines**

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation when needed

---

## 📄 **License**

<div align="center">

**MIT License** - see the [LICENSE](LICENSE) file for details

*Feel free to use this project for personal or commercial purposes*

</div>

---

## 🙏 **Acknowledgments**

<div align="center">

**Built with ❤️ by the Dobbt Team**

*Special thanks to all contributors and the open-source community*

---

### 🌟 **Star this repository if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/dobbt?style=social)](https://github.com/yourusername/dobbt/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/dobbt?style=social)](https://github.com/yourusername/dobbt/network/members)

</div>

---

<div align="center">

**[⬆ Back to Top](#-dobbt)**

</div>
