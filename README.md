# 🌾 GramGrow – AI-Powered Farming Assistant

## 🧩 Problem Statement

Farmers often struggle to make timely and accurate decisions due to:

- ❌ Lack of real-time weather insights
- ❌ Limited knowledge of soil conditions
- ❌ No access to personalized crop advice
- ❌ Dependency on traditional guess-based farming

This leads to:

- Reduced crop yield 📉
- Increased costs 💸
- Poor resource utilization 💧

> 👉 There is a need for a smart, data-driven system that provides real-time, localized, and actionable farming insights.

---

## 🚀 Project Description

**GramGrow** is an AI-powered farming assistant that helps farmers make intelligent decisions based on:

- 📍 Location (GPS-based weather)
- 🌦️ Weather conditions
- 🧪 Soil data (moisture, pH)
- 🌾 Crop type

---

## ⚙️ How It Works

1. User selects crop and inputs soil data
2. App fetches real-time weather data
3. Rule engine analyzes farming conditions
4. AI generates smart insights
5. Results are displayed in a simple dashboard

---

## 🌟 Key Features

- 📊 Crop Health & Risk Scores
- 🔔 Smart Alerts (pest risk, heat stress, etc.)
- 💡 Actionable Recommendations
- 📅 Day-wise Next Steps
- 📈 Trend Analysis
- 🧑‍🌾 Farmer-friendly advice

---

## 💡 What Makes It Unique

- 🔥 Hybrid system (Rules + AI + KPIs)
- ⚡ Fast and real-time insights
- 📱 Mobile-first design
- 🌍 Hyperlocal farming intelligence

---

## 🤖 Google AI Usage

### 🛠️ Tools / Models Used

- Google Gemini 2.5 Flash
- LangChain (Prompt + Output Parsing)

### 🧠 How Google AI Was Used

Google Gemini AI is used as the core intelligence engine of the system. It processes structured farm data including:

- Weather data 🌦️
- Soil conditions 🧪
- Crop type 🌾
- Rule-based insights 📏
- Calculated KPIs 📊

The AI then generates:

- 📋 Summary of farm condition
- 🔔 Alerts (critical / warning / info)
- 💡 Recommendations (irrigation, fertilizer, pest control)
- 📈 Trend analysis
- 🧑‍🌾 Human-friendly farmer advice

> 👉 AI ensures responses are context-aware, personalized, and easy to understand.

### 📸 Proof of Google AI Usage

- 📱 [View Screenshots](https://drive.google.com/drive/folders/1ZIq7yFvBm4vD0s0SALtV5C8x-SDwpwnE?usp=sharing)
- 🎥 [Watch Demo](https://drive.google.com/drive/folders/1rMN2n3j3LCHoGIM7_DrFe29rwLQd5i7X?usp=sharing)

---

## 🧩 Tech Stack

### 📱 Frontend (Mobile App)

- React Native
- NativeWind (Tailwind CSS for React Native)
- Axios (API calls)
- AsyncStorage (local caching)
- React Navigation
- React Native Animated API

### 🌐 Backend (Server)

- Node.js
- Express.js
- Firebase Admin SDK (Firestore Database)

### 🤖 AI & Intelligence

- Google Gemini 2.5 Flash
- LangChain
- ChatPromptTemplate
- Output Parser

---

## ⚙️ Installation Steps

```bash
# Clone the repository
git clone https://github.com/Abinsonsuresh/built-with-ai-chn-lunnar-innovators

# Go to backend folder
cd GramGrowBackend

# Install backend dependencies
npm install

# Start backend server
npm run dev
```

```bash
# Frontend - React Native
cd ../GramGrow
npm install

# Run app
npx react-native run-android
# or
npx react-native run-ios
```
