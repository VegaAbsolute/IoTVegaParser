function readInt8(buf, offset) {
    offset = offset >>> 0;
    if (!(buf[offset] & 0x80)) return buf[offset];
    return (0xff - buf[offset] + 1) * -1;
}
function readUInt8(buf, offset) {
    offset = offset >>> 0;
    return buf[offset];
}
function readUInt16LE(buf, offset) {
    offset = offset >>> 0;
    return buf[offset] | (buf[offset + 1] << 8);
}
function readInt16LE(buf, offset) {
    offset = offset >>> 0;
    var val = buf[offset] | (buf[offset + 1] << 8);
    return val & 0x8000 ? val | 0xffff0000 : val;
}
function readUInt32LE(buf, offset) {
    offset = offset >>> 0;
    return (
        (buf[offset] | (buf[offset + 1] << 8) | (buf[offset + 2] << 16)) +
        buf[offset + 3] * 0x1000000
    );
}
function readUInt64LE(buf, offset) {
  offset = offset >>> 0;
  const lo =
      (buf[offset] | (buf[offset + 1] << 8) | (buf[offset + 2] << 16)) +
      buf[offset + 3] * 0x1000000;
  const hi =
      (buf[offset + 4] | (buf[offset + 5] << 8) | (buf[offset + 6] << 16)) +
      buf[offset + 7] * 0x1000000;
  return lo + hi * 0x100000000;
}

function parseReasonVega(val) {
    if (val === 0) return "byTime";
    else if (val === 1) return "bySecurityInput1Triggered";
    else if (val === 2) return "bySecurityInput2Triggered";
    else if (val === 4) return "byModBusRtuData";
    else if (val === 5) return "byTransparentChannelData";
    else if (val === 6) return "byModBusRtuData";
    else if (val === 7) return "byElectricityMeterPolling";
    else if (val === 8) return "byHeatMeterPolling";
    else if (val === 9) return "byNoAnswerFromDevice";
    else if (val === 10) return "byNoAnswerFromModBusRequest";
    else if (val === 11) return "byDeviceCommunicationRestored";
    else if (val === 12) return "byDeviceCommunicationModBusRestored";
    else if (val === 13) return "byTransparentChannelData";
    else if (val === 17) return "byElectricityMeterPollingExtended";
    else if (val === 21) return "byInput1ThresholdExceeded";
    else if (val === 22) return "byInput2ThresholdExceeded";
    else if (val === 30) return "byRequest";
    else if (val === 208) return "byExternalPowerSwitchOff";
    else if (val === 209) return "byExternalPowerSwitchOn";

    return "unknown";
}

function parseTxPeriod(rawPeriod) {
    switch (rawPeriod) {
        case 0b000:
            return 5;
        case 0b001:
            return 15;
        case 0b010:
            return 30;
        case 0b011:
            return 60;
        case 0b100:
            return 60 * 6;
        case 0b101:
            return 60 * 12;
        case 0b110:
            return 60 * 24;
        default:
            return 0;
    }
}

function parseInterfaceMode(rawMode) {
    switch (rawMode) {
        case 0b00:
            return "transparent";
        case 0b01:
            return "metering";
        case 0b10:
            return "modbus";
        case 0b11:
            return "custom";
        default:
            return "unknown";
    }
}

function parseDeviceType(rawType) {
    switch (rawType) {
        case 1:
            return "Энергомера 102М";
        case 2:
            return "Меркурий 206";
        case 3:
            return "Пульс СТК-15";
        case 4:
            return "Меркурий 234";
        case 5:
            return "Ленэнерго";
        case 6:
            return "Пульсар";
        default:
            return "unknown";
    }
}

