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

<center>TABLE 1 Field Description of Uplink Data Format(NC to NS)</center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
version|Buffer|&lt;Buffer 02&gt;|Yes
token|Buffer|&lt;Buffer 5c 97&gt;|Yes
identifier|Buffer|&lt;Buffer 02&gt;|Yes
gatewayId|Buffer|&lt;Buffer b8 27 eb ff fe 52 0e 51&gt;|Yes
rxpk|Object|Table 2 for instructions|Yes

<center>TABLE 2 Description of rxpk </center>

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

<center>TABLE 3 Description of data </center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
MHDR|Object|Table 4 for instructions|Yes
MACPayload|Object|Table 5 for instructions|Yes
MIC|Buffer|&lt;Buffer 5c 97 73 61&gt;|Yes

<center>TABLE 4 Description of MHDR </center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
MType|Number|4|Yes
Major|Number|0|Yes

<center>TABLE 5 Description of MACPayload </center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
FHDR|Object|Table 6 for instructions|Yes
FPort|Buffer|&lt;Buffer 02&gt;|No
FRMPayload|Buffer / Array|&lt;Buffer c9 77 36 15&gt; / [1]|No

<center>TABLE 6 Description of FHDR </center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
DevAddr|Buffer|&lt;Buffer 00 96 44 72&gt;|Yes
FCtrl|Object|Table 7 for instructions|Yes
FCnt|Buffer|&lt;Buffer 5c 97&gt;|Yes
FOpts|Array|[1]|No

<center>TABLE 7 Description of FCtrl </center>

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

<center>TABLE 8 Field Description of Downlink Data Format(NS to NC)</center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
version|Buffer|&lt;Buffer 02&gt;|Yes
token|Buffer|&lt;Buffer 5c 97&gt;|Yes
identifier|Buffer|&lt;Buffer 02&gt;|Yes
gatewayId|Buffer|&lt;Buffer b8 27 eb ff fe 52 0e 51&gt;|Yes
txpk|Object|Table 9 for instructions|Yes

<center>TABLE 9 Description of txpk </center>

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

<center>TABLE 10 Description of data </center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
MHDR|Object|Table 11 for instructions|Yes
MACPayload|Object|Table 12 for instructions|Yes

<center>TABLE 11 Description of MHDR </center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
MType|Number|5|Yes
Major|Number|0|Yes

<center>TABLE 12 Description of MACPayload </center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
FHDR|Object|Table 13 for instructions|Yes
FPort|Buffer|&lt;Buffer 02&gt;|No
FRMPayload|Buffer / Array|&lt;Buffer c9 77 36 15&gt; / [1]|No

<center>TABLE 13 Description of FHDR </center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
DevAddr|Buffer|&lt;Buffer 00 96 44 72&gt;|Yes
FCtrl|Object|Table 14 for instructions|Yes
FCnt|Buffer|&lt;Buffer 5c 97&gt;|Yes
FOpts|Array|[1]|No

<center>TABLE 14 Description of FCtrl </center>

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
      "raw": ""
    }
  }
```

* Field description

<center>TABLE 15 Field Description of Uplink Data Format(NS to JS)</center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
version|Buffer|&lt;Buffer 02&gt;|Yes
token|Buffer|&lt;Buffer 5c 97&gt;|Yes
identifier|Buffer|&lt;Buffer 02&gt;|Yes
gatewayId|Buffer|&lt;Buffer b8 27 eb ff fe 52 0e 51&gt;|Yes
rxpk|Object|Table 16 for instructions|Yes

<center>TABLE 16 Description of rxpk </center>

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

<center>TABLE 17 Field Description of Downlink Data Format(JS to NS)</center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
version|Buffer|&lt;Buffer 02&gt;|Yes
token|Buffer|&lt;Buffer 5c 97&gt;|Yes
identifier|Buffer|&lt;Buffer 02&gt;|Yes
gatewayId|Buffer|&lt;Buffer b8 27 eb ff fe 52 0e 51&gt;|Yes
rxpk|Object|Table 18 for instructions|Yes

<center>TABLE 18 Description of rxpk </center>

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

<center>TABLE 19 Description of data </center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
MHDR|Object|Table 20 for instructions|Yes
MACPayload|Buffer|&lt;Buffer c7 5a e7 53 ca c2 3d de 75 29 f7 7c 36 3a 11 f6&gt;|Yes
DevAddr|Buffer|&lt;Buffer 00 08 fb 31&gt;|Yes

<center>TABLE 20 Description of MHDR </center>

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

<center>TABLE 21 Field Description of Uplink Data Format(NS to AS)</center>

Field|Type|Example|Required
:-:|:-:|:-:|:-:
DevAddr|Buffer|&lt;Buffer 00 08 fb 31&gt;|Yes
FRMPayload|Buffer|&lt;Buffer c9 77 36 15&gt;|Yes
