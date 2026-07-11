package com.studentstraffic.app

import android.content.Context
import android.content.Intent

/**
 * A tiny native hand-off store for incoming-call push events. It lets the
 * receiver show the call notification immediately, then gives React Native
 * exactly one action to process after the app has been opened.
 */
object IncomingCallStore {
  private const val PREFERENCES = "students_traffic_incoming_call"
  private const val KEY_CALL_ID = "callId"
  private const val KEY_CALLER_NAME = "callerDisplayName"
  private const val KEY_UNIVERSITY_NAME = "universityName"
  private const val KEY_ACTION = "action"

  const val EXTRA_CALL_ID = "com.studentstraffic.app.CALL_ID"
  const val EXTRA_CALLER_NAME = "com.studentstraffic.app.CALLER_NAME"
  const val EXTRA_UNIVERSITY_NAME = "com.studentstraffic.app.UNIVERSITY_NAME"
  const val EXTRA_ACTION = "com.studentstraffic.app.CALL_ACTION"

  data class PendingCall(
    val callId: String,
    val callerDisplayName: String,
    val universityName: String,
    val action: String?
  )

  fun saveIncoming(context: Context, callId: String, callerDisplayName: String, universityName: String) {
    preferences(context).edit()
      .putString(KEY_CALL_ID, callId)
      .putString(KEY_CALLER_NAME, callerDisplayName)
      .putString(KEY_UNIVERSITY_NAME, universityName)
      .remove(KEY_ACTION)
      .apply()
  }

  fun saveAction(context: Context, action: String) {
    preferences(context).edit().putString(KEY_ACTION, action).apply()
  }

  fun clearIfMatches(context: Context, callId: String) {
    val prefs = preferences(context)
    if (prefs.getString(KEY_CALL_ID, null) == callId) {
      prefs.edit().clear().apply()
    }
  }

  fun captureLaunchIntent(context: Context, intent: Intent?) {
    val callId = intent?.getStringExtra(EXTRA_CALL_ID) ?: return
    saveIncoming(
      context,
      callId,
      intent.getStringExtra(EXTRA_CALLER_NAME) ?: "Incoming call",
      intent.getStringExtra(EXTRA_UNIVERSITY_NAME) ?: "Students Traffic"
    )
    intent.getStringExtra(EXTRA_ACTION)?.let { saveAction(context, it) }
  }

  fun consume(context: Context): PendingCall? {
    val prefs = preferences(context)
    val callId = prefs.getString(KEY_CALL_ID, null) ?: return null
    val pending = PendingCall(
      callId = callId,
      callerDisplayName = prefs.getString(KEY_CALLER_NAME, "Incoming call") ?: "Incoming call",
      universityName = prefs.getString(KEY_UNIVERSITY_NAME, "Students Traffic") ?: "Students Traffic",
      action = prefs.getString(KEY_ACTION, null)
    )
    prefs.edit().clear().apply()
    return pending
  }

  private fun preferences(context: Context) =
    context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)
}
