## Application Integration

#### Introduction

This section describes how to integrate customized application servers into X-LoRa systems.<br>
Application Server is responsible for handling application payloads. It is necessary to support various applications with different encoding methods such as Protocol Buffer serialization to improve network transmission efficiency. Application Server also functions as a bridge between the cloud platform owned by users and the X-LoRa system so that customers can control LoRa devices and enjoy the applications through web browsers or APPs on smartphones. The IoT cloud can get the application payloads by subscribing the specific topic, and can also send downlink messages to the LoRa Server through the application server.

#### Interaction with Server

The data exchange format from Server to Application Server is defined in this section.

##### Server to Application Server

```json
{
    DevAddr: <Buffer 00 08 fb 31>,
    FRMPayload: <Buffer c9 77 36 15>,
}
```

##### Application Server to Server

```json
{
    DevAddr: <Buffer 00 08 fb 31>,
    FRMPayload: <Buffer ff 01 ff>,
}
```
---