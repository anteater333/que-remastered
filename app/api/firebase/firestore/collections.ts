import VideoType from "../../../types/Video";

import {
  collection,
  DocumentData,
  CollectionReference,
  getFirestore,
} from "firebase/firestore";
import UserType from "../../../types/User";
import { getApps, initializeApp } from "firebase/app";
import firebaseConfig from "../config";

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

/**
 * Helper to add the type to the db responses. kind of ODM
 * @param collectionName
 * @returns
 */
const createCollection = <T = DocumentData>(collectionName: string) => {
  const firestore = getFirestore();
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export const VideoCollection = createCollection<VideoType>("videos");
export const UserCollection = createCollection<UserType>("users");
