# Data Format

This document shows the data format for transmission.

## Network Connector to Network Server

The Network Connector sends the parsed data and the transmission parameters to the Network Server. 

* Data format

```json
  {
    "version": "",
    "token": "",
    "identifier": "",
    "gatewayId": "",
    "rxpk": {
      "time": "",
      "tmst": "",
      "chan": "",
      "rfch": "",
      "freq": "",
      "stat": "",
      "modu": "",
      "datr": "",
      "codr": "",
      "rssi": "",
      "lsnr": "",
      "size": "",
      "data": {
        "MHDR": {
          "MType": "",
          "Major": ""
        },
        "MACPayload": {
          "FHDR": {
            "DevAddr": "",
            "FCtrl": {
              "ADR": "",
              "ADRACKReq": "",
              "ACK": "",
              "ClassB": "",
              "FOptsLen": ""
            },
            "FCnt": "",
            "FOpts": ""
          },
          "FPort": "",
          "FRMPayload": ""
        },
        "MIC": ""
      }
    }
  }
```

* Field description

TABLE 1. Field Description of Uplink Data Format(NC to NS)</center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
version|Buffer|&lt;Buffer 02&gt;|Yes
token|Buffer|&lt;Buffer 5c 97&gt;|Yes
identifier|Buffer|&lt;Buffer 02&gt;|Yes
gatewayId|Buffer|&lt;Buffer b8 27 eb ff fe 52 0e 51&gt;|Yes
rxpk|Object|Table 2 for instructions|Yes

TABLE 2. Description of rxpk

Field|Type|Example|Required
:-:|:-:|:-:|:-:
time|String|"2013-03-31T16:21:17.528002Z"|No
tmst|Number|3512348611|Yes
chan|Number|2|Yes
rfch|Number|0|Yes
freq|Number|433.3|Yes
stat|Number|1|Yes
modu|String|"LORA"|Yes
datr|String|"SF7BW125"|Yes
codr|String|"4/6"|Yes
rssi|Number|-35|Yes
lsnr|Number|5.1|Yes
size|Number|32|No
data|Object|Table 3 for instructions|Yes

TABLE 3. Description of data

Field|Type|Example|Required
:-:|:-:|:-:|:-:
MHDR|Object|Table 4 for instructions|Yes
MACPayload|Object|Table 5 for instructions|Yes
MIC|Buffer|&lt;Buffer 5c 97 73 61&gt;|Yes

TABLE 4. Description of MHDR

Field|Type|Example|Required
:-:|:-:|:-:|:-:
MType|Number|4|Yes
Major|Number|0|Yes

TABLE 5. Description of MACPayload

Field|Type|Example|Required
:-:|:-:|:-:|:-:
FHDR|Object|Table 6 for instructions|Yes
FPort|Buffer|&lt;Buffer 02&gt;|No
FRMPayload|Buffer / Array|&lt;Buffer c9 77 36 15&gt; / [1]|No

TABLE 6. Description of FHDR

Field|Type|Example|Required
:-:|:-:|:-:|:-:
DevAddr|Buffer|&lt;Buffer 00 96 44 72&gt;|Yes
FCtrl|Object|Table 7 for instructions|Yes
FCnt|Buffer|&lt;Buffer 5c 97&gt;|Yes
FOpts|Array|[1]|No

TABLE 7. Description of FCtrl

Field|Type|Example|Required
:-:|:-:|:-:|:-:
ADR|Number|1|Yes
ADRACKReq|Number|0|Yes
ACK|Number|0|Yes
ClassB|Number|0|Yes
FOptsLen|Number|0|Yes

## Network Server to Network Connector

The Network Server sends the downlink data and the transmission parameters to the Network Connector. 

* Data format

```json
  {
    "version": "",
    "token": "",
    "identifier": "",
    "gatewayId": "",
    "txpk": {
      "imme": "",
      "tmst": "",
      "freq": "",
      "rfch": "",
      "powe": "",
      "datr": "",
      "modu": "",
      "codr": "",
      "ipol": "",
      "size": "",
      "data": {
        "MHDR": {
          "MType": "",
          "Major": ""
        },
        "MACPayload": {
          "FHDR": {
            "DevAddr": "",
            "FCtrl": {
              "ACK": "",
              "ADR": "",
              "FPending": "",
              "FOptsLen": ""
            },
            "FCnt": "",
            "FOpts": ""
          },
          "FPort": "",
          "FRMPayload": ""
        }
      }
    }
  }
```

