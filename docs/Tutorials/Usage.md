## Usage

This section describes the detailed instructions of X-LoRa. It shows how to create applications, register gateways and activate devices.

#### Registration on LoRa Web

Users need to register their applications, gateways and devices on the LoRa web before further operations.

##### User Management

Create an account for the LoRa web and start enjoying the service the LoRa server provided. With a LoRa web account, the following can be done:

* Creating applications, gateways and devices
* Easy access to the transmission data and application data

It's necessary to fill in the following fields when register an account. Note that the password field requires at least 6 characters long.

<center>TABLE 1 Description of User Registration Form</center>

|     Field      |  Type  |   Description   | Attribute |
| :------------: | :----: | :-------------: | :-------: |
|      Name      | String |   User's name   | Required  |
| E-mail Address | String |  User's email   | Required  |
|    Password    | String | User's password | Required  |

##### Gateway Management

LoRa gateways directly connect to LoRa network connector and upload and download data for LoRa devices. However, registering gateway in the LoRa web is firstly needed. The verification of the existence of the gateways without registering in the LoRa web can’t success.

The fields in the following table need to be filled in during the registration of gateways. Note that the gatewayID field should be unique. If not, the registration can’t be successful.

Once the registration is successful, the web will return a list of gateways that the user has registered.

<center>TABLE 2 Description of Gateway Registration Form</center>

|     Field      |  Type  |     Description     | Attribute |
| :------------: | :----: | :-----------------: | :-------: |
|   gatewayID    | String | Gateway MAC address |  Unique   |
|      type      | String |   Indoor/Outdoor    | Required  |
| frequency plan | Number |      Frequency      | Required  |
|     model      | String |     X01/X02/X03     | Required  |
|    location    | String |  Gateway location   | Required  |

##### Application Management

Each device belongs to a certain application. Therefore, before registering devices, users should register applications first.

The fields in the following table need to be filled in during the registration of applications. Note that the AppEUI field should be unique. If not, the registration can’t be successful.

Once the registration is successful, the web will return a list of applications that the user has registered.

<center>TABLE 3 Description of Application Registration Form</center>

|      Field       |  Type  |            Description             | Attribute |
| :--------------: | :----: | :--------------------------------: | :-------: |
| Application Name | String |          Application name          | Required  |
|      AppEUI      | String | LoRa™ application unique identifier |  Unique   |

##### Device Management

Before LoRa devices are able to connect to the LoRa server, users should register them in the LoRa web. Without that, the verification of the existence of the devices will fail.

Device registration must be performed after the application is registered, which has been explained in the previous section. Due to the fact that activation of an end-device can be achieved in two ways, device registration can be divided into two categories, i.e., Over-The-Air Activation (OTAA) and Activation by Personalization (ABP) modes. The attribute fields required for the registration of the two modes have different requirements, i.e.,

* OTAA Mode

  The fields in the following table need to be filled in during the registration of devices. Note that the DevEUI field should be unique. If not, the registration can’t be successful.

  Once the registration is successful, the web will return a list of devices that the user has registered.

  <center>TABLE 4 Description of OTAA Device Registration Form</center>

  | Field  |  Type  |          Description          | Attribute |
  | :----: | :----: | :---------------------------: | :-------: |
  | DevEUI | String | LoRa device unique identifier |  Unique   |
  | AppKey | String |    AES-128 application key    | Required  |

* ABP Mode

  The fields in the following table need to be filled in during the registration of devices. Note that the DevEUI field and DevAddr field should be unique. If not, the registration can’t be successful.

  Once the registration is successful, the web will return a list of devices that the user has registered.

  <center>TABLE 5 Description of ABP Device Registration Form</center>

  |  Field  |  Type  |          Description          | Attribute |
  | :-----: | :----: | :---------------------------: | :-------: |
  | DevEUI  | String | LoRa device unique identifier |  Unique   |
  | AppKey  | String |    AES-128 application key    | Required  |
  | DevAddr | String |  LoRa device unique address   |  Unique   |
  | NwkSKey | String |      Network session key      | Required  |
  | AppSKey | String |    Application session key    | Required  |

#### Interaction with LoRa Server
For over-the-air activation, LoRa devices must follow a join procedure prior to participating in data exchanges with the Network Server. An end-device has to go through a new join procedure every time when it has lost the session context information. After that, devices can send the uplink messages and receive the downlink messages from the LoRa server.

Activating a LoRa devices by personalization means that all the necessary information is stored in devices in the very beginning. These devices can interact with LoRa server directly.

---