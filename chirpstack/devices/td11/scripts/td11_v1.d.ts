export enum reasons {
    byTime = 'byTime',
    bySecurityInputTriggered = 'bySecurityInputTriggered',
    byTamperSensorTriggered = 'byTamperSensorTriggered',
    byHallSensor1Triggered = 'byHallSensor1Triggered',
    byHallSensor2Triggered = 'byHallSensor2Triggered',
    byTemperatureOutOfRange = 'byTemperatureOutOfRange',
}

export type reason = `${reasons}`;
export type dataType = 'currentValues';
export type timeType = 'correctionTime';
export type settingsType = 'settings';

export interface ISetting<T> {
    id: number;
    length: number;
    rawValue: number[];
    name: string;
    value: T;
}
export interface IConfirmedUplinks 
    extends ISetting<'confirmed' | 'unconfirmed' | 'notValidValue'> {}
export interface IAdr
    extends ISetting<'enable' | 'disable' | 'notValidValue'> {}
export interface ICountsUplinks
    extends ISetting<number | 'notValidValue'> {}
export interface ICommunicationPeriodMin
    extends ISetting<number | 'notValidValue'> {}
export interface ISendAlarmMessageOnOpeningSensor1
    extends ISetting<'onClose' | 'onOpen' | 'onCloseAndOnOpen' | 'never' | 'notValidValue'> {}
export interface IDataCollectionPeriodMin
    extends ISetting<number | 'notValidValue'> {}
export interface ITimeZoneMin
    extends ISetting<number | 'notValidValue'> {}
export interface ICollectionPeriodTemperatureOutOfRange
    extends ISetting<number | 'notValidValue'> {}
export interface ISendAlarmMessageOnParametersOutOfRange
    extends ISetting<'disable' | 'enable' | 'notValidValue'> {}
export interface ILowTemperature
    extends ISetting<number | 'notValidValue'> {}
export interface IHighTemperature
    extends ISetting<number | 'notValidValue'> {}


export interface IResult {
    decoder: string;
    statusDecode: boolean;
}
export interface Inputs {
    isCaseOpened: boolean;
    isHallSensor1Triggered: boolean;
    isHallSensor2Triggered: boolean;
    securityInputState: 'unlocking' | 'closure' | 'notValidValue';
}
export interface ITd11_v1 extends IResult {
    chargePercent: number;
    highTemperature: number;
    inputs: Inputs;
    isTemperatureOutOfRange: boolean;
    lowTemperature: number;
    reason: reason;
    temperature: number;
    time: number;
    timeStringISO: string;
    type: dataType;
}
export interface ITime extends IResult {
    time: number;
    timeStringISO: string;
    type: timeType;
}
export interface ISettingsVal {
    '4': IConfirmedUplinks;
    '5': IAdr;
    '8': ICountsUplinks;
    '16': ICommunicationPeriodMin;
    '38': ISendAlarmMessageOnOpeningSensor1;
    '49': IDataCollectionPeriodMin;
    '55': ITimeZoneMin;
    '78': ICollectionPeriodTemperatureOutOfRange;
    '79': ISendAlarmMessageOnParametersOutOfRange;
    '80': ILowTemperature;
    '81': IHighTemperature;
}
export interface ISettings extends IResult {
    settings: ISettingsVal;
    type: settingsType;
}

export declare function Decode(fPort: number, bytes: number[]): IResult | ITd11_v1 | ITime | ISettings;