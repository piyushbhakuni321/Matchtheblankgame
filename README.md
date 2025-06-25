# Cognitii Matching Game - React Native App

This is a **React Native game** developed as part of a Cognitii interview assignment. The game is built using Expo and Firebase Firestore. The goal is to match the correct labels with their corresponding images. It includes:
- Image/Label matching interaction
- Real-time line drawing with SVG
- Firebase Firestore integration to store scores
- Initial, Game, and Success screens

---

## 🔥 Features

- 🔄 Matching game logic with React Native
- ⏱ Tracks time taken and correct/incorrect answers
- ☁️ Firebase Firestore backend integration
- 🖼 Local asset usage (bonus task to load from server is mentioned below)
- ✅ Initial & Success screens to complete game flow

---

## 📽 Demo Video

👉 [Watch Demo](https://github.com/yourusername/cognitii-game/assets/demo-video.mp4)

---

## 🖼 Screenshots

### 🔥 Firebase Firestore Data
![image](https://github.com/user-attachments/assets/b92744e9-58f4-4b2d-b699-f8c6a6e83c8f)

---

## 🛠 Tech Stack

- React Native (Expo)
- Firebase Firestore (Backend)
- SVG for line drawing (`react-native-svg`)
- Images currently loaded from **local assets folder**

---

## 🧪 Bonus Part (Planned / Optional)

- **Current**: Images are stored locally using `require('./assets/image.png')`
- **Bonus (Optional Enhancement)**: Can be enhanced to load images from a public server or Firebase Storage using URLs like:
  ```jsx
  <Image source={{ uri: 'https://example.com/images/apple.png' }} />
