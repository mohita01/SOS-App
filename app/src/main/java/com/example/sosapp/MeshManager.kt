package com.example.sosapp

import android.content.Context
import android.util.Log
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.nearby.connection.*

class MeshManager(private val context: Context) {

    private val connectionsClient = Nearby.getConnectionsClient(context)
    private val SERVICE_ID = "sos-mesh"

    // Start discovering nearby devices
    fun startDiscovery() {
        connectionsClient.startDiscovery(
            SERVICE_ID,
            endpointDiscoveryCallback,
            DiscoveryOptions.Builder().setStrategy(Strategy.P2P_CLUSTER).build()
        )
    }

    // Start advertising (others can find you)
    fun startAdvertising() {
        connectionsClient.startAdvertising(
            "SOS_USER",
            SERVICE_ID,
            connectionLifecycleCallback,
            AdvertisingOptions.Builder().setStrategy(Strategy.P2P_CLUSTER).build()
        )
    }

    // Send SOS message
    fun sendSOS(message: String) {
        val payload = Payload.fromBytes(message.toByteArray())

        // Broadcast to all connected devices
        connectedEndpoints.forEach {
            connectionsClient.sendPayload(it, payload)
        }
    }

    private val connectedEndpoints = mutableListOf<String>()

    private val endpointDiscoveryCallback = object : EndpointDiscoveryCallback() {
        override fun onEndpointFound(endpointId: String, info: DiscoveredEndpointInfo) {
            connectionsClient.requestConnection("User", endpointId, connectionLifecycleCallback)
        }

        override fun onEndpointLost(endpointId: String) {}
    }

    private val connectionLifecycleCallback = object : ConnectionLifecycleCallback() {
        override fun onConnectionInitiated(endpointId: String, info: ConnectionInfo) {
            connectionsClient.acceptConnection(endpointId, payloadCallback)
        }

        override fun onConnectionResult(endpointId: String, result: ConnectionResolution) {
            if (result.status.isSuccess) {
                connectedEndpoints.add(endpointId)
            }
        }

        override fun onDisconnected(endpointId: String) {
            connectedEndpoints.remove(endpointId)
        }
    }

    private val payloadCallback = object : PayloadCallback() {
        override fun onPayloadReceived(endpointId: String, payload: Payload) {
            val message = String(payload.asBytes()!!)
            Log.d("MESH", "Received: $message")

            // Forward message (mesh behavior)
            sendSOS(message)
        }

        override fun onPayloadTransferUpdate(endpointId: String, update: PayloadTransferUpdate) {}
    }
}