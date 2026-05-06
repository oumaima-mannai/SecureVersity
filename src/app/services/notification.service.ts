import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

// Import Firebase SDKs
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, query, onSnapshot, orderBy, updateDoc, doc, where } from 'firebase/firestore';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: any;
  data?: any;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private authService = inject(AuthService);
  
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private db: any = null;
  private unsubscribe: any = null;

  // Provide the Firebase config (this should ideally be in environment.ts)
  private firebaseConfig = {
    apiKey: "AIzaSyA45v7cHeQuOM12MwatusfwwGLjKaogR9A",
    authDomain: "versity-f0f81.firebaseapp.com",
    databaseURL: "https://versity-f0f81-default-rtdb.firebaseio.com",
    projectId: "versity-f0f81",
    storageBucket: "versity-f0f81.firebasestorage.app",
    messagingSenderId: "820543434730",
    appId: "1:820543434730:web:8cd8b11e582d49a2630c93"
  };

  constructor() { }

  async initialize() {
    if (getApps().length === 0) {
      initializeApp(this.firebaseConfig);
    }
    
    const auth = getAuth();
    this.db = getFirestore();

    const customToken = localStorage.getItem('firebase_token');
    const userId = this.authService.currentUserId();

    if (customToken && userId) {
      try {
        await signInWithCustomToken(auth, customToken);
        this.listenToNotifications(userId);
      } catch (e) {
        console.error('Firebase Auth failed', e);
      }
    }
  }

  private listenToNotifications(userId: string) {
    if (this.unsubscribe) this.unsubscribe();

    const notifsRef = collection(this.db, 'users', userId, 'notifications');
    const q = query(notifsRef, orderBy('createdAt', 'desc'));

    this.unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: AppNotification[] = [];
      let unread = 0;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as AppNotification;
        notifs.push({
          ...data,
          id: docSnap.id,
        });
        if (!data.read) unread++;
      });

      this.notificationsSubject.next(notifs);
      this.unreadCountSubject.next(unread);
    });
  }

  async markAsRead(notificationId: string) {
    if (!this.db) return;
    const userId = this.authService.currentUserId();
    if (!userId) return;

    const docRef = doc(this.db, 'users', userId, 'notifications', notificationId);
    await updateDoc(docRef, { read: true });
  }

  stopListening() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}
