// Custom Expo config plugin for @notifee/react-native.
// Adds the Android manifest service declarations that notifee requires
// (foreground service for active call, headless task service).
const { withAndroidManifest } = require("@expo/config-plugins");

function withNotifeeAndroid(config) {
  return withAndroidManifest(config, (config) => {
    const app = config.modResults.manifest.application?.[0];
    if (!app) return config;

    if (!app.service) app.service = [];

    const services = [
      {
        $: {
          "android:name": "app.notifee.core.ForegroundService",
          "android:foregroundServiceType": "microphone",
          "android:exported": "false",
        },
      },
      {
        $: {
          "android:name": "app.notifee.core.TaskService",
          "android:stopWithTask": "false",
          "android:exported": "false",
        },
      },
    ];

    for (const svc of services) {
      const name = svc.$["android:name"];
      if (!app.service.some((s) => s.$?.["android:name"] === name)) {
        app.service.push(svc);
      }
    }

    return config;
  });
}

module.exports = withNotifeeAndroid;
