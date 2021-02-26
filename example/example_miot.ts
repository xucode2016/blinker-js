import { BlinkerDevice } from '../lib/blinker';
import { Miot, AliGenie, DuerOS, VA_TYPE, MI_LIGHT_MODE } from '../lib/voice-assistant';
import { ButtonWidget, TextWidget, RangeWidget, NumberWidget, RGBWidget, JoystickWidget, ChartWidget, ImageWidget } from '../lib/widget';

let device = new BlinkerDevice('');


// let miot = device.addVoiceAssistant(new Miot(VA_TYPE.LIGHT));
// let aliGenie = device.addVoiceAssistant(new AliGenie(VA_TYPE.LIGHT));
let duerOS = device.addVoiceAssistant(new DuerOS(VA_TYPE.LIGHT));

// 注册组件
let button1: ButtonWidget = device.addWidget(new ButtonWidget('btn-crf'));
let button2: ButtonWidget = device.addWidget(new ButtonWidget('btn-b9g'));
let text1: TextWidget = device.addWidget(new TextWidget('tex-pnd'));
let range1: RangeWidget = device.addWidget(new RangeWidget('ran-i89'));
let number1: NumberWidget = device.addWidget(new NumberWidget('num-lnw'));

device.ready().then(() => {
    // 电源状态改变
    miot.powerChange.subscribe(message => {
        console.log(message);
        miot.power('on').update();
        // miot.power('off').update();
    })
    // 模式改变
    miot.modeChange.subscribe(message => {
        console.log(message);
        miot.mode(MI_LIGHT_MODE.DAY).update();
        miot.mode(MI_LIGHT_MODE.NIGHT).update();
        miot.mode(MI_LIGHT_MODE.COLOR).update();
        miot.mode(MI_LIGHT_MODE.WARMTH).update();
        miot.mode(MI_LIGHT_MODE.TV).update();
        miot.mode(MI_LIGHT_MODE.READING).update();
        miot.mode(MI_LIGHT_MODE.COMPUTER).update();
    })
    // 颜色改变
    miot.colorChange.subscribe(message => {
        console.log(message);
        miot.color('255,255,255').update();
    })
    // 色温改变
    miot.colorTempChange.subscribe(message => {
        console.log(message);
        miot.colorTemp(255).update();
    })

    // 亮度改变
    miot.brightnessChange.subscribe(message => {
        console.log(message);
        miot.brightness(255).update();
    })

    // 小爱每次动作前后，都会查询设备状态
    miot.stateQuery.subscribe(message => {
        console.log(message);
        miot.brightness(255).update();
    })

    device.dataRead.subscribe(message => {
        console.log('otherData:', message);
    })

    device.heartbeat.subscribe(message => {
        console.log('heartbeat:', message);
        device.builtinSwitch.setState(getSwitchState()).update();
        range1.value(randomNumber()).color(randomColor()).update();
        number1.value(randomNumber()).unit('米').text('长度').color(randomColor()).update();
        button2.color(randomColor()).update();
        button1.color(randomColor()).update();

    })

    device.builtinSwitch.change.subscribe(message => {
        console.log('builtinSwitch:', message);
        device.builtinSwitch.setState(turnSwitch()).update();
    })

    button1.listen().subscribe(message => {
        console.log('button1:', message.data);
        device.push('NUC设备测试');
        let state = turnSwitch()
        button1.turn(state).update();
        text1.text('button1的动作').text1(message.data).update();
    })

    button2.listen().subscribe(message => {
        console.log('button2:', message);
        text1.text('button2的动作').text1(message.data).update();
    })

})


/*
以下为测试用函数
*/
// 随机数
function randomNumber(min = 0, max = 100) {
    let random = Math.random()
    return Math.floor((min + (max - min) * random))
}

// 随机颜色
function randomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return color;
}

// 开关切换
function getSwitchState() {
    return switchState ? 'on' : 'off'
}
let switchState = false
function turnSwitch() {
    switchState = !switchState
    device.log("切换设备状态为" + (switchState ? 'on' : 'off'))
    return switchState ? 'on' : 'off'
}
