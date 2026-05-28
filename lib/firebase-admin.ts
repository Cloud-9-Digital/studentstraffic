import "server-only";

let _messaging: any = null;

function getFirebaseMessaging() {
  if (_messaging) return _messaging;

  const projectId  = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const admin = require("firebase-admin");
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
    }
    _messaging = admin.messaging();
    return _messaging;
  } catch {
    return null;
  }
}

export async function sendFCMDataMessage(
  fcmToken: string,
  data: Record<string, string>,
) {
  const messaging = getFirebaseMessaging();
  if (!messaging) return false;

  try {
    await messaging.send({
      token: fcmToken,
      // Data-only — no notification payload.
      // The app's background handler (notifee) creates the real call notification.
      data,
      android: {
        priority: "high",      // wakes device even from Doze
        ttl: 60 * 1000,        // discard after 60s — stale calls are noise
      },
    });
    return true;
  } catch {
    return false;
  }
}
