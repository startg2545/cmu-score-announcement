import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { getDatabase, ref, push, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCErm74Hl7vdHpkZLZGnQAGr1wZ_4fH88Y",
  authDomain: "cmu-score-announcement.firebaseapp.com",
  databaseURL: "https://cmu-score-announcement-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cmu-score-announcement",
  storageBucket: "cmu-score-announcement.appspot.com",
  messagingSenderId: "155378312589",
  appId: "1:155378312589:web:b6d01350041f1f935289c4",
  measurementId: "G-D54CXRG2Q3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const listRef = ref(db, 'posts');
const newListRef = push(listRef)
set(newListRef, {

})

function Firebase() {
  return (
    <div >
    
    </div>
  );
}

export default Firebase;
