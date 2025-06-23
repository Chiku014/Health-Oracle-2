package com.anonymous.healthoracle

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import com.facebook.react.bridge.*
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.time.TimeRangeFilter
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime

class HealthConnectModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val healthConnectClient: HealthConnectClient? by lazy {
        if (HealthConnectClient.isAvailable(reactContext)) {
            HealthConnectClient.getOrCreate(reactContext)
        } else {
            null
        }
    }

    override fun getName() = "HealthConnect"

    @ReactMethod
    fun checkPermissions(promise: Promise) {
        if (healthConnectClient == null) {
            promise.resolve(false)
            return
        }

        val permissions = setOf(
            HealthPermission.createReadPermission(StepsRecord::class),
            HealthPermission.createReadPermission(SleepSessionRecord::class),
            HealthPermission.createReadPermission(HeartRateRecord::class)
        )

        healthConnectClient?.permissionController?.getGrantedPermissions(permissions)?.let { granted ->
            promise.resolve(granted.size == permissions.size)
        } ?: run {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun requestPermissions(promise: Promise) {
        if (healthConnectClient == null) {
            promise.reject("ERROR", "Health Connect is not available")
            return
        }

        val permissions = setOf(
            HealthPermission.createReadPermission(StepsRecord::class),
            HealthPermission.createReadPermission(SleepSessionRecord::class),
            HealthPermission.createReadPermission(HeartRateRecord::class)
        )

        try {
            healthConnectClient?.permissionController?.requestPermissions(permissions)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun getStepsData(startTime: Double, endTime: Double, promise: Promise) {
        if (healthConnectClient == null) {
            promise.resolve(0)
            return
        }

        val timeRange = TimeRangeFilter.between(
            Instant.ofEpochMilli(startTime.toLong()),
            Instant.ofEpochMilli(endTime.toLong())
        )

        try {
            healthConnectClient?.readRecords(StepsRecord::class, timeRange)?.let { records ->
                val totalSteps = records.sumOf { it.count }
                promise.resolve(totalSteps)
            } ?: run {
                promise.resolve(0)
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun getSleepData(startTime: Double, endTime: Double, promise: Promise) {
        if (healthConnectClient == null) {
            promise.resolve(Arguments.createArray())
            return
        }

        val timeRange = TimeRangeFilter.between(
            Instant.ofEpochMilli(startTime.toLong()),
            Instant.ofEpochMilli(endTime.toLong())
        )

        try {
            healthConnectClient?.readRecords(SleepSessionRecord::class, timeRange)?.let { records ->
                val sessions = Arguments.createArray()
                records.forEach { record ->
                    val session = Arguments.createMap()
                    session.putDouble("startTime", record.startTime.toEpochMilli().toDouble())
                    session.putDouble("endTime", record.endTime.toEpochMilli().toDouble())
                    session.putDouble("durationMinutes", record.endTime.epochSecond - record.startTime.epochSecond)
                    sessions.pushMap(session)
                }
                promise.resolve(sessions)
            } ?: run {
                promise.resolve(Arguments.createArray())
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun getHeartRateData(startTime: Double, endTime: Double, promise: Promise) {
        if (healthConnectClient == null) {
            promise.resolve(Arguments.createArray())
            return
        }

        val timeRange = TimeRangeFilter.between(
            Instant.ofEpochMilli(startTime.toLong()),
            Instant.ofEpochMilli(endTime.toLong())
        )

        try {
            healthConnectClient?.readRecords(HeartRateRecord::class, timeRange)?.let { records ->
                val measurements = Arguments.createArray()
                records.forEach { record ->
                    val measurement = Arguments.createMap()
                    measurement.putDouble("timestamp", record.time.toEpochMilli().toDouble())
                    measurement.putDouble("beatsPerMinute", record.beatsPerMinute.toDouble())
                    measurements.pushMap(measurement)
                }
                promise.resolve(measurements)
            } ?: run {
                promise.resolve(Arguments.createArray())
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
} 