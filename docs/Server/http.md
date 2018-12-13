# HTTP APIs

This document lists all HTTP API methods.

## User Register
 
This API is used for user register and returns the userID.

``` javascript
POST /register
```

* Request
```json
Headers:
  Content-Type: application/x-www-form-urlencoded

Body:
  {
    "email": "test@xisiot.com",
    "password": "123456"
  }
```

* Response
```json
Body:
  {
    "userID": "4c0c99ca5caef7c9f4707d641c726f55"
  }
```

---

## User Login

This API is used for user login and returns the userID.

``` javascript
POST /login
```

* Request
```json
Headers:
  Content-Type: application/x-www-form-urlencoded

Body:
  {
    "email": "test@xisiot.com",
    "password": "123456"
  }
```

* Response
```json
Body:
  {
    "userID": "4c0c99ca5caef7c9f4707d641c726f55"
  }
```

---

## Application Register

This API is used for application register.

``` javascript
POST /application
```

* Request
```json
Headers:
  Content-Type: application/x-www-form-urlencoded

Body:
  {
    "userID": "4c0c99ca5caef7c9f4707d641c726f55 ",
    "AppEUI": "9816be466f467a17",
    "name": "test"
  }
```

* Response
```json
Body:
  {
    "code": "200",
    "message": "success"
  }
```

---

## Device Register

This API is used for device register.

``` javascript
POST /device
```

* Request
```json
Headers:
  Content-Type: application/x-www-form-urlencoded

Body:
  {
    "AppEUI": "9816be466f467a17",
    "DevEUI": "AAAAAAAAAAAAAAAA",
    "AppKey": "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  }
```

* Response
```json
Body:
  {
    "code": "200",
    "message": "success"
  }
```

---

## Gateway Register

This API is used for gateway register.

``` javascript
POST /gateway
```

* Request
```json
Headers:
  Content-Type: application/x-www-form-urlencoded

Body:
  {
    "userID": "4c0c99ca5caef7c9f4707d641c726f55 ",
    "gatewayId": "bbbbbbbbbbbbbbbb"
  }
```

* Response
```json
Body:
  {
    "code": "200",
    "message": "success"
  }
```

---

## MACCommand Sending

This API is used to send the downlink MACCommand.

``` javascript
POST /maccommand
```

* Request
```json
Headers:
  Content-Type: application/x-www-form-urlencoded

Body:
  {
    "DevAddr": "12345678 ",
    "MACCommand": "030200ff01"
  }
```

* Response
```json
Body:
  {
    "code": "200",
    "message": "success"
  }
```

* MAC Commands

Overstriking means the downlink MACCommand

cid|MAC Command|payload|length(byte)
:-:|:-:|:-:|:-:
0x01|ResetInd|Version
	|**ResetConf**|**Version**|1
0x02|LinkCheckReq
	|**LinkCheckAns**|**Margin**|1
    |   |**GwCnt**|1
0x03|**LinkADRReq**|**TXPower**|1
    |   |**ChMask**|2
    |   |**Redundancy**|1
	|LinkADRAns|Status
0x04|**DutyCycleReq**|**DutyCyclePL**|1
	|DutyCycleAns
0x05|**RXParamSetupReq**|**DLSettings**|1
    |   |**Frequency**|3
	|RXParamSetupAns|Status
0x06|**DevStatusReq**	
	|DevStatusAns|Battery
    |   |Margin
0x07|**NewChannelReq**|**ChIndex**|1
    |   |**Freq**|3
    |   |**DrRange**|1
	|NewChannelAns|Status
0x08|**RXTimingSetupReq**|**Settings**|1
	|RXTimingSetupAns	
0x09|**TxParamSetupReq**|**DwellTime**|1
	|TxParamSetupAns	
0x0A|**DlChannelReq**|**ChIndex**|1
    |   |**Freq**|3
	|DlChannelAns|Status
0x0B|RekeyInd|Version
	|**RekeyConf**|**Version**|1
0x0C|**ADRParamSetupReq**|**ADRParam**|1
	|ADRParamSetupAns	
0x0D|DeviceTimeReq	
	|**DeviceTimeAns**|**Seconds**|4
    |   |**FractionalSec**|1
0x0E|**ForceRejoinReq**|**ForceRejoinReq**|2
0x0F|**RejoinParamSetupReq**|**RejoinParamSetupReq**|1
	|RejoinParamSetupAns|Status

---
## Error List

code|message
:-:|:-:
2101|invalid email
2102|invalid password
2103|invalid AppEUI
2104|invalid DevEUI
2105|invalid AppKey
2106|invalid gatewayId
2107|invalid DevAddr
2108|invalid MACCommand
3101|user already registered
3102|user not registered
3103|user password error
3201|application already created
3202|application not created
3301|device already created
3401|gateway already created

