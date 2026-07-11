package com.studentstraffic.app

import android.content.ComponentName
import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.telecom.PhoneAccount
import android.telecom.PhoneAccountHandle
import android.telecom.TelecomManager
import android.telecom.DisconnectCause
import android.util.Log
import io.wazo.callkeep.VoiceConnectionService

/**
 * Reports an FCM-delivered incoming call to Android Telecom before React
 * Native has started.  The existing react-native-callkeep ConnectionService
 * then owns the call, so Android/Samsung can render its native call UI.
 */
object IncomingCallTelecom {
  private const val TAG = "IncomingCallTelecom"
  private const val CALLKEEP_SERVICE = "io.wazo.callkeep.VoiceConnectionService"
  private const val EXTRA_CALLER_NAME = "EXTRA_CALLER_NAME"
  private const val EXTRA_CALL_UUID = "EXTRA_CALL_UUID"
  private const val EXTRA_CALL_NUMBER = "EXTRA_CALL_NUMBER"
  private const val EXTRA_CALL_NUMBER_SCHEMA = "EXTRA_CALL_NUMBER_SCHEMA"

  fun reportIncomingCall(context: Context, callId: String, callerDisplayName: String): Boolean {
    return try {
      val telecom = context.getSystemService(TelecomManager::class.java) ?: return false
      // RNCallKeep registers this exact managed PhoneAccount during app setup.
      // Do not enumerate call-capable accounts here: Android protects that
      // lookup behind READ_PHONE_STATE, which a background FCM receiver cannot
      // safely rely on.  Telecom itself validates that this known account is
      // registered and enabled when addNewIncomingCall is invoked.
      val account = PhoneAccountHandle(
        ComponentName(context.packageName, CALLKEEP_SERVICE),
        context.applicationInfo.loadLabel(context.packageManager).toString(),
      )

      // The session ID is not a phone number.  Supply a harmless generic
      // address because Telecom requires a URI while the caller name is what
      // Android displays to the recipient.
      val number = "0000000000"
      val extras = Bundle().apply {
        putParcelable(TelecomManager.EXTRA_INCOMING_CALL_ADDRESS, Uri.fromParts(PhoneAccount.SCHEME_TEL, number, null))
        putString(EXTRA_CALLER_NAME, callerDisplayName)
        putString(EXTRA_CALL_UUID, callId)
        putString(EXTRA_CALL_NUMBER, number)
        putString(EXTRA_CALL_NUMBER_SCHEMA, PhoneAccount.SCHEME_TEL)
      }
      telecom.addNewIncomingCall(account, extras)
      Log.i(TAG, "Reported incoming call to Telecom: $callId")
      true
    } catch (error: SecurityException) {
      Log.w(TAG, "Telecom rejected incoming call", error)
      false
    } catch (error: IllegalArgumentException) {
      Log.w(TAG, "Telecom rejected incoming call arguments", error)
      false
    } catch (error: IllegalStateException) {
      Log.w(TAG, "Telecom unavailable for incoming call", error)
      false
    }
  }

  fun dismissIncomingCall(context: Context, callId: String) {
    IncomingCallNotification.cancel(context, callId)
    try {
      // Telecom owns the system call surface. Marking the connection remote
      // and destroying it removes that surface without treating it as a new
      // local decline (which would otherwise call the API a second time).
      VoiceConnectionService.getConnection(callId)?.let { connection ->
        connection.setDisconnected(DisconnectCause(DisconnectCause.REMOTE))
        connection.destroy()
      }
    } catch (error: RuntimeException) {
      Log.w(TAG, "Unable to dismiss Telecom call", error)
    }
  }

}
