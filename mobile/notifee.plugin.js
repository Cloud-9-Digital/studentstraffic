// Custom Expo config plugin for @notifee/react-native.
// Adds the Android manifest service declarations that notifee requires
// (foreground service for active call, headless task service).
const fs = require("fs");
const path = require("path");
const { withAndroidManifest, withDangerousMod } = require("@expo/config-plugins");

const nativeCallFiles = [
  "IncomingCallStore.kt",
  "IncomingCallNotification.kt",
  "IncomingCallTelecom.kt",
  "IncomingCallReceiver.kt",
  "IncomingCallActionReceiver.kt",
  "IncomingCallStoreModule.kt",
  "IncomingCallStorePackage.kt",
];

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

    const mainActivity = app.activity?.find(
      (activity) => activity.$?.["android:name"] === ".MainActivity",
    );
    if (mainActivity?.$) {
      mainActivity.$["android:showWhenLocked"] = "true";
      mainActivity.$["android:turnScreenOn"] = "true";
    }

    if (!app.receiver) app.receiver = [];
    const receivers = [
      {
        $: {
          "android:name": ".IncomingCallReceiver",
          "android:exported": "true",
          "android:permission": "com.google.android.c2dm.permission.SEND",
        },
        "intent-filter": [{
          $: { "android:priority": "1000" },
          action: [{ $: { "android:name": "com.google.android.c2dm.intent.RECEIVE" } }],
        }],
      },
      {
        $: {
          "android:name": ".IncomingCallActionReceiver",
          "android:exported": "false",
        },
      },
    ];

    for (const receiver of receivers) {
      const name = receiver.$["android:name"];
      if (!app.receiver.some((entry) => entry.$?.["android:name"] === name)) {
        app.receiver.push(receiver);
      }
    }

    return config;
  });
}

function withNativeIncomingCallFiles(config) {
  return withDangerousMod(config, ["android", async (config) => {
    const sourceDir = path.join(
      config.modRequest.projectRoot,
      "native",
      "android",
      "com",
      "studentstraffic",
      "app",
    );
    const destinationDir = path.join(
      config.modRequest.platformProjectRoot,
      "app",
      "src",
      "main",
      "java",
      "com",
      "studentstraffic",
      "app",
    );
    fs.mkdirSync(destinationDir, { recursive: true });
    for (const fileName of nativeCallFiles) {
      fs.copyFileSync(path.join(sourceDir, fileName), path.join(destinationDir, fileName));
    }

    const mainApplicationPath = path.join(destinationDir, "MainApplication.kt");
    if (fs.existsSync(mainApplicationPath)) {
      const source = fs.readFileSync(mainApplicationPath, "utf8");
      if (!source.includes("add(IncomingCallStorePackage())")) {
        fs.writeFileSync(
          mainApplicationPath,
          source.replace(
            "PackageList(this).packages.apply {",
            "PackageList(this).packages.apply {\n              add(IncomingCallStorePackage())",
          ),
        );
      }
    }

    const mainActivityPath = path.join(destinationDir, "MainActivity.kt");
    if (fs.existsSync(mainActivityPath)) {
      let source = fs.readFileSync(mainActivityPath, "utf8");
      if (!source.includes("IncomingCallStore.captureLaunchIntent(this, intent)")) {
        source = source.replace(
          "super.onCreate(null)",
          "IncomingCallStore.captureLaunchIntent(this, intent)\n    super.onCreate(null)",
        );
        source = source.replace(
          "  /**\n   * Returns the name of the main component",
          "  override fun onNewIntent(intent: android.content.Intent?) {\n    super.onNewIntent(intent)\n    IncomingCallStore.captureLaunchIntent(this, intent)\n    setIntent(intent)\n  }\n\n  /**\n   * Returns the name of the main component",
        );
        fs.writeFileSync(mainActivityPath, source);
      }
    }

    const appBuildGradlePath = path.join(config.modRequest.platformProjectRoot, "app", "build.gradle");
    if (fs.existsSync(appBuildGradlePath)) {
      const source = fs.readFileSync(appBuildGradlePath, "utf8");
      if (!source.includes('implementation("com.google.firebase:firebase-messaging")')) {
        fs.writeFileSync(
          appBuildGradlePath,
          source.replace(
            'implementation("com.facebook.react:react-android")',
            'implementation("com.facebook.react:react-android")\n    implementation("com.google.firebase:firebase-messaging")',
          ),
        );
      }
    }

    return config;
  }]);
}

module.exports = (config) => withNativeIncomingCallFiles(withNotifeeAndroid(config));
