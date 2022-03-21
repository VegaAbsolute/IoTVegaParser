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
function parseModel (val) {
  if ( val === 1 ) return 'SPBZIP CE 2726A';
  else if ( val === 2 ) return 'SPBZIP CE 2727A';
  else return 'notValidValue';
}
function parsePowerLimitRelayMode (val) {
  if ( val === 1 ) return 'on';
  else if ( val === 0 ) return 'off';
  else return 'notValidValue';
}
function uInt32toState (val) {
	var MASK_IS_TERMINAL_OPENED      = 0x01;
  var MASK_IS_CASE_OPENED          = 0x02;
  var MASK_POWER_LIMIT_RELAY_STATE = 0x04;

  var isTerminalOpened 	        = ( ( val & MASK_IS_TERMINAL_OPENED ) >> 0 );
  var isCaseOpened              = ( ( val & MASK_IS_CASE_OPENED )     >> 1 );
	var powerLimitRelayState = ( ( val & MASK_POWER_LIMIT_RELAY_STATE ) >> 2 );
  
  return {
      isTerminalOpened: isTerminalOpened?false:true,
      isCaseOpened: isCaseOpened?false:true,
    	powerLimitRelayState: ( powerLimitRelayState === 0 )?'powerSupplyIsLimited':'powerSupplyIsUnlimited',
	};
}
function parseReason (val) {
  if ( val === 1 ) return 'byTime';
  else if ( val === 2 ) return 'byTerminalOpening';
  else if ( val === 3 ) return 'byCaseOpening';
  else if ( val === 7 ) return 'byPowerLimitRelayOperation';
  else if ( val === 8 ) return 'byOvervoltage';
  else if ( val === 11 ) return 'byPowerLimitExceeding';
  else if ( val === 18 ) return 'byElectricityPowerOff';
  else if ( val === 19 ) return 'byRequest';
  else if ( val === 20 ) return 'byElectricityPowerOn';
  else if ( val === 21 ) return 'byVoltageDip';
  else if ( val === 24 ) return 'byFrequencyDeviation';
  else return 'notValidValue';
}
function uInt8toNote (val) {
	var MASK_IS_DATA_EXIST                             = 0x01;
  var MASK_IS_INCOMPLETE_DATA_SLICE                  = 0x02;
  var MASK_IS_TIME_CHANGE_COMMAND_HAVE_BEEN_EXECUTED = 0x04;
  var MASK_SEASON                                    = 0x08;
  var MASK_IS_SEASON_SWITCHING_ALLOW                 = 0x10;
  var MASK_IS_TIME_CORRECTION_HAVE_BEEN_OPERATED     = 0x20;
  

  var isDataExist 	                      = ( ( val & MASK_IS_DATA_EXIST )                             >> 0 );
  var isIncompleteDataSlice               = ( ( val & MASK_IS_INCOMPLETE_DATA_SLICE )                  >> 1 );
	var isTimeChangeCommandHaveBeenExecuted = ( ( val & MASK_IS_TIME_CHANGE_COMMAND_HAVE_BEEN_EXECUTED ) >> 2 );
  var season                              = ( ( val & MASK_SEASON )                                    >> 3 );
  var isSeasonSwitchingAllow              = ( ( val & MASK_IS_SEASON_SWITCHING_ALLOW )                 >> 4 );
  var isTimeCorrectionHaveBenOperated     = ( ( val & MASK_IS_TIME_CORRECTION_HAVE_BEEN_OPERATED )     >> 5 );
  
  return {
      isDataExist: isDataExist?true:false,
      isIncompleteDataSlice: isIncompleteDataSlice?true:false,
      isTimeChangeCommandHaveBeenExecuted: isTimeChangeCommandHaveBeenExecuted?true:false,
    	season: ( season === 0 )?'summer':'winter',
      isSeasonSwitchingAllow: isSeasonSwitchingAllow?true:false,
      isTimeCorrectionHaveBenOperated: isTimeCorrectionHaveBenOperated?true:false,
	};
}
function parseRequestStatus (val) {
  if      ( val === 0 ) return 'error';
  else if ( val === 1 ) return 'completed';
  else if ( val === 2 ) return 'notSupportedByMeter';
  else return 'notValidValue';
}
function parsePeriod (val) {
  if      ( val === 0 ) return '1hour';
  else if ( val === 1 ) return '6hours';
  else if ( val === 2 ) return '12hours';
  else if ( val === 3 ) return '24hours';
  else if ( val === 5 ) return '1week';
  else if ( val === 6 ) return '1mounth';
  else return 'notValidValue';
}
function parseDayOfWeek (val) {
  if      ( val === 0 ) return 'noWeeklyPolls';
  else if ( val === 1 ) return 'Monday';
  else if ( val === 2 ) return 'Tuesday';
  else if ( val === 3 ) return 'Wednesday';
  else if ( val === 4 ) return 'Thursday';
  else if ( val === 5 ) return 'Friday';
  else if ( val === 6 ) return 'Saturday';
  else if ( val === 7 ) return 'Sunday';
  else return 'notValidValue';
}
function parseDayOfMonth (val) {
  if ( val === 0 ) return 'noMonthlyPolls';
  else if ( val > 0 && val <= 28 ) val;
  else return 'notValidValue';
}
function parseMonth (val) {
  if      ( val === 0 ) return 'January';
  else if ( val === 1 ) return 'February';
  else if ( val === 2 ) return 'March';
  else if ( val === 3 ) return 'April';
  else if ( val === 4 ) return 'May';
  else if ( val === 5 ) return 'June';
  else if ( val === 6 ) return 'July';
  else if ( val === 7 ) return 'August';
  else if ( val === 8 ) return 'September';
  else if ( val === 9 ) return 'October';
  else if ( val === 10 ) return 'November';
  else if ( val === 11 ) return 'December';
  else return 'notValidValue';
}
function parseTariffScheduleCode (val) {
  if      ( val === 0 ) return 'holiday';
  else if ( val === 1 ) return 'Saturday';
  else if ( val === 2 ) return 'Sunday';
  else if ( val === 3 ) return 'workday';
  else return 'notValidValue';
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
  else if ( setting.id === 46 )
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
  else if ( setting.id === 50 )
  {
    result.value = {};
    result.name = 'meterInfoCollectionPeriod';
    var period = readUInt8(setting.rawValue,0); 
    var dayOfWeek = readUInt8(setting.rawValue,1);
    result.dayOfMonth = readUInt8(setting.rawValue,2);

    if ( period === 0 ) result.value.period = 'unset';
    else if ( period === 1 ) result.value.period = '1hour';
    else if ( period === 2 ) result.value.period = '6hours';
    else if ( period === 3 ) result.value.period = '12hours';
    else if ( period === 4 ) result.value.period = '24hours';
    else if ( period === 5 ) result.value.period = '1week';
    else if ( period === 6 ) result.value.period = '1mounth';
    else result.value.period = 'notValidValue';

    if ( dayOfWeek === 0 ) result.value.dayOfWeek = 'unset';
    else if ( dayOfWeek === 1 ) result.value.dayOfWeek = 'Monday';
    else if ( dayOfWeek === 2 ) result.value.dayOfWeek = 'Tuesday';
    else if ( dayOfWeek === 3 ) result.value.dayOfWeek = 'Wednesday';
    else if ( dayOfWeek === 4 ) result.value.dayOfWeek = 'Thursday';
    else if ( dayOfWeek === 5 ) result.value.dayOfWeek = 'Friday';
    else if ( dayOfWeek === 6 ) result.value.dayOfWeek = 'Saturday';
    else if ( dayOfWeek === 7 ) result.value.dayOfWeek = 'Sunday';
    else result.value.dayOfWeek = 'notValidValue';

    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 52 )
  {
    result.value = {};
    result.name = 'energyConsumptionCollectionPeriod';
    var period = readUInt8(setting.rawValue,0); 
    var dayOfWeek = readUInt8(setting.rawValue,1);
    result.dayOfMonth = readUInt8(setting.rawValue,2);

    if ( period === 0 ) result.value.period = 'unset';
    else if ( period === 1 ) result.value.period = '1hour';
    else if ( period === 2 ) result.value.period = '6hours';
    else if ( period === 3 ) result.value.period = '12hours';
    else if ( period === 4 ) result.value.period = '24hours';
    else if ( period === 5 ) result.value.period = '1week';
    else if ( period === 6 ) result.value.period = '1mounth';
    else result.value.period = 'notValidValue';

    if ( dayOfWeek === 0 ) result.value.dayOfWeek = 'unset';
    else if ( dayOfWeek === 1 ) result.value.dayOfWeek = 'Monday';
    else if ( dayOfWeek === 2 ) result.value.dayOfWeek = 'Tuesday';
    else if ( dayOfWeek === 3 ) result.value.dayOfWeek = 'Wednesday';
    else if ( dayOfWeek === 4 ) result.value.dayOfWeek = 'Thursday';
    else if ( dayOfWeek === 5 ) result.value.dayOfWeek = 'Friday';
    else if ( dayOfWeek === 6 ) result.value.dayOfWeek = 'Saturday';
    else if ( dayOfWeek === 7 ) result.value.dayOfWeek = 'Sunday';
    else result.value.dayOfWeek = 'notValidValue';

    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 54 )
  {
    result.name = 'password';
    var val = readUInt32LE(setting.rawValue,0); 
    if ( val >= 0 && val <= 4294967295 ) result.value = val;
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
  else if ( setting.id === 56 )
  {
    result.name = 'initialConsumption';
    var val = readUInt32LE(setting.rawValue,0);
    result.value = val / 100;

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
  else if ( setting.id === 85 )
  {
    result.name = 'lowCurrentLimit';
    var val = readUInt16LE(setting.rawValue,0);
    if ( val >= 200 && val <= 2500 ) result.value = val/100;
    else result.value = 'notValidValue';

    if ( result.value !== undefined && result.name !== undefined ) result.statusParse = true;
  }
  else if ( setting.id === 86 )
  {
    result.name = 'highCurrentLimit';
    var val = readUInt16LE(setting.rawValue,0);
    if ( val >= 200 && val <= 2500 ) result.value = val/100;
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
  else if ( setting.id === 54 )
  {
    result.name = 'meterDataTransmissionPeriodH';
    var val = readUInt8(setting.rawValue,0); 
    if ( val >= 0 && val <= 24 ) result.value = val;
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
    decoder:"vega_SPBZIP_v1",
    statusDecode: false
  };
  if ( fPort === 2 )
  {
    var type = bytes[0];
    if ( type === 1 )
    {
      var rawModel = readUInt8(bytes,9);
      var rawPowerLimitRelayMode = readUInt8(bytes,12);
      var rawState = readUInt32LE(bytes,26);
      var rawReason = readUInt16LE(bytes,30);

      result.type = 'info';
      result.serialNumber = readUInt32LE(bytes,1);
      result.time = readUInt32LE(bytes,5);
      result.timeStringISO = new Date(result.time*1000).toISOString();
      result.model = parseModel(rawModel);
      result.phasesNumber = readUInt8(bytes,10);
      result.powerLimitRelayMode = parsePowerLimitRelayMode(rawPowerLimitRelayMode);
      result.productionDate = readUInt32LE(bytes,13);
      result.productionDateStringISO = new Date(result.productionDate*1000).toISOString();
      result.swVer = readUInt32LE(bytes,17)/10;
      result.meterReadingWh = readUInt32LE(bytes,21);
      result.temperature = readUInt8(bytes,25);
      result.state = uInt32toState(rawState);
      result.reason = parseReason(rawReason);
      result.UUID = readUInt16LE(bytes,32);
      result.statusDecode = true;
    }
    if ( type === 2 )
    {
      result.type = 'currentValues_1';
      result.serialNumber = readUInt32LE(bytes,1);
      result.time = readUInt32LE(bytes,5);
      result.timeStringISO = new Date(result.time*1000).toISOString();
      result.phaseAVoltage = readUInt16LE(bytes,9)/100;
      result.phaseBVoltage = readUInt16LE(bytes,11)/100;
      result.phaseCVoltage = readUInt16LE(bytes,13)/100;
      result.phaseACurrent = readUInt32LE(bytes,15)/1000;
      result.phaseBCurrent = readUInt32LE(bytes,19)/1000;
      result.phaseCCurrent = readUInt32LE(bytes,23)/1000;
      result.phaseAPowerFactor = readUInt16LE(bytes,27)/1000;
      result.phaseBPowerFactor = readUInt16LE(bytes,29)/1000;
      result.phaseCPowerFactor = readUInt16LE(bytes,31)/1000;
      result.averagePowerFactor = readUInt16LE(bytes,33)/1000;
      result.frequency = readUInt16LE(bytes,35)/100;
      result.power = readUInt32LE(bytes,37);
      result.UUID = readUInt16LE(bytes,41);
      result.statusDecode = true;
    }
    if ( type === 3 )
    {
      result.type = 'scadaResponse';
      result.dataSize = readUInt16LE(bytes,1);
      result.packetSize = readUInt8(bytes,3);
      result.packetNumber = readUInt8(bytes,4);
      result.packetsNumber = readUInt8(bytes,5);
      result.data = bytes.slice(6);
      result.statusDecode = true;
    } 
    if ( type === 4 )
    {
      result.type = 'currentValuesExtendedByTariffs';
      result.serialNumber = readUInt32LE(bytes,1);
      result.time = readUInt32LE(bytes,5);
      result.timeStringISO = new Date(result.time*1000).toISOString();
      result.tariff = readUInt8(bytes,9);
      result.meterReadingWh = readUInt32LE(bytes,10);
      result.tariff1ReadingWh = readUInt32LE(bytes,14);
      result.tariff2ReadingWh = readUInt32LE(bytes,18);
      result.tariff3ReadingWh = readUInt32LE(bytes,22);
      result.tariff4ReadingWh = readUInt32LE(bytes,26);
      result.UUID = readUInt16LE(bytes,30);
      result.statusDecode = true;
    }
    if ( type === 5 )
    {
      var rawPenultHalfHourNote = readUInt8(bytes,9);
      var rawLastHalfHourNote = readUInt8(bytes,18);

      result.type = 'powerProfile';
      result.serialNumber = readUInt32LE(bytes,1);
      result.penultHalfHourTime = readUInt32LE(bytes,5);
      result.penultHalfHourTimeStringISO = new Date(result.penultHalfHourTime*1000).toISOString();
      result.penultHalfHourNote = uInt8toNote(rawPenultHalfHourNote);
      result.penultHalfHourPower = readUInt32LE(bytes,10);
      result.lastHalfHourTime = readUInt32LE(bytes,14);
      result.lastHalfHourTimeStringISO = new Date(result.lastHalfHourTime*1000).toISOString();
      result.lastHalfHourNote = uInt8toNote(rawLastHalfHourNote);
      result.lastHalfHourPower = readUInt32LE(bytes,19);
      result.UUID = readUInt16LE(bytes,23);
      result.statusDecode = true;
    }
    if ( type === 6 )
    {
      var rawRequestStatus = readUInt8(bytes,5);

      result.type = 'receiptResponse';
      result.serialNumber = readUInt32LE(bytes,1);
      result.requestStatus = parseRequestStatus(rawRequestStatus);
      result.UUID = readUInt16LE(bytes,6);
      result.statusDecode = true;
    }
    if ( type === 7 )
    {
      var rawMeterInfoCollectionPeriod = readUInt8(bytes,19);
      var rawInfoCollectionDayOfWeek = readUInt8(bytes,20);
      var rawInfoCollectionDayOfMonth = readUInt8(bytes,21);
      var rawEnergyConsumptionCollectionPeriod = readUInt8(bytes,22);
      var rawEnergyConsumptionCollectionDayOfWeek = readUInt8(bytes,23);
      var rawEnergyConsumptionCollectionDayOfMonth = readUInt8(bytes,24);
      var rawCurrentValuesCollectionPeriod = readUInt8(bytes,25);
      var rawCurrentValuesCollectionDayOfWeek = readUInt8(bytes,26);
      var rawCurrentValuesCollectionDayOfMonth = readUInt8(bytes,27);

      result.type = 'currentConfiguration';
      result.networkAddress = readUInt32LE(bytes,1);
      result.timeZone = readInt16LE(bytes,5);
      result.connectionPeriod = readUInt8(bytes,7);
      result.isEventsTransmissionEnable = readUInt8(bytes,8)?true:false;
      result.isHalfHourTransmissionEnable = readUInt8(bytes,9)?true:false;
      result.confirmedUplinks = readUInt8(bytes,10)?true:false;
      result.powerLimit = readUInt32LE(bytes,11)/10;
      result.infoCollection = {
        period: parsePeriod(rawMeterInfoCollectionPeriod),
        dayOfWeek: parseDayOfWeek(rawInfoCollectionDayOfWeek),
        dayOfMonth: parseDayOfMonth(rawInfoCollectionDayOfMonth),
      }
      result.energyConsumptionCollection = {
        period: parsePeriod(rawEnergyConsumptionCollectionPeriod),
        dayOfWeek: parseDayOfWeek(rawEnergyConsumptionCollectionDayOfWeek),
        dayOfMonth: parseDayOfMonth(rawEnergyConsumptionCollectionDayOfMonth),
      }
      result.currentValuesCollection = {
        period: parsePeriod(rawCurrentValuesCollectionPeriod),
        dayOfWeek: parseDayOfWeek(rawCurrentValuesCollectionDayOfWeek),
        dayOfMonth: parseDayOfMonth(rawCurrentValuesCollectionDayOfMonth),
      }
      result.UUID = readUInt16LE(bytes,28);
      result.statusDecode = true;
    }    
  }
  else if ( fPort === 5 )
  {
    var type = bytes[0];
    if ( type === 8 )
    {
      var rawMonth = readUInt8(bytes,1);
      var rawTariffScheduleCode = readUInt8(bytes,2);
      var zones = {};
      for ( var i = 0; i < 15; i++ )
      {
        var zone = {};
        zone.endMinute = readUInt8(bytes,i*3+3);
        tariff.endHour = readUInt8(bytes,i*3+4);
        zone.zoneNumber = readUInt8(bytes,i*3+5);
        zones[i+1] = zone;
      }
      result.type = 'tariffSchedule';
      result.month = parseMonth(rawMonth);
      result.tariffScheduleCode = parseTariffScheduleCode(rawTariffScheduleCode);
      result.zones = zones;
      result.UUID = readUInt16LE(bytes,48);
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