function parseEnvironment(rawEnvironment) {
    if (val === 0x00) return "Other";
    if (val === 0x01) return "Oil";
    if (val === 0x02) return "Electricity";
    if (val === 0x03) return "Gas";
    if (val === 0x04) return "Heat";
    if (val === 0x05) return "Stream";
    if (val === 0x06) return "HotWater";
    if (val === 0x07) return "Water";
    if (val === 0x08) return "HeatCostAllocator";
    if (val === 0x09) return "CompressedAir";
    if (val === 0x0a) return "CoolingLoadMeterOutlet";
    if (val === 0x0b) return "CoolingLoadMeterInlet";
    if (val === 0x0c) return "HeatInlet";
    if (val === 0x0d) return "HeatCoolingLoadMeter";
    if (val === 0x0e) return "BusSystem";
    if (val === 0x0f) return "UnknownMedium";
    if (val >= 0x10 && val <= 0x15) return "Reserved10to15";
    if (val === 0x16) return "ColdWater";
    if (val === 0x17) return "DualWater";
    if (val === 0x18) return "Pressure";
    if (val === 0x19) return "ADConverter";
    if (val >= 20 && val <= 0xff) return "Reserved20toFF";
    return "unknown";
}

function parseMainSettings(settingsByte) {
    var ack = (settingsByte & 0b00000001) > 0;
    var input1Mode = (settingsByte & 0b00000010) >> 1;
    var input2Mode = (settingsByte & 0b00000100) >> 2;
    var periodRaw = (settingsByte & 0b00111000) >> 3;
    var period = parseTxPeriod(periodRaw);
    var interfaceModeRaw = (settingsByte & 0b11000000) >> 6;
    var interfaceMode = parseInterfaceMode(interfaceModeRaw);

    return {
        ack,
        input1Mode,
        input2Mode,
        period,
        interfaceMode,
    };
}

function parsePort2Packet(bytes, out) {
    var rawReason = readUInt8(bytes, 0);
    out.reason = parseReasonVega(rawReason);

    switch (rawReason) {
        case 0:
        case 1:
        case 2:
        case 21:
        case 22:
        case 30:
        case 208:
        case 209:
            return parseSiPacket(bytes, out);
        case 4:
            return parseModBusPacket04(bytes, out);
        case 5:
            return parseTransparentPacket05(bytes, out);
        case 13:
            return parseTransparentPacket13(bytes, out);
        case 6:
            return parseModBusPacket06(bytes, out);
        case 7:
            return parseElectroPacket(bytes, out);
        case 8:
            return parseHeatPacket(bytes, out);
        case 9:
            return parseNoAnswerPacket(bytes, out);
        case 10:
            return parseNoAnswerModBusPacket(bytes, out);
        case 11:
            return parseLinkRestoredPacket(bytes, out);
        case 12:
            return parseLinkRestoredModBusPacket(bytes, out);
        case 17:
            return parseElectroExtendedPacket(bytes, out);
    }

    return false;
}

function parseSiPacket(bytes, out) {
    out.time = readUInt32LE(bytes, 1);
    out.timeStringISO = new Date(out.time * 1000).toISOString();
    out.temperature = readInt8(bytes, 5);
    out.input1State = readUInt32LE(bytes, 6);
    out.input2State = readUInt32LE(bytes, 10);
    var rawSettings = readUInt8(bytes, 14);
    out.settings = parseMainSettings(rawSettings);
    out.chargePercent = readUInt8(bytes, 15);

    return true;
}

function parseModBusPacket04(bytes, out) {
    out.settingNumber = readUInt8(bytes, 1);
    out.totalSize = readUInt16LE(bytes, 2);
    out.packetSize = readUInt8(bytes, 4);
    out.sequenceNumber = readUInt8(bytes, 5);
    out.packetCount = readUInt8(bytes, 6);
    out.startRegisterAddr = readInt16LE(bytes, 7);
    out.data = bytes.slice(9);

    return true;
}

