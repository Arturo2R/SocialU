import create from 'zustand'
import { db } from './firebase'; // update with your path to firestore config
import { doc, setDoc } from "firebase/firestore";



export const useStore = create(set => ({
  count: 1,
  profileImage: "",
  valid: "unset",
  userName: "",
  displayName: "",
  uid: "",
  profileDescription: "",
  university: "",
}))
