import { registerBackgroundHandlers } from "./src/services/callNotificationService";

// Must run before React mounts — this is the only code that executes
// when Android wakes the app for a background FCM message (killed state).
registerBackgroundHandlers();

import "expo-router/entry";