function parseTransparentPacket05(bytes, out) {
    out.time = readUInt32LE(bytes, 1);
    out.timeStringISO = new Date(out.time * 1000).toISOString();
    out.settingNumber = readUInt8(bytes, 5);
    out.totalSize = readUInt16LE(bytes, 6);
    out.packetSize = readUInt8(bytes, 8);
    out.sequenceNumber = readUInt8(bytes, 9);
    out.packetCount = readUInt8(bytes, 10);
    out.data = bytes.slice(11);

    return true;
}

function parseTransparentPacket13(bytes, out) {
    out.settingNumber = readUInt8(bytes, 1);
    out.totalSize = readUInt16LE(bytes, 2);
    out.packetSize = readUInt8(bytes, 4);
    out.sequenceNumber = readUInt8(bytes, 5);
    out.packetCount = readUInt8(bytes, 6);
    out.data = bytes.slice(7);

    return true;
}

function parseModBusPacket06(bytes, out) {
    out.time = readUInt32LE(bytes, 1);
    out.timeStringISO = new Date(out.time * 1000).toISOString();
    out.settingNumber = readUInt8(bytes, 5);
    out.totalSize = readUInt16LE(bytes, 6);
    out.packetSize = readUInt8(bytes, 8);
    out.sequenceNumber = readUInt8(bytes, 9);
    out.packetCount = readUInt8(bytes, 10);
    out.startRegisterAddr = readInt16LE(bytes, 11);
    out.data = bytes.slice(13);

    return true;
}

function parseElectroPacket(bytes, out) {
    var meterTypeRaw = readUInt8(bytes, 1);
    out.meterType = parseDeviceType(meterTypeRaw);
    out.serialNumber = readUInt32LE(bytes, 2);
    out.isPollSuccess = readUInt8(bytes, 6) > 0;
    out.time = readUInt32LE(bytes, 7);
    out.timeStringISO = new Date(out.time * 1000).toISOString();
    out.tariff1Reading = readUInt32LE(bytes, 11) / 100;
    out.tariff2Reading = readUInt32LE(bytes, 15) / 100;
    out.tariff3Reading = readUInt32LE(bytes, 19) / 100;
    out.tariff4Reading = readUInt32LE(bytes, 23) / 100;

    return true;
}

function parseHeatPacket(bytes, out) {
    var meterTypeRaw = readUInt8(bytes, 1);
    out.meterType = parseDeviceType(meterTypeRaw);
    out.serial = readUInt32LE(bytes, 2);
    out.time = readUInt32LE(bytes, 6);
    out.timeStringISO = new Date(out.time * 1000).toISOString();
    out.energyConsumed = readUInt64LE(bytes, 10) / 10;
    out.totalVolumeCoolant = readUInt32LE(bytes, 18);
    out.operatingTime = readUInt32LE(bytes, 22);
    out.temperatureSupply = readUInt16LE(bytes, 26) / 100;
    out.temperatureReturn = readUInt16LE(bytes, 28) / 100;
    out.currentFlowCoolant = readInt16LE(bytes, 30);
    out.currentFlowCoolant32 = readUInt32LE(bytes, 32);
    out.power = readUInt32LE(bytes, 36);
    var environmentRaw = readUInt8(bytes, 40);
    out.environment = parseEnvironment(environmentRaw);

    return true;
}

function parseNoAnswerPacket(bytes, out) {
    out.settingNumber = readUInt8(bytes, 1);
    var meterTypeRaw = readUInt8(bytes, 2);
    out.meterType = parseDeviceType(meterTypeRaw);
    out.serial = readUInt32LE(bytes, 3);

    return true;
}


function parseNoAnswerModBusPacket(bytes, out) {
    out.settingNumber = readUInt8(bytes, 1);

    return true;
}

function parseLinkRestoredPacket(bytes, out) {
    out.settingNumber = readUInt8(bytes, 1);
    var meterTypeRaw = readUInt8(bytes, 2);
    out.meterType = parseDeviceType(meterTypeRaw);
    out.serial = readUInt32LE(bytes, 3);

    return true;
}

