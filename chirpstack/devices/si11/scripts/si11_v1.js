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
function encodeValue(length, value, res) {
  for (let i = 1; i <= length; i++) {
    const offset = 8*(i-1);
    res.push(
      (value >> offset) & 0xFF
    );
  }
}
function uInt8toCurrentSettingsVegaSI (val) {
	var MASK_TYPE_ACTIVATION      = 0x01;
    var MASK_CONNECTION_PERIOD    = 0x0E;
    var MASK_TYPE_INPUT_1         = 0x10;
    var MASK_TYPE_INPUT_2         = 0x20;
    var MASK_TYPE_INPUT_3         = 0x40;
    var MASK_TYPE_INPUT_4         = 0x80;
  	var typeActivation 	= ( ( val & MASK_TYPE_ACTIVATION   ) >> 0 );
	var connectPeriod  	= ( ( val & MASK_CONNECTION_PERIOD ) >> 1 );
	var typeInput1    	= ( ( val & MASK_TYPE_INPUT_1 )      >> 4 );
	var typeInput2    	= ( ( val & MASK_TYPE_INPUT_2 )      >> 5 );
	var typeInput3    	= ( ( val & MASK_TYPE_INPUT_3 )      >> 6 );
	var typeInput4    	= ( ( val & MASK_TYPE_INPUT_4 )      >> 7 );
  	if      ( connectPeriod === 0x00 ) connectPeriod = 5; 
	else if ( connectPeriod === 0x04 ) connectPeriod = 15; 
	else if ( connectPeriod === 0x02 ) connectPeriod = 30; 
	else if ( connectPeriod === 0x06 ) connectPeriod = 60; 
	else if ( connectPeriod === 0x01 ) connectPeriod = 360; 
	else if ( connectPeriod === 0x05 ) connectPeriod = 720; 
	else if ( connectPeriod === 0x07 ) connectPeriod = 1440;
  	return {
    	typeActivation: typeActivation?'ABP':'OTAA',
    	connectPeriodMin:  connectPeriod,
    	typeInput1: typeInput1?'guard':'pulse',
    	typeInput2: typeInput2?'guard':'pulse',
    	typeInput3: typeInput3?'guard':'pulse',
    	typeInput4: typeInput4?'guard':'pulse',
	};
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
  return { data: result };
}
function decodeUplink (input) {
  var fPort = input.fPort;
  var bytes = input.bytes;
  var variables = input.variables;
  var result = {
  	decoder:"vega_si_11_v1",
    statusDecode: false
  };
  if ( fPort === 2 )
  {
    var type = bytes[0];
    if ( type === 1 )
    {
      var cs = readUInt8(bytes,2);
      var currentSettings = uInt8toCurrentSettingsVegaSI(cs);
      
      result.type = 'currentValues';
      result.chargePercent = readUInt8(bytes,1);
      result.currentSettings = currentSettings;
      result.time = readUInt32LE(bytes,3);
      result.timeStringISO = new Date(result.time*1000).toISOString();
      result.temperature = readInt8(bytes,7);
      result.input1 = readUInt32LE(bytes,8);
      result.input2 = readUInt32LE(bytes,12);
      result.input3 = readUInt32LE(bytes,16);
      result.input4 = readUInt32LE(bytes,20);
      if ( currentSettings.typeInput1 === 'guard'  ) result.input1 = result.input1 ? 'closure' : 'unlocking';
      if ( currentSettings.typeInput2 === 'guard'  ) result.input2 = result.input2 ? 'closure' : 'unlocking';
      if ( currentSettings.typeInput3 === 'guard'  ) result.input3 = result.input3 ? 'closure' : 'unlocking';
      if ( currentSettings.typeInput4 === 'guard'  ) result.input4 = result.input4 ? 'closure' : 'unlocking';
      result.statusDecode = true;
    }
    else if ( type === 2 )
    {
      var cs = readUInt8(bytes,2);
      var currentSettings = uInt8toCurrentSettingsVegaSI(cs);
      
      result.type = 'danger';
      result.charge = readUInt8(bytes,1);
	  result.currentSettings = currentSettings;
      result.danger_input = readUInt8(bytes,3);
      result.time = readUInt32LE(bytes,4);
      result.timeStringISO = new Date(result.time*1000).toISOString();
      result.input1 = readUInt32LE(bytes,8);
      result.input2 = readUInt32LE(bytes,12);
      result.input3 = readUInt32LE(bytes,16);
      result.input4 = readUInt32LE(bytes,20);
      if ( currentSettings.typeInput1 === 'guard'  ) result.input1 = result.input1 ? 'closure' : 'unlocking';
      if ( currentSettings.typeInput2 === 'guard'  ) result.input2 = result.input2 ? 'closure' : 'unlocking';
      if ( currentSettings.typeInput3 === 'guard'  ) result.input3 = result.input3 ? 'closure' : 'unlocking';
      if ( currentSettings.typeInput4 === 'guard'  ) result.input4 = result.input4 ? 'closure' : 'unlocking';
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
function Encode(fPort, obj, variables) {
  const res = [];
  if ( fPort === 3 ) 
  {
    let rawType = 0;
    const lengthMap = {
      '4': 1,
      '8': 1,
      '12': 1,
      '13': 1,
      '14': 1,
      '15': 1,
      '16': 1,
      '49': 1,
      '55': 2,
    };
    const type = obj.type;
    if (type === 'set_settings') {
      rawType = 0;
      res.push(rawType);
    }
    else if (type === 'get_settings') {
      rawType = 1;
      res.push(rawType);
      return res;
    }
    else return res;
    const settings = obj.settings
    if (settings && typeof settings === 'object' && Array.isArray(settings))
    {
      settings.forEach(setting => {
        if (!setting || typeof setting !== 'object') return;
        const { value } = setting;
        const id = parseInt(setting.id, 10);
        const length = lengthMap[String(id)];
        if (typeof id !== 'number') return;
        if (id === 4) {
          let rawValue;
          if (value === 'confirmed') rawValue = 1;
          if (value === 'unconfirmed') rawValue = 2;
          if (!rawValue) return;
          encodeValue(2, id, res);
          res.push(length);
          encodeValue(length, rawValue, res);
        }
        if (id === 8) {
          if (typeof value !== 'number' || value < 1 || value > 15) return;
          encodeValue(2, id, res);
          res.push(length);
          encodeValue(length, value, res);
        }
        if (id === 12) {
          let rawValue;
          if (value === 'pulse') rawValue = 1;
          if (value === 'guard') rawValue = 2;
          if (!rawValue) return;
          encodeValue(2, id, res);
          res.push(length);
          encodeValue(length, rawValue, res);
        }
        if (id === 13) {
          let rawValue;
          if (value === 'pulse') rawValue = 1;
          if (value === 'guard') rawValue = 2;
          if (!rawValue) return;
          encodeValue(2, id, res);
          res.push(length);
          encodeValue(length, rawValue, res);
        }
        if (id === 14) {
          let rawValue;
          if (value === 'pulse') rawValue = 1;
          if (value === 'guard') rawValue = 2;
          if (!rawValue) return;
          encodeValue(2, id, res);
          res.push(length);
          encodeValue(length, rawValue, res);
        }
        if (id === 15) {
          let rawValue;
          if (value === 'pulse') rawValue = 1;
          if (value === 'guard') rawValue = 2;
          if (!rawValue) return;
          encodeValue(2, id, res);
          res.push(length);
          encodeValue(length, rawValue, res);
        }
        if (id === 16) {  
          let rawValue;
          if (value === 60) rawValue = 1;
          if (value === 360) rawValue = 2;
          if (value === 720) rawValue = 3;
          if (value === 1440) rawValue = 4;
          if (value === 5) rawValue = 5;
          if (value === 15) rawValue = 6;
          if (value === 30) rawValue = 7;
          if (!rawValue) return;
          encodeValue(2, id, res);
          res.push(length);
          encodeValue(length, rawValue, res);
        }
        if (id === 49) {  
          let rawValue;
          if (value === 60) rawValue = 1;
          if (value === 360) rawValue = 2;
          if (value === 720) rawValue = 3;
          if (value === 1440) rawValue = 4;
          if (value === 5) rawValue = 5;
          if (value === 15) rawValue = 6;
          if (value === 30) rawValue = 7;
          if (!rawValue) return;
          encodeValue(2, id, res);
          res.push(length);
          encodeValue(length, rawValue, res);
        }
        if (id === 55) {
          if (typeof value !== 'number' && (value < -720 || value > 840)) return;
          encodeValue(2, id, res);
          res.push(length);
          encodeValue(length, value, res);
        }
      });
    }
  }
  if ( fPort === 4 )
  {
    let rawType = 0;
    const type = obj.type;
    if (type === 'time_correction') 
    {
      rawType = 255;
      res.push(rawType);
    }
    else return res;
    const value = obj.value;
    if (
      typeof value === 'number' &&
      value >= -9223372036854775808 &&
      value <= 9223372036854775807
    ) 
    {
      encodeValue(8, value);
    }
    else return [];
  }
  return res;
}

function encodeDownlink(input){
  const fPort = input.fPort;
  const obj = input.obj;
  const variables = input.variables;
  return { bytes: Encode(fPort, obj, variables) }
}