* Field description

TABLE 8. Field Description of Downlink Data Format(NS to NC)</center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
version|Buffer|&lt;Buffer 02&gt;|Yes
token|Buffer|&lt;Buffer 5c 97&gt;|Yes
identifier|Buffer|&lt;Buffer 02&gt;|Yes
gatewayId|Buffer|&lt;Buffer b8 27 eb ff fe 52 0e 51&gt;|Yes
txpk|Object|Table 9 for instructions|Yes

TABLE 9. Description of txpk

Field|Type|Example|Required
:-:|:-:|:-:|:-:
imme|Bool|false|No
tmst|Number|2746316372|No
freq|Number|433.3|No
rfch|Number|0|Yes
powe|Number|25|No
datr|String|"SF12BW125"|No
modu|String|"LORA"|No
codr|String|"4/5"|Yes
ipol|Bool|false|Yes
size|Number|32|No
data|Object|Table 10 for instructions|Yes

TABLE 10. Description of data

Field|Type|Example|Required
:-:|:-:|:-:|:-:
MHDR|Object|Table 11 for instructions|Yes
MACPayload|Object|Table 12 for instructions|Yes

TABLE 11. Description of MHDR

Field|Type|Example|Required
:-:|:-:|:-:|:-:
MType|Number|5|Yes
Major|Number|0|Yes

TABLE 12. Description of MACPayload

Field|Type|Example|Required
:-:|:-:|:-:|:-:
FHDR|Object|Table 13 for instructions|Yes
FPort|Buffer|&lt;Buffer 02&gt;|No
FRMPayload|Buffer / Array|&lt;Buffer c9 77 36 15&gt; / [1]|No

TABLE 13. Description of FHDR

Field|Type|Example|Required
:-:|:-:|:-:|:-:
DevAddr|Buffer|&lt;Buffer 00 96 44 72&gt;|Yes
FCtrl|Object|Table 14 for instructions|Yes
FCnt|Buffer|&lt;Buffer 5c 97&gt;|Yes
FOpts|Array|[1]|No

TABLE 14. Description of FCtrl

Field|Type|Example|Required
:-:|:-:|:-:|:-:
ACK|Number|1|Yes
ADR|Number|1|Yes
FPending|Number|0|Yes
FOptsLen|Number|0|Yes

## Network Server to Join Server 

The Network Server sends the join request data and the transmission parameters to the Join Server. 

* Data format

```json
  {
    "version": "",
    "token": "",
    "identifier": "",
    "gatewayId": "",
    "rxpk": {
      "time": "",
      "tmst": "",
      "chan": "",
      "rfch": "",
      "freq": "",
      "stat": "",
      "modu": "",
      "datr": "",
      "codr": "",
      "rssi": "",
      "lsnr": "",
      "size": "",
      "raw": "",
      "data":{
        "MHDR": {
          "MType":0,
          "Major":0
        },
        "MHDRRaw":"00",
        "MACPayload":"177a466f46be16983a24de487345feb2ebd4",
        "MIC":"c274de2e"
      }
    }
  }
```

* Field description

TABLE 15. Field Description of Uplink Data Format(NS to JS)</center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
version|Buffer|&lt;Buffer 02&gt;|Yes
token|Buffer|&lt;Buffer 5c 97&gt;|Yes
identifier|Buffer|&lt;Buffer 02&gt;|Yes
gatewayId|Buffer|&lt;Buffer b8 27 eb ff fe 52 0e 51&gt;|Yes
rxpk|Object|Table 16 for instructions|Yes

TABLE 16. Description of rxpk

