package com.studentstraffic.app

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class IncomingCallStoreModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  override fun getName() = "IncomingCallStore"

  @ReactMethod
  fun consumePendingCall(promise: Promise) {
    val pending = IncomingCallStore.consume(context)
    if (pending == null) {
      promise.resolve(null)
      return
    }
    promise.resolve(Arguments.createMap().apply {
      putString("callId", pending.callId)
      putString("callerDisplayName", pending.callerDisplayName)
      putString("universityName", pending.universityName)
      putString("action", pending.action)
    })
  }

  @ReactMethod
  fun cancelIncomingCall(callId: String) {
    IncomingCallStore.clearIfMatches(context, callId)
    IncomingCallTelecom.dismissIncomingCall(context, callId)
  }
}
