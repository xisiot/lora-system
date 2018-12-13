# MAC Command Organizer
The Network Server and the Network Controller implement the organization of the MAC Command.
## 1. MAC Command Queue
For each end-device, the Network Controller maintains a MAC Command queue with each element in the queue as shown in the following Table.

| Field    |                Description               |
|:--------:|:----------------------------------------:|
| CID      |             	MAC Command ID              |
| Payload  |  Byte sequence that Command may contain  |

## 2. Downlink MAC Command Algorithm

### 2.1 MAC Command Req Downlink Algorithm
The algorithm takes the time when uplink packet arrives as the start of the loop.</br>
(1) Once the uplink data arrives, if the packet contains the MAC Command, the Network Server extracts the part and sends it to the Network Controller by an array.</br>
(2) The Network Controller will read all the commands in the MAC Command Queue, and put them into the array Q, then traverse the array Q, then delete all Ans;</br>
(3) The MAC Command in the data packet which the Network Controller receives contains Ans and Req, and the Network Controller will traverse all the data packet;</br>
(4) When Encountering MAC Command Ans, the Network Controller will compare it with the MAC Command Req of the array Q, and record the position of the first unmatched Ans-Req pair as d;</br>
(5) When Encountering MAC Command Req, the Network Controller will processe it;</br>
(6) Clear the original MAC Command queue, and push all elements of array Q from position d into the new MAC Command queue;</br>
(7) Traverse MAC Command Req Queue and application data Queue</br>
(8) Construct downlink data according to the TABLE 1 policy and send it to the Network Connector by Network Server</br>
(9) The Network Connector encapsulates the LoRa packet and delivers it to the gateway.</br>

<center>TABLE 1 Downlink MAC Command and Application Data Group Package Policy</center>

|Downlink Application Data|Downlink MAC Commands|Send Downlink Packet|FOpts|FRMPayload|Other|
|:-----------------------:|:-------------------:|:------------------:|:---:|:--------:|:---:|
| not have |     not have     | no |   -  |         -       |         -                |
|   have   |     not have     | yes| null | Application Data|         -                |
| not have | have(> 15 bytes) | yes| null |        MAC      |         FPort = 0        |
| not have | have(<= 15 bytes)| yes| MAC  |       null      |         -                |
|  have    | have(> 15 bytes) | yes| null |        MAC      |FPort = 0</br>FPending = 1|
|  have    | have(<= 15 bytes)| yes| null | Application Data|         -                |

![MAC Command Queue Schematic Diagram](./image/MACCommandQUeue.png)

### 2.2 Boundary or Special Circumstances
* RXParamSetupAns, RXTimingSetupAns, DlChannelAns three types MAC Command（TBD）</br>

* Version Issue</br>
  The server is based on LoRaWAN 1.1 protocol. Before issuing the MAC Command downlink,checking the LoRaWAN version supported by the device is principal. If the LoRaWAN version of device is out of support version,the MAC Command is directly removed from the queue.

* The total number of bytes of the MAC Command Queue exceeds 15 bytes, does not exceed the maximum allowed by FRMPayload, and there is data in the application data queue.</br>
  * Command Req is all placed in FRMPayload
  * FPort = 0
  * FPending = 1 

* The total number of bytes in the MAC Command Queue exceeds the maximum allowed by FRMPayload</br>
  * Keep the last Command Req not sent
  * FPending = 1

## 3. Uplink MAC Command Algorithm
