# Betar-Vega SGBM-1.6 - small-sized household gas meter


## Device description
<img src="https://iotvega.com/content/ru/sve/sgbm/ava.jpg" width="400" />

The SGBM-1.6 meter is designed to measure the volume of gas when gas consumption by individual consumers in housing and communal services is counted. Accumulated readings are transmitted to the LoRaWAN® network. Meters are distinguished by the ability to install both on the vertical and horizontal lowering of the gas pipeline.


## Description of data fields

### Current readings packet

Current readings packet sent on port 2 and contains the following fields:
- `chargePercent` - battery charge (%), data type `Number`;
- `consumption` - current readings (cbm), data type `Number`;
- `decoder` - name and version of the decoder, data type `String`;
- `rebootsNumber` - number of module reboots `Number`;
- `statusDecode` - data decode status (**true** if decode is successful and **false** if decode is not successful), data type `Boolean`;
- `temperature` - temperature (°С), data type `Number`;
- `time` - reading time for values in this packet in Unix-time format (sec), data type `Number`;
- `timeStringISO` - reading time for values in this packet in ISO format, data type `String`;
- `type` - packet type, data type `String`.


### Time correction request packet

Time correction request packet sent on port 4 and contains the following fields:
- `decoder` - name and version of the decoder, data type `String`;
- `statusDecode` - data decode status (**true** if decode is successful and **false** if decode is not successful), data type `Boolean`;
- `time` - reading time for values in this packet in Unix-time format (sec), data type `Number`;
- `timeStringISO` - reading time for values in this packet in ISO format, data type `String`;
- `type` - packet type, data type `String`.


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