function parseLinkRestoredModBusPacket(bytes, out) {
    out.settingNumber = readUInt8(bytes, 1);

    return true;
}

function parseElectroExtendedPacket(bytes, out) {
    var meterTypeRaw = readUInt8(bytes, 1);
    out.meterType = parseDeviceType(meterTypeRaw);
    out.serial = readUInt32LE(bytes, 2);
    out.isPollSuccess = readUInt8(bytes, 6) > 0;
    out.time = readUInt32LE(bytes, 7);
    out.timeStringISO = new Date(out.time * 1000).toISOString();
    out.phaseAVoltage = readInt16LE(bytes, 11) / 100;
    out.phaseBVoltage = readInt16LE(bytes, 13) / 100;
    out.phaseCVoltage = readInt16LE(bytes, 15) / 100;
    out.phaseACurrent = readInt16LE(bytes, 17) / 1000;
    out.phaseBCurrent = readInt16LE(bytes, 19) / 1000;
    out.phaseCCurrent = readInt16LE(bytes, 21) / 1000;
    out.phasePowerFactorSum = readInt16LE(bytes, 23) / 10;
    out.phaseAPowerFactor = readInt16LE(bytes, 25) / 10;
    out.phaseBPowerFactor = readInt16LE(bytes, 27) / 10;
    out.phaseCPowerFactor = readInt16LE(bytes, 29) / 10;
    out.phaseAAngle = readInt16LE(bytes, 31) / 10;
    out.phaseBAngle = readInt16LE(bytes, 33) / 10;
    out.phaseCAngle = readInt16LE(bytes, 35) / 10;
    out.frequency = readInt16LE(bytes, 37) / 100;

    return true;
}

function parsePort3Packet(bytes, result){
    var type = bytes[0];
    if (type !== 0) return false;

    result.type = "settings";
    result.settings = {};
    var rawSettings = bytes.slice(1);
    while (rawSettings.length > 0) {
        var id = readUInt16LE(rawSettings, 0);
        var length = readUInt8(rawSettings, 2);
        var rawValue = rawSettings.slice(3, length + 3);
        result.settings[id] = {
            id: id,
            length: length,
            rawValue: rawValue,
        };

        var setting = parseSettingVega(result.settings[id]);
        if (setting.statusParse) {
            result.settings[id].name = setting.name;
            result.settings[id].value = setting.value;
        }
        rawSettings = rawSettings.slice(2 + 1 + length);
    }
    result.statusDecode = true;
    
}

