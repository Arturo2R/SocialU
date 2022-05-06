import create from 'zustand'
import { db } from './firebase'; // update with your path to firestore config
import { doc, setDoc } from "firebase/firestore";

import { devtools } from 'zustand/middleware'

export const useStore = create(devtools(set => ({
  user: {},

  setUser: (thatUser) =>
    set((state) => ({
      user: thatUser
    })),

})))
