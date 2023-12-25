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
function uInt32toLatitude (val) {
  var first = readUInt8(val,0);
  var second = readUInt8(val,1);
  var third = readUInt8(val,2);
  var fourth = readUInt8(val,3);
  var MASK_DEGREES_LOW         = 0x0F;
  var MASK_DEGREES_HIGH        = 0xF0;
  var MASK_MINUTES_LOW         = 0x0F;
  var MASK_MINUTES_HIGH        = 0xF0;
  var MASK_MINUTES_TENTHS      = 0xF0;
  var MASK_MINUTES_HUNDREDTHS  = 0x0F;
  var MASK_MINUTES_THOUSANDTHS = 0xF0;
  var MASK_LATITUDE_CODE       = 0x01;
  var degreesLow         = ( ( first & MASK_DEGREES_LOW )          >> 0 );
  var degreesHigh        = ( ( first & MASK_DEGREES_HIGH )         >> 4 );
  var minutesLow         = ( ( second & MASK_MINUTES_LOW )         >> 0 );
  var minutesHigh        = ( ( second & MASK_MINUTES_HIGH )        >> 4 );
  var minutesTenths      = ( ( third & MASK_MINUTES_TENTHS )       >> 4 );
  var minutesHundredth   = ( ( third & MASK_MINUTES_HUNDREDTHS )   >> 0 );
  var minutesThousandths = ( ( fourth & MASK_MINUTES_THOUSANDTHS ) >> 4 );
  var latitudeCode       = ( ( fourth & MASK_LATITUDE_CODE )       >> 0 );
  var degrees = degreesHigh*10 + degreesLow;
  var minutes = minutesHigh*10 + minutesLow;
  var fractionsOfMinutes = minutesTenths*100 + minutesHundredth*10 + minutesThousandths;
  var latitudeSymbol = (latitudeCode === 1)?'S':'N';
  return degrees + '°' + minutes + '.' + fractionsOfMinutes + '′' + latitudeSymbol;
}
function uInt32toLongitude (val) {
  var first = readUInt8(val,0);
  var second = readUInt8(val,1);
  var third = readUInt8(val,2);
  var fourth = readUInt8(val,3);
  var MASK_DEGREES_HIGH       = 0xF0;
  var MASK_DEGREES_MIDDLE     = 0x0F;
  var MASK_DEGREES_LOW        = 0xF0;
  var MASK_MINUTES_HIGH       = 0x0F; 
  var MASK_MINUTES_LOW        = 0xF0;
  var MASK_MINUTES_TENTHS     = 0x0F;
  var MASK_MINUTES_HUNDREDTHS = 0xF0;
  var MASK_LONGITUDE_CODE     = 0x01;
  var degreesHigh      = ( ( first & MASK_DEGREES_HIGH )        >> 4 );
  var degreesMiddle    = ( ( first & MASK_DEGREES_MIDDLE )      >> 0 );
  var degreesLow       = ( ( second & MASK_DEGREES_LOW )        >> 4 );
  var minutesHigh      = ( ( second & MASK_MINUTES_HIGH )       >> 0 ); 
  var minutesLow       = ( ( third & MASK_MINUTES_LOW )         >> 4 );
  var minutesTenths    = ( ( third & MASK_MINUTES_TENTHS )      >> 0 );
  var minutesHundredth = ( ( fourth & MASK_MINUTES_HUNDREDTHS ) >> 4 );
  var longitudeCode    = ( ( fourth & MASK_LONGITUDE_CODE )     >> 0 );
  var degrees = degreesHigh*100 + degreesMiddle*10 + degreesLow;
  var minutes = minutesHigh*10 + minutesLow;
  var fractionsOfMinutes = minutesTenths*10 + minutesHundredth;
  var longitudeSymbol = (longitudeCode === 1)?'W':'E';
  return degrees + '°' + minutes + '.' + fractionsOfMinutes + '′' + longitudeSymbol;
}
function uInt8toPresence (val) {
  var result = {};
  var MASK_RSSS_AND_SNR = 0x01;
  var MASK_BATTERY = 0x02;
  var MASK_COUNTS_DOWNLINKS = 0x04;
  var MASK_COUNTS_UPLINKS = 0x08;
  var MASK_NAVIGATION = 0x10;
  var MASK_REASON = 0x20;
  var MASK_TEMPERATURE = 0x80;
  var RSSIAndSNR = ( ( val & MASK_RSSS_AND_SNR ) >> 0 );
  var battery = ( ( val & MASK_BATTERY ) >> 1 );
  var countsDownlinks = ( ( val & MASK_COUNTS_DOWNLINKS ) >> 2 );
  var countsUplinks = ( ( val & MASK_COUNTS_UPLINKS ) >> 3 );
  var navigation = ( ( val & MASK_NAVIGATION ) >> 4 );
  var reason = ( ( val & MASK_REASON ) >> 5 );
  var temperature = ( ( val & MASK_TEMPERATURE ) >> 7 );
  result.RSSIAndSNR = RSSIAndSNR?true:false;
  result.battery = battery?true:false;
  result.countsDownlinks = countsDownlinks?true:false;
  result.countsUplinks = countsUplinks?true:false;
  result.navigation = navigation?true:false;
  result.reason = reason?'byButtonTriggering':'automatically';
  result.temperature = temperature?true:false;
  return result;
}
function decodeUplink (input) {
  var fPort = input.fPort;
  var bytes = input.bytes;
  var variables = input.variables;
  var result = {
    decoder:"vega_ts12_v1",
    statusDecode: false
  };
  if ( fPort === 4 )
  {
    var rawPresence = readUInt8(bytes,0);
    
    var presence = uInt8toPresence(rawPresence);
    var k = 0;
    if ( presence.temperature ) result.temperature = readUInt8(bytes,1);
    else k++;
    if ( presence.navigation ) 
    {
      result.latitude = uInt32toLatitude(bytes.slice(2-k,6-k));
      result.longitude = uInt32toLongitude(bytes.slice(6-k,10-k));
    }
    else k += 8;
    if ( presence.countsUplinks ) result.uplinksCount = readUInt8(bytes,10-k);
    else k++;
    if ( presence.countsDownlinks ) result.downlinksCount= readUInt8(bytes,11-k);
    else k++;
    if ( presence.battery )
    {
      var rawBatteryVoltage = bytes.slice(12-k,14-k).reverse();
      result.batteryVoltage = readUInt16LE(rawBatteryVoltage,0);
    }
    else k += 2;
    if ( presence.RSSIAndSNR )
    {
      result.RSSI = readUInt8(bytes,14-k);
      result.SNR = readInt8(bytes,15-k);
    }
    result.presence = presence;
    result.statusDecode = true;
  }
  return { data: result };
}