function readInt8 (buf, offset) {
    offset = offset >>> 0;
    if (!(buf[offset] & 0x80)) return (buf[offset]);
    return ((0xff - buf[offset] + 1) * -1);
}
function readUInt8 (buf, offset) {
  offset = offset >>> 0;
  return (buf[offset]);
}
function readUInt16LE (buf, offset) {
  offset = offset >>> 0;
  return buf[offset] | (buf[offset + 1] << 8);
}
function readInt16LE (buf, offset) {
  offset = offset >>> 0;
  var val = buf[offset] | (buf[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val;
}
function readUInt32LE (buf, offset) {
  offset = offset >>> 0;
  return ((buf[offset]) |
      (buf[offset + 1] << 8) |
      (buf[offset + 2] << 16)) +
      (buf[offset + 3] * 0x1000000);
}
function uInt8toCurrentSettingsVegaMBUS2 (val) {
	var MASK_TYPE_ACTIVATION      = 0x01;
  var MASK_ACK                  = 0x02;
  var MASK_CONNECTION_PERIOD    = 0x1C;

  var typeActivation 	= ( ( val & MASK_TYPE_ACTIVATION   ) >> 0 );
  var ack             = ( ( val & MASK_ACK )               >> 1 );
	var connectPeriod  	= ( ( val & MASK_CONNECTION_PERIOD ) >> 2 );

  if      ( connectPeriod === 0x00 ) connectPeriod = 5; 
	else if ( connectPeriod === 0x04 ) connectPeriod = 15; 
	else if ( connectPeriod === 0x02 ) connectPeriod = 30; 
	else if ( connectPeriod === 0x06 ) connectPeriod = 60; 
	else if ( connectPeriod === 0x01 ) connectPeriod = 360; 
	else if ( connectPeriod === 0x05 ) connectPeriod = 720; 
	else if ( connectPeriod === 0x07 ) connectPeriod = 1440;
  
  return {
    	typeActivation: typeActivation?'ABP':'OTAA',
      ack: ack?true:false,
    	connectPeriodMin:  connectPeriod,
	};
}
function parseEnvironmentMBUS (val) {
  if ( val === 0x00 ) return 'other';
  if ( val === 0x01 ) return 'oil';
  if ( val === 0x02 ) return 'electricity';
  if ( val === 0x03 ) return 'gas';
  if ( val === 0x04 ) return 'heat';
  if ( val === 0x05 ) return 'stream';
  if ( val === 0x06 ) return 'hotWater';
  if ( val === 0x07 ) return 'water';
  if ( val === 0x08 ) return 'heatCostAllocator';
  if ( val === 0x09 ) return 'compressedAir';
  if ( val === 0x0A ) return 'CoolingLoadMeterOutlet';
  if ( val === 0x0B ) return 'CoolingLoadMeterInlet';
  if ( val === 0x0C ) return 'HeatInlet';
  if ( val === 0x0D ) return 'HeatCoolingLoadMeter';
  if ( val === 0x0E ) return 'BusSystem';
  if ( val === 0x0F ) return 'UnknownMedium';
  if ( val >= 0x10 && val <= 0x15 ) return 'Reserved10to15';
  if ( val === 0x16 ) return 'ColdWater';
  if ( val === 0x17 ) return 'DualWater';
  if ( val === 0x18 ) return 'Pressure';
  if ( val === 0x19 ) return 'ADConverter';
  if ( val >= 20 && val <= 0xFF ) return 'Reserved20toFF';
  return 'unknown';
}
function parseSettingVega (setting)
{
  var result = {
    statusParse: false
  };
  if ( setting.id === 3 )
  {
    result.name = 'typeActivation';
    var val = readUInt8(setting.rawValue,0);
    if ( val === 1 ) result.value = 'OTAA';
    else if ( val === 2 ) result.value = 'ABP';

    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 4 )
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
  else if ( setting.id === 32 )
  {
    result.name = 'mbusInterfaceSpeed';
    var val = readUInt8(setting.rawValue,0); 
    result.val = val;
    if ( val === 1 ) result.value = 300;
    else if ( val === 2 ) result.value = 600;
    else if ( val === 3 ) result.value = 1200;
    else if ( val === 5 ) result.value = 2400;
    else if ( val === 4 ) result.value = 4800;
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
  	decoder:"vega_mbus_2_v1",
    statusDecode: false
  };
  if ( fPort === 2 )
  {
    var type = bytes[0];
    if ( type === 1 )
    {
      var cs = readUInt8(bytes,2);
      var currentSettings = uInt8toCurrentSettingsVegaMBUS2(cs);

      result.type = 'currentValues';
      result.chargePercent = readUInt8(bytes,1);
      result.currentSettings = currentSettings;
      result.serialNumber = readUInt32LE(bytes,3);
      result.time = readUInt32LE(bytes,7);
      result.timeStringISO = new Date(result.time*1000).toISOString();
      result.energyConsumedWh = readUInt32LE(bytes,11);
      result.totalVolumeCoolantL = readUInt32LE(bytes,15);
      result.operatingTimeH = readUInt32LE(bytes,19);
      result.temperatureFlow = readUInt16LE(bytes,23) / 100;
      result.temperatureReturnLine = readUInt16LE(bytes,25) / 100; 
      result.currentFlowCoolantLH16 = readUInt16LE(bytes,27); 
      result.currentFlowCoolantLH32 = readUInt32LE(bytes,29); 
      result.powerW = readUInt32LE(bytes,33); 
      result.environment = parseEnvironmentMBUS(bytes[37]);
      result.statusDecode = true;
    }
    else if ( type === 3 )
    {
      result.type = 'mbusData';
      result.sizeData = readUInt16LE(bytes,1); 
      result.sizeDataPackage = readUInt8(bytes,3);
      result.numPackage = readUInt8(bytes,4);
      result.countPackage = readUInt8(bytes,5);
      result.data = bytes.slice(6);
      result.statusDecode = true;
    }
  }
  else if ( fPort === 4 )
  {
    var type = bytes[0];
    if ( type === 255 )
    {
      result.type = 'correctionTime';
      result.time = readUInt32LE(bytes,1);
      result.timeStringISO = new Date(result.time*1000).toISOString();
      result.statusDecode = true;
    }
  }
  else if ( fPort === 3 )
  {
    var type = bytes[0];
    if ( type === 0 )
    {
      result.type = 'settings';
      result.settings = {};
      var rawSettings = bytes.slice(1);
      while( rawSettings.length > 0 )
      {
        var id = readUInt16LE(rawSettings,0);
        var length = readUInt8(rawSettings,2);
        var rawValue = rawSettings.slice(3,length+3)
        result.settings[id] = {
          id: id,
          length: length,
          rawValue: rawValue
        };
        var setting = parseSettingVega(result.settings[id]);
        if ( setting.statusParse )
        {
          result.settings[id].name = setting.name;
          result.settings[id].value = setting.value;
        }
        rawSettings = rawSettings.slice(2+1+length);
      }
      result.statusDecode = true;
    }
  }
  return result;
}