Field|Type|Example|Required
:-:|:-:|:-:|:-:
time|String|"2013-03-31T16:21:17.528002Z"|No
tmst|Number|3512348611|Yes
chan|Number|2|Yes
rfch|Number|0|Yes
freq|Number|433.3|Yes
stat|Number|1|Yes
modu|String|"LORA"|Yes
datr|String|"SF7BW125"|Yes
codr|String|"4/6"|Yes
rssi|Number|-35|Yes
lsnr|Number|5.1|Yes
size|Number|32|No
raw|String|"ABd6Rm9GvhaYOiTeSHNF/rJXnRMP+2E="|Yes
data|Object|Table 17 for instructions|Yes

TABLE 17. Description of data

Field|Type|Example|Required
:-:|:-:|:-:|:-:
MHDR|Object|Table 18 for instructions|Yes
MHDRRaw|Buffer|&lt;Buffer 00&gt;|Yes
MACPayload|Buffer|&lt;Buffer 17 7a 46 6f 46 be 16 98 3a 24 de 48 73 45 fe b2 83 a0&gt;|Yes
MIC|Buffer|&lt;Buffer 21 f7 23 f3&gt;|Yes

TABLE 18. Description of MHDR

Field|Type|Example|Required
:-:|:-:|:-:|:-:
MType|Number|0|Yes
Major|Number|0|Yes

## Join Server to Network Server 

The Join Server sends the join accept data and the transmission parameters to the Network Server. 

* Data format

```json
  {
    "version": "",
    "token": "",
    "identifier": "",
    "gatewayId": "",
    "rxpk": {
      "time": "",
      "tmst": "",
      "chan": "",
      "rfch": "",
      "freq": "",
      "stat": "",
      "modu": "",
      "datr": "",
      "codr": "",
      "rssi": "",
      "lsnr": "",
      "size": "",
      "raw": "",
      "data": {
        "MHDR": {
          "MType": "",
          "Major": ""
        },
        "MACPayload": "",
        "DevAddr": ""
      }
    }
  }

```

* Field description

TABLE 19. Field Description of Downlink Data Format(JS to NS)</center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
version|Buffer|&lt;Buffer 02&gt;|Yes
token|Buffer|&lt;Buffer 5c 97&gt;|Yes
identifier|Buffer|&lt;Buffer 02&gt;|Yes
gatewayId|Buffer|&lt;Buffer b8 27 eb ff fe 52 0e 51&gt;|Yes
rxpk|Object|Table 18 for instructions|Yes

TABLE 20. Description of rxpk

Field|Type|Example|Required
:-:|:-:|:-:|:-:
time|String|"2013-03-31T16:21:17.528002Z"|No
tmst|Number|3512348611|Yes
chan|Number|2|Yes
rfch|Number|0|Yes
freq|Number|433.3|Yes
stat|Number|1|Yes
modu|String|"LORA"|Yes
datr|String|"SF7BW125"|Yes
codr|String|"4/6"|Yes
rssi|Number|-35|Yes
lsnr|Number|5.1|Yes
size|Number|32|No
raw|String|"ABd6Rm9GvhaYOiTeSHNF/rJXnRMP+2E="|Yes
data|Object|Table 19 for instructions|Yes

TABLE 21. Description of data

Field|Type|Example|Required
:-:|:-:|:-:|:-:
MHDR|Object|Table 20 for instructions|Yes
MACPayload|Buffer|&lt;Buffer c7 5a e7 53 ca c2 3d de 75 29 f7 7c 36 3a 11 f6&gt;|Yes
DevAddr|Buffer|&lt;Buffer 00 08 fb 31&gt;|Yes

TABLE 22. Description of MHDR

Field|Type|Example|Required
:-:|:-:|:-:|:-:
MType|Number|1|Yes
Major|Number|0|Yes

## Network Server to Application Server 

The Network Server sends the Uplink data and the transmission parameters to the Application Server. 

* Data format

```json
  {
    "DevAddr": "",
    "FRMPayload": ""
  }

```

* Field description

TABLE 23. Field Description of Uplink Data Format(NS to AS)</center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
DevAddr|Buffer|&lt;Buffer 00 08 fb 31&gt;|Yes
FRMPayload|Buffer|&lt;Buffer c9 77 36 15&gt;|Yes