function parseSettingVega (setting)
{
  var result = {
    statusParse: false
  };
  if ( setting.id === 4 )
  {
    result.name = 'confirmedUplinks';
    var val = readUInt8(setting.rawValue,0); 
    if ( val === 1 ) result.value = 'confirmed';
    else if ( val === 2 ) result.value = 'unconfirmed';
    else result.value = 'notValidValue';

    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 5 )
  {
    result.name = 'adr';
    var val = readUInt8(setting.rawValue,0); 
    if ( val === 1 ) result.value = 'enable';
    else if ( val === 2 ) result.value = 'disable';
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 8 )
  {
    result.name = 'countsUplinks';
    var val = readUInt8(setting.rawValue,0); 
    if ( val >= 1 && val <= 15 ) result.value = val;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 12 )
  {
    result.name = 'input1Mode';
    var val = readUInt8(setting.rawValue,0); 
    if ( val === 1 ) result.value = 'pulse';
    else if ( val === 2 ) result.value = 'guard';
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 13 )
  {
    result.name = 'input2Mode';
    var val = readUInt8(setting.rawValue,0); 
    if ( val === 1 ) result.value = 'pulse';
    else if ( val === 2 ) result.value = 'guard';
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 14 )
  {
    result.name = 'input3Mode';
    var val = readUInt8(setting.rawValue,0); 
    if ( val === 1 ) result.value = 'pulse';
    else if ( val === 2 ) result.value = 'guard';
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 15 )
  {
    result.name = 'input4Mode';
    var val = readUInt8(setting.rawValue,0); 
    if ( val === 1 ) result.value = 'pulse';
    else if ( val === 2 ) result.value = 'guard';
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 16 )
  {
    result.name = 'communicationPeriodMin';
    var val = readUInt8(setting.rawValue,0); 
    if ( val === 1 ) result.value = 60;
    else if ( val === 2 ) result.value = 360;
    else if ( val === 3 ) result.value = 720;
    else if ( val === 4 ) result.value = 1440;
    else if ( val === 5 ) result.value = 5;
    else if ( val === 6 ) result.value = 15;
    else if ( val === 7 ) result.value = 30;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 20){
    result.name = 'interfaceSpeed';
    var speed = readUInt8(setting.rawValue,0); 
    if( speed === 1) result.value = 4800;
    else if( speed === 2) result.value = 9600;
    else if( speed === 3) result.value = 14400;
    else if( speed === 4) result.value = 19200;
    else if( speed === 5) result.value = 38400;
    else if( speed === 6) result.value = 57600;
    else if( speed === 7) result.value = 115200;
    else if( speed === 8) result.value = 300;
    else if( speed === 9) result.value = 600;
    else if( speed === 10) result.value = 1200;
    else if( speed === 11) result.value = 2400;
    else result.value = 'notValidValue';

    result.statusParse = true;
  }
  else if ( setting.id === 21){
    result.name = 'responseTimeout';
    result.value = readUInt16LE(setting.rawValue, 0);

    result.statusParse = true;
  }
  else if ( setting.id === 32 )
  {
    result.name = 'mbusInterfaceSpeed';
    var val = readUInt8(setting.rawValue,0); 
    if ( val === 1 ) result.value = 300;
    else if ( val === 2 ) result.value = 600;
    else if ( val === 3 ) result.value = 1200;
    else if ( val === 4 ) result.value = 2400;
    else if ( val === 5 ) result.value = 4800;
    else if ( val === 6 ) result.value = 9600;
    else if ( val === 7 ) result.value = 19200;
    else if ( val === 8 ) result.value = 38400;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 33 )
  {
    result.name = 'externalMbusDeviceType';
    var val = readUInt8(setting.rawValue,0); 
    if ( val === 0 ) result.value = 'notSet';
    else if ( val === 1 ) result.value = 'teplouchet1';
    else if ( val === 2 ) result.value = 'ste21Berill';
    else if ( val === 3 ) result.value = 'danfossSonometer500';
    else if ( val === 4 ) result.value = 'elfM';
    else if ( val === 5 ) result.value = 'weser';
    else if ( val === 6 ) result.value = 'multical801';
    else if ( val === 7 ) result.value = 'multical402';
    else if ( val === 8 ) result.value = 'lamdisGyrCommon';
    else if ( val === 9 ) result.value = 'sharky775';
    else if ( val === 10 ) result.value = 'pulsar';
    else if ( val === 11 ) result.value = 'sonosafe10';
    else if ( val === 12 ) result.value = 'calecSt11';
    else if ( val === 13 ) result.value = 'abb';
    else if ( val === 14 ) result.value = 'sensonic11';
    else if ( val === 15 ) result.value = 'calecSt11v2';
    else if ( val === 16 ) result.value = 'zennerMultidataWr3';
    else if ( val === 17 ) result.value = 'pulseStk15';
    else if ( val === 18 ) result.value = 'hitermPutm1';
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if( setting.id === 34){
    result.name = 'dataBitsCount';
    var dataBitsCountRaw = readUInt8(setting.rawValue, 0);
    if(dataBitsCountRaw === 1) result.value = 7;
    else if(dataBitsCountRaw === 2) result.value = 8;
    else result.value = 'notValidValue';

    result.statusParse = true;    
  }
  else if( setting.id === 35){
    result.name = 'stopBitsCount';
    var dataBitsCountRaw = readUInt8(setting.rawValue, 0);
    if(dataBitsCountRaw === 1) result.value = 1;
    else if(dataBitsCountRaw === 2) result.value = 2;
    else result.value = 'notValidValue';

    result.statusParse = true;    
  }
  else if( setting.id === 37){
    result.name = 'parity';
    var dataBitsCountRaw = readUInt8(setting.rawValue, 0);
    if(dataBitsCountRaw === 1) result.value = "none";
    else if(dataBitsCountRaw === 2) result.value = "even";
    else if(dataBitsCountRaw === 3) result.value = "odd";
    else result.value = 'notValidValue';

    result.statusParse = true;    
  }
  else if ( setting.id === 38 )
  {
    result.name = 'sendAlarmMessageOnOpeningSensor1';
    var val = readUInt8(setting.rawValue,0);
    if ( val === 1 ) result.value = 'onClose';
    else if ( val === 2 ) result.value = 'onOpen';
    else if ( val === 3 ) result.value = 'onCloseAndOnOpen';
    else if ( val === 4 ) result.value = 'never';
    else result.value = 'notValidValue';

    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 39 )
  {
    result.name = 'sendAlarmMessageOnOpeningSensor2';
    var val = readUInt8(setting.rawValue,0);
    if ( val === 1 ) result.value = 'onClose';
    else if ( val === 2 ) result.value = 'onOpen';
    else if ( val === 3 ) result.value = 'onCloseAndOnOpen';
    else if ( val === 4 ) result.value = 'never';
    else result.value = 'notValidValue';

    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 43 )
  {
    result.name = 'autoArmingTimeout';
    var val = readUInt8(setting.rawValue,0);
    result.value = val;

    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 44 )
  {
    result.name = 'motionSensibility';
    var val = readUInt8(setting.rawValue,0);
    if ( val === 1 ) result.value = 'low';
    else if ( val === 2 ) result.value = 'middle';
    else if ( val === 3 ) result.value = 'high';
    else result.value = 'notValidValue';

    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 48 )
  {
    result.name = 'tpHeatTimeS';
    var val = readUInt8(setting.rawValue,0); 
    if ( val >= 1 && val <= 255 ) result.value = val;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 49 )
  {
    result.name = 'dataCollectionPeriodMin';
    var val = readUInt8(setting.rawValue,0); 
    if ( val === 1 ) result.value = 60;
    else if ( val === 2 ) result.value = 360;
    else if ( val === 3 ) result.value = 720;
    else if ( val === 4 ) result.value = 1440;
    else if ( val === 5 ) result.value = 5;
    else if ( val === 6 ) result.value = 15;
    else if ( val === 7 ) result.value = 30;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 55 )
  {
    result.name = 'timeZoneMin';
    var val = readInt16LE(setting.rawValue,0); 
    if ( val >= -720 && val <= 840 ) result.value = val;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 62 )
  {
    result.name = 'collectionPeriodMovementMin';
    var val = readUInt8(setting.rawValue,0); 
    if ( val === 1 ) result.value = 60;
    else if ( val === 2 ) result.value = 360;
    else if ( val === 3 ) result.value = 720;
    else if ( val === 4 ) result.value = 1440;
    else if ( val === 5 ) result.value = 5;
    else if ( val === 6 ) result.value = 15;
    else if ( val === 7 ) result.value = 30;
    else if ( val === 8 ) result.value = 1;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 63 )
  {
    result.name = 'transmissionPeriodMovementMin';
    var val = readUInt8(setting.rawValue,0); 
    if ( val === 1 ) result.value = 60;
    else if ( val === 2 ) result.value = 360;
    else if ( val === 3 ) result.value = 720;
    else if ( val === 4 ) result.value = 1440;
    else if ( val === 5 ) result.value = 5;
    else if ( val === 6 ) result.value = 15;
    else if ( val === 7 ) result.value = 30;
    else if ( val === 8 ) result.value = 1;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 71 )
  {
    result.name = 'generateAlarmStartMovement';
    var val = readUInt8(setting.rawValue,0); 
    if ( val === 0 ) result.value = 'doNotGenerate';
    else if ( val === 1 ) result.value = 'generate';
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 78 )
  {
    result.name = 'collectionPeriodTemperatureOutOfRange';
    var val = readUInt8(setting.rawValue,0);
    if ( val === 1 ) result.value = 60;
    else if ( val === 2 ) result.value = 360;
    else if ( val === 3 ) result.value = 720;
    else if ( val === 4 ) result.value = 1440;
    else if ( val === 5 ) result.value = 5;
    else if ( val === 6 ) result.value = 15;
    else if ( val === 7 ) result.value = 30;
    else result.value = 'notValidValue';

    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 79 )
  {
    result.name = 'sendAlarmMessageOnParametersOutOfRange';
    var val = readUInt8(setting.rawValue,0);
    if ( val === 0 ) result.value = 'disable';
    else if ( val === 1 ) result.value = 'enable';
    else result.value = 'notValidValue';

    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 80 )
  {
    result.name = 'lowTemperature';
    var val = readInt8(setting.rawValue,0); 
    if ( val >= -40 && val <= 85 ) result.value = val;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 81 )
  {
    result.name = 'highTemperature';
    var val = readInt8(setting.rawValue,0); 
    if ( val >= -40 && val <= 85 ) result.value = val;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 88 )
  {
    result.name = 'lowHumidityPercent';
    var val = readUInt8(setting.rawValue,0); 
    if ( val >= 0 && val <= 100 ) result.value = val;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 89 )
  {
    result.name = 'highHumidityPercent';
    var val = readUInt8(setting.rawValue,0); 
    if ( val >= 0 && val <= 100 ) result.value = val;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 115 )
  {
    result.name = 'lowNoisedB';
    var val = readUInt8(setting.rawValue,0); 
    if ( val >= 40 && val <= 110 ) result.value = val;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 116 )
  {
    result.name = 'highNoisedB';
    var val = readUInt8(setting.rawValue,0); 
    if ( val >= 40 && val <= 110 ) result.value = val;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 117 )
  {
    result.name = 'lowLightLux';
    var val = readUInt16LE(setting.rawValue,0); 
    if ( val >= 0 && val <= 10000 ) result.value = val;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 118 )
  {
    result.name = 'highLightLux';
    var val = readUInt16LE(setting.rawValue,0); 
    if ( val >= 0 && val <= 10000 ) result.value = val;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 119 )
  {
    result.name = 'lowCO2ppm';
    var val = readUInt16LE(setting.rawValue,0); 
    if ( val >= 0 && val <= 40000 ) result.value = val;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 120 )
  {
    result.name = 'highCO2ppm';
    var val = readUInt16LE(setting.rawValue,0); 
    if ( val >= 0 && val <= 40000 ) result.value = val;
    else result.value = 'notValidValue';
    
    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 124 )
  {
    result.name = 'sendUplinkOnAutoArming';
    var val = readUInt8(setting.rawValue,0);
    if ( val === 0 ) result.value = 'disable';
    else if ( val === 1 ) result.value = 'enable';
    else result.value = 'notValidValue';

    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  return result;
}

function Decode (fPort, bytes, variables) {
    var result = {
        decoder: "vega_si_22_v1",
        statusDecode: false,
    };
    if (fPort === 2) {
        result.statusDecode = parsePort2Packet(bytes, result);
    } else if (fPort === 4) {
        var type = bytes[0];
        if (type === 255) {
            result.type = "correctionTime";
            result.time = readUInt32LE(bytes, 1);
            result.timeStringISO = new Date(result.time * 1000).toISOString();
            result.statusDecode = true;
        }
    } else if (fPort === 3) {
        result.statusDecode = parsePort3Packet(bytes, result);
    }
    return result;
}
