# Vega SI-12 RELAY - pulse counter with built-in relay


## Описание устройства
<img src="https://iotvega.com/content/ru/si/si12relay/ava.jpg" width="400" />

Vega SI-12 RELAY pulse counter is designed for counting of pulses incoming to 4 independent inputs, further accumulating and transmitting of this information to the LoRaWAN® network, and for controlling low-power actuators by means of built-in relays.
In addition, Vega SI-12 RELAY can be used as a security device - all inputs can be configured as security inputs.
The counter has two relay outputs and can be used as a control device.
The pulse counter can be used for any utilities’ meters and industrial equipment with output of dry reed switch type or open-drain type.


## Description of data fields

### Current state packet

Current state packet sent on port 2 and contains the following fields:
- `currentSettings` - values of current settings, data type `Object`, contains the following fields:
    - `connectPeriodMin` - communication period (min), data type `Number`;
    - `input1Mode` - operation mode of input 1 (**pulse** - pulse, **guard** - guard);
    - `input2Mode` - operation mode of input 2 (**pulse** - pulse, **guard** - guard);
    - `input3Mode` - operation mode of input 3 (**pulse** - pulse, **guard** - guard);
    - `input4Mode` - operation mode of input 4 (**pulse** - pulse, **guard** - guard);
    - `typeActivation` - activation type, data type `String`;
- `decoder` - name and version of the decoder, data type `String`;
- `input1` - input 1 state (depending on operating mode: for pulse - number of pulses, data type `Number`; for guard - state (**closure** - close, **unlocking** - unclose), data type `String`);
- `input2` - input 2 state (depending on operating mode: for pulse - number of pulses, data type `Number`; for guard - state (**closure** - close, **unlocking** - unclose), data type `String`);
- `input3` - input 3 state (depending on operating mode: for pulse - number of pulses, data type `Number`; for guard - state (**closure** - close, **unlocking** - unclose), data type `String`);
- `input4` - input 4 state (depending on operating mode: for pulse - number of pulses, data type `Number`; for guard - state (**closure** - close, **unlocking** - unclose), data type `String`);
- `statusDecode` - data decode status (**true** if decode is successful and **false** if decode is not successful), data type `Boolean`;
- `temperature` - temperature (°С), data type `Number`;
- `time` - reading time for values in this packet in Unix-time format (sec), data type `Number`;
- `timeStringISO` - reading time for values in this packet in ISO format, data type `String`;
- `type` - packet type, data type `String`.

An example of decoded message:

<img src="images/port2Message.png" width="400" />


### Time correction request packet

Time correction request packet sent on port 4 and contains the following fields:
- `decoder` - name and version of the decoder, data type `String`;
- `statusDecode` - data decode status (**true** if decode is successful and **false** if decode is not successful), data type `Boolean`;
- `time` - reading time for values in this packet in Unix-time format (sec), data type `Number`;
- `timeStringISO` - reading time for values in this packet in ISO format, data type `String`;
- `type` - packet type, data type `String`.

An example of decoded message:

<img src="images/port4Message.png" width="400" />


### Setting packet

Setting packet sent on port 3 and contains the following fields:
- `decoder` - name and version of the decoder, data type `String`;
- `settings` - current device settings values, data type `Object` (object keys are setting identifiers);
- `statusDecode` - data decode status (**true** if decode is successful and **false** if decode is not successful), data type `Boolean`;
- `type` - packet type, data type `String`.

Setting object contains the following fields:
- `id` - unique identifier for the setting, data type `Number`;
- `length` - setting value length (байт), data type `Number`;
- `name` - setting name, data type `String`;
- `rawValue` - raw setting value, data type `String`;
- `value` - setting value, data type depends on parameter.

An example of decoded message:

<img src="images/port3Message.png" width="400" />