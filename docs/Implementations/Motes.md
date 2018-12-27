## Motes Emulator

This is a useful tool to emulate end devices (a.k.a. Motes) and test LoRa server based on *LoRaWAN™* *1.0.2 protocol*. 

### Requirements

* Python 3.6
* Linux

### Installation

* Use pip to install pipenv:

```sh
  (sudo) pip3 install pipenv
```

* Clone this repo into a directory:

```sh
  git clone https://github.com/houluy/lora-motes-emulator.git
```

* Use pipenv to create a virtual Python enviroment and install all the dependencies:

```sh
  pipenv --python 3 install
```

### See the Helps

```sh
pipenv run python main.py -h
```

or by:

```sh
pipenv shell
python main.py -h
```

### Usage

This tool can be used step by step as follows,

1. Copy a local *config* file and *device info* file from the templates, then modify the *src* and *dest* address as the address of test server and LoRa server.

2. Modify device information in `device.json` you just copied. The information fields include *AppEUI*, *DevEUI*, *AppKey* and *GatewayEUI* (a.k.a. *GatewayID*).

3. Install the tool, and start the virtual shell by command `pipenv shell`.
4. Totally four kinds of LoRa messages are supported: *pull data*, *join confirmed data up* (with or without *FOpts*) and *MAC Commands* *in FRMPayload field*. The examples are shown below:

```
python main.py pull

python main.py join

python main.py app -m (your uplink message, will be encoded by UTF-8) -f (your MACCommand in FOpts field)

python main.py mac -c (your MAC Command in FRMPayload field)
```

If this is your first-time running, run *pull* and *join* commands in the very beginning to register the port of gateway and the LoRa device. The device info will be saved automatically in *models/device.pkl* using *pickle*, and loaded next time. Then, you can use *app* or *mac* to test your server. Here are the examples.

```
python main.py app -m helloworld -f 0302
python main.py mac -c 0302
```

### Contributions

This repo is hosted on <https://github.com/houluy/lora-motes-emulator> and under *MIT license*, any contribution or suggestion is welcome. Just open an issue or send a pull request.