package com.studentstraffic.app

import android.app.ActivityManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.google.firebase.messaging.RemoteMessage

/**
 * Handles incoming-call FCM broadcasts before the React Native bridge is
 * started. This is intentionally limited to user-visible call events; other
 * Firebase messages continue through React Native Firebase normally.
 */
class IncomingCallReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val extras = intent.extras ?: return
    val data = RemoteMessage(extras).data

    if (data["type"] == "call_ended") {
      val callId = data["callId"] ?: return
      IncomingCallStore.clearIfMatches(context, callId)
      IncomingCallTelecom.dismissIncomingCall(context, callId)
      return
    }

    if (data["type"] != "incoming_call" || isAppForeground(context)) return

    val callId = data["callId"] ?: return
    val caller = data["callerDisplayName"] ?: "Incoming call"
    val university = data["universityName"] ?: "Students Traffic"
    IncomingCallStore.saveIncoming(context, callId, caller, university, data["actionToken"])
    val telecomCaller = when {
      caller.equals("Incoming call", ignoreCase = true) -> "Students Traffic call"
      caller.contains("Students Traffic", ignoreCase = true) -> caller
      else -> "$caller via Students Traffic"
    }

    // The actual incoming-call path is Android Telecom.  It binds the
    // CallKeep ConnectionService and gives the device's call UI ownership of
    // answer/reject/lock-screen behavior.  A CallStyle notification remains a
    // fallback for devices where the phone account has been disabled or
    // Telecom cannot accept another call.
    if (!IncomingCallTelecom.reportIncomingCall(context, callId, telecomCaller)) {
      IncomingCallNotification.show(context, callId, caller, university)
    }
  }

  private fun isAppForeground(context: Context): Boolean {
    val activityManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
    val processName = context.packageName
    return activityManager.runningAppProcesses?.any {
      it.processName == processName &&
        it.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND
    } == true
  }
}
