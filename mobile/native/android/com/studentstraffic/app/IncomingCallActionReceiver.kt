package com.studentstraffic.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import java.net.HttpURLConnection
import java.net.URL

class IncomingCallActionReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val callId = intent.getStringExtra(IncomingCallStore.EXTRA_CALL_ID) ?: return
    val caller = intent.getStringExtra(IncomingCallStore.EXTRA_CALLER_NAME) ?: "Incoming call"
    val university = intent.getStringExtra(IncomingCallStore.EXTRA_UNIVERSITY_NAME) ?: "Students Traffic"
    val action = when (intent.action) {
      ACTION_ANSWER -> "accept"
      ACTION_DECLINE, ACTION_TELECOM_DECLINE -> "decline"
      else -> return
    }

    if (action == "decline") {
      IncomingCallNotification.cancel(context, callId)
      IncomingCallTelecom.dismissIncomingCall(context, callId)
      notifyDecline(context, callId)
      return
    }
    IncomingCallStore.saveIncoming(context, callId, caller, university)
    IncomingCallStore.saveAction(context, action)
    IncomingCallNotification.cancel(context, callId)
    context.startActivity(Intent(context, MainActivity::class.java).apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
      putExtra(IncomingCallStore.EXTRA_CALL_ID, callId)
      putExtra(IncomingCallStore.EXTRA_CALLER_NAME, caller)
      putExtra(IncomingCallStore.EXTRA_UNIVERSITY_NAME, university)
      putExtra(IncomingCallStore.EXTRA_ACTION, action)
    })
  }

  private fun notifyDecline(context: Context, callId: String) {
    val token = IncomingCallStore.actionToken(context, callId)
    IncomingCallStore.clearIfMatches(context, callId)
    if (token.isNullOrBlank()) return
    val pending = goAsync()
    Thread {
      try {
        (URL("https://www.studentstraffic.com/api/mobile/v1/calls/$callId/end").openConnection() as HttpURLConnection).run {
          requestMethod = "POST"
          connectTimeout = 10_000
          readTimeout = 10_000
          setRequestProperty("X-Call-Action-Token", token)
          inputStream.close()
          disconnect()
        }
      } catch (_: Exception) {
      } finally {
        pending.finish()
      }
    }.start()
  }

  companion object {
    const val ACTION_ANSWER = "com.studentstraffic.app.ANSWER_CALL"
    const val ACTION_DECLINE = "com.studentstraffic.app.DECLINE_CALL"
    const val ACTION_TELECOM_DECLINE = "com.studentstraffic.app.TELECOM_DECLINE"
  }
}
