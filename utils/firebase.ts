import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgVFvJatH-mgTu8Ln1WxsNq-Dc4Yrfu3s",
  authDomain: "mint-count.firebaseapp.com",
  projectId: "mint-count",
  storageBucket: "mint-count.appspot.com",
  messagingSenderId: "888246804351",
  appId: "1:888246804351:web:e98a0f0f844af61bfa044a"
};

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore();

export const incrementMintCount = async (currentValue: number) => {
    setDoc(doc(firestore, "collection", "count"), {
        max: 10, // MAX should not be hardcoded
        remaining: currentValue,
    })
}