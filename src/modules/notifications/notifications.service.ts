import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private db: admin.firestore.Firestore;
  private initialized = false;

  onModuleInit() {
    try {
      // Look for the service account key in the root folder
      const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
      
      if (!fs.existsSync(serviceAccountPath)) {
        this.logger.warn('firebase-service-account.json not found! Notifications will not be sent.');
        return;
      }

      const serviceAccount = require(serviceAccountPath);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });

      this.db = admin.firestore();
      this.initialized = true;
      this.logger.log('Firebase Admin initialized successfully.');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin', error);
    }
  }

  async sendNotification(userId: string, title: string, message: string, data?: any) {
    if (!this.initialized) {
      this.logger.warn(`Cannot send notification to ${userId}: Firebase not initialized.`);
      return;
    }

    try {
      const notificationRef = this.db.collection('users').doc(userId).collection('notifications').doc();
      await notificationRef.set({
        title,
        message,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        data: data || {}
      });
      this.logger.log(`Notification sent to user ${userId}`);
    } catch (error) {
      this.logger.error(`Error sending notification to ${userId}`, error);
    }
  }
}
