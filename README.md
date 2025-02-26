# 🏃‍♂️ Where to Run? – AI-Based Running Route Recommender  

🚀 **Find the best running routes based on terrain, safety, elevation, and weather conditions.**  

- See website [here](https://frontend-service-369670867049.us-central1.run.app)

![Demo](https://your-image-or-gif-url.com) _(Currently creating demo, will be out by tomorrow)_  

---

## 📌 Overview  
"Where to Run?" is an **AI-powered running route recommender** that helps runners find the best routes based on their preferences. It integrates **Google Maps, OpenStreetMap, OpenWeather API**, and **AI-driven heuristics** to suggest the safest and most scenic routes.

---

## 🔄 How It Works (Basic Flow)  

1️⃣ **User enters location & running preferences** (distance, terrain, safety, elevation).  
2️⃣ **Back-end fetches route data** from OpenStreetMap, Strava, and Google Maps.  
3️⃣ **System filters & ranks routes** based on:  
   - **Terrain** (trail, pavement, mixed)  
   - **Elevation gain** (difficulty rating)  
   - **Weather conditions** (alerts for extreme weather)  
   - **Safety data** (traffic patterns, crime reports)  
4️⃣ **Routes are displayed on an interactive map**, with filtering options.  
5️⃣ **Users can bookmark, review, and share routes.**  

---

## 🛠 Tech Stack  

### **Deployment**
- **Google Cloud Build**: automate deployment
- **Google Cloud Run**: deploy dockerized images

### **Back-end (API & Data Processing)**  
- **Framework:** FastAPI (Python)  
- **APIs:**  
   - OpenStreetMap API (routes)  
   - Google Maps API (traffic & safety)  
   - OpenWeather API (weather conditions)
- **Cloud:** Google Cloud Functions (for real-time route ranking)  

### **Front-end (UI & Map Display)**  
- **Framework:** React (Next.js)  
- **Map Integration:** Google Maps (to display & filter routes)  
- **UI Components:** Tailwind CSS (for a modern & clean design)  

---

## 🌟 Enhancements Currently Being Implemented  
🔹 **Strava API Integration** – Sync runs & get route recommendations based on past activity.  
🔹 **AI Route Scoring** – Machine learning model predicts "run quality" based on feedback.  
🔹 **Social Sharing** – Users can submit and rate their own routes.  
🔹 **Live Weather Alerts** – Get warnings about bad weather before heading out.  
🔹 **Leaderboard/Gamification** – Track the most popular routes & let users earn badges.  

---

## License

- **MIT License**: Feel free to use, modify, and contribute!
