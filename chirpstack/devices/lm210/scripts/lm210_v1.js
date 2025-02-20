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
function readMacRadioTag (buf,offset)
{
  var byteLength = 6;
  var res = '';
  for( var i = offset; byteLength!=0; i++ )
  {
    var byteHex = buf[i].toString(16);
    if(byteHex.length==1) byteHex='0'+byteHex;
    res+=byteHex;
    byteLength--;
  }
  return res;
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
function readIntLE (buf, offset, byteLength) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;

  var val = buf[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += buf[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
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
  return result;
}
function Decode (fPort, bytes, variables) {
    var result = {
        decoder:"vega_lm_1_v2",
      statusDecode: false
    };
    if ( fPort === 2 )
    {
      var type = bytes[0];
      if ( type === 1 )
      {
        result.type = 'Режим ГЛОНАСС/GPS';
        result.reason = readUInt8(bytes,1);
        result.chargePercent = readUInt8(bytes,2);
        result.time = readUInt32LE(bytes,3);
        result.timeStringISO = new Date(result.time*1000).toISOString();
        result.temperature = readInt8(bytes,7);
        result.state = readUInt8(bytes,8);
        result.angle = readUInt16LE(bytes,9)/10;
        result.latitude = readUInt32LE(bytes,11)/1000000;
        result.longitude = readUInt32LE(bytes,15)/1000000;
        result.course = readUInt16LE(bytes,19);
        result.speed = readInt16LE(bytes,21);
        result.altitude = readInt16LE(bytes,23);
        result.visibleSat = readInt8(bytes,25);
        result.usedSat = readInt8(bytes,26);
        result.stateipm = readInt8(bytes,27)
      }
      else if ( type === 5 )
      {
        result.type = 'Режим нескольких меток';
        result.reason = readUInt8(bytes,1);
        result.chargePercent = readUInt8(bytes,2);
        result.time = readUInt32LE(bytes,3);
        result.timeStringISO = new Date(result.time*1000).toISOString();
        result.temperature = readInt8(bytes,7);
        result.state = readUInt8(bytes,8);
        result.angle = readUInt16LE(bytes,9)/10;
        result.rTags = [];
        
        var mac1 = readMacRadioTag(bytes,11);
        var mac2 = readMacRadioTag(bytes,22);
        var mac3 = readMacRadioTag(bytes,33);

        if ( mac1 )
        {
          result.rTags.push({
            mac:mac1,
            mV:readUInt8(bytes,17),
            tempTags:readInt16LE(bytes,18)/100,
            humdt:readUInt8(bytes,19)/100,
            rssiRef:readInt8(bytes,20),
            rssi:readInt8(bytes,21)
          });
        }
        if ( mac2 )
        {
          result.rTags.push({
            mac:mac2,
            mV:readUInt8(bytes,28),
            tempTags:readInt16LE(bytes,29)/100,
            humdt:readUInt8(bytes,30)/100,
            rssiRef:readInt8(bytes,31),
            rssi:readInt8(bytes,32)
          });
        }
        if ( mac3 )
        {
          result.rTags.push({
            mac:mac3,
            mV:readUInt8(bytes,39),
            tempTags:readInt16LE(bytes,40)/100,
            humdt:readUInt8(bytes,41)/100,
            rssiRef:readInt8(bytes,42),
            rssi:readInt8(bytes,43)
          });
        }
        result.stateipm = readInt8(bytes, 44);
        //result.statusDecode = true;
      }
      else if ( type === 2 )
      {
        result.type = 'Режим одиночной метки';
        result.reason = readUInt8(bytes,1);
        result.chargePercent = readUInt8(bytes,2);        
        result.time = readUInt32LE(bytes,3);
        result.timeStringISO = new Date(result.time*1000).toISOString();
        result.temperature = readInt8(bytes,7);
        result.state = readUInt8(bytes,8);
        result.angle = readUInt16LE(bytes,9)/10;
        result.typeBeacon = readInt8(bytes,11);
        result.rTags = [];
        
        var mac1 = readMacRadioTag(bytes,12);
        if ( mac1 )
        {
          result.rTags.push({
            mac:mac1,
            mV:readUInt8(bytes,18),
            tempTags:readInt16LE(bytes,19)/100,
            rssiRef:readInt8(bytes,22),
            rssi:readInt8(bytes,23)
          });
        }
        result.stateipm = readInt8(bytes, 24);
        result.bytesRaw = bytes;
        result.statusDecode = true;
      }
      else if ( type === 10 ) 
      {
        result.type = 'Пакет включения команды';
        result.ID = readUInt8(bytes, 1);
      }
    }
    else if ( fPort === 3 ) 
    {
      var type = bytes[0];
      if ( type === 0 )
      {
        result.type = 'Пакет с настройками';
        result.ID = readInt16LE(bytes, 1);
        result.len = readUInt8(bytes, 3);

      }
    }
    return result;
  }