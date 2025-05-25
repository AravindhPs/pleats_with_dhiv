// firebase-init.ts
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { environment } from './environments/environment';

export const firebaseApp = initializeApp(environment.firebase);
export const storage = getStorage(firebaseApp);
