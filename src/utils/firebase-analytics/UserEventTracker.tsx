// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAoVFpjdSa484vsWFjUbRLZ8BUZBnaXqhQ',
  authDomain: 'eeji-13404.firebaseapp.com',
  projectId: 'eeji-13404',
  storageBucket: 'eeji-13404.appspot.com',
  messagingSenderId: '904612029821',
  appId: '1:904612029821:web:774b19993026c40e23d814',
  measurementId: 'G-9DFSWCZ0PL',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

const UserEventTracker = () => {
  return analytics
}

export default UserEventTracker
