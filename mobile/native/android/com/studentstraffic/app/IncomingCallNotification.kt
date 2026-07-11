package com.studentstraffic.app

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.app.Person

object IncomingCallNotification {
  // Android preserves user changes to a notification channel across app updates.
  // Earlier builds created `incoming_calls`, which some devices have since muted.
  // A new channel lets the app request call-grade alerts again without overriding
  // a user's explicit notification preference.
  private const val CHANNEL_ID = "incoming_calls_v2"

  fun show(context: Context, callId: String, callerDisplayName: String, universityName: String) {
    createChannel(context)

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
      ActivityCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
      return
    }

    val openIntent = appIntent(context, callId, callerDisplayName, universityName, null)
    val fullScreenIntent = PendingIntent.getActivity(
      context,
      notificationId(callId),
      openIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
    val answerIntent = PendingIntent.getBroadcast(
      context,
      notificationId(callId) + 1,
      actionIntent(context, callId, callerDisplayName, universityName, IncomingCallActionReceiver.ACTION_ANSWER),
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
    val declineIntent = PendingIntent.getBroadcast(
      context,
      notificationId(callId) + 2,
      actionIntent(context, callId, callerDisplayName, universityName, IncomingCallActionReceiver.ACTION_DECLINE),
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    val caller = Person.Builder()
      .setName(callerDisplayName)
      .setImportant(true)
      .build()
    val notification = NotificationCompat.Builder(context, CHANNEL_ID)
      .setSmallIcon(R.drawable.ic_stat_call)
      .setContentTitle(callerDisplayName)
      .setContentText("$callerDisplayName · $universityName")
      .setCategory(NotificationCompat.CATEGORY_CALL)
      .setPriority(NotificationCompat.PRIORITY_MAX)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .setColorized(true)
      .setOngoing(true)
      .setAutoCancel(false)
      .setTimeoutAfter(60_000)
      .setFullScreenIntent(fullScreenIntent, true)
      .setContentIntent(fullScreenIntent)
      .setStyle(NotificationCompat.CallStyle.forIncomingCall(caller, declineIntent, answerIntent))
      .build()

    NotificationManagerCompat.from(context).notify(notificationId(callId), notification)
  }

  fun cancel(context: Context, callId: String) {
    NotificationManagerCompat.from(context).cancel(notificationId(callId))
  }

  private fun createChannel(context: Context) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val channel = NotificationChannel(
      CHANNEL_ID,
      "Incoming calls",
      NotificationManager.IMPORTANCE_HIGH
    ).apply {
      description = "Incoming Student Traffic calls"
      enableVibration(true)
      setSound(android.provider.Settings.System.DEFAULT_RINGTONE_URI, null)
      lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
    }
    context.getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
  }

  private fun appIntent(
    context: Context,
    callId: String,
    callerDisplayName: String,
    universityName: String,
    action: String?
  ) = Intent(context, MainActivity::class.java).apply {
    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
    putExtra(IncomingCallStore.EXTRA_CALL_ID, callId)
    putExtra(IncomingCallStore.EXTRA_CALLER_NAME, callerDisplayName)
    putExtra(IncomingCallStore.EXTRA_UNIVERSITY_NAME, universityName)
    action?.let { putExtra(IncomingCallStore.EXTRA_ACTION, it) }
  }

  private fun actionIntent(
    context: Context,
    callId: String,
    callerDisplayName: String,
    universityName: String,
    action: String
  ) = Intent(context, IncomingCallActionReceiver::class.java).apply {
    this.action = action
    putExtra(IncomingCallStore.EXTRA_CALL_ID, callId)
    putExtra(IncomingCallStore.EXTRA_CALLER_NAME, callerDisplayName)
    putExtra(IncomingCallStore.EXTRA_UNIVERSITY_NAME, universityName)
  }

  private fun notificationId(callId: String) = callId.hashCode() and 0x7fffffff
}
