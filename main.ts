radio.onReceivedNumber(function (receivedNumber) {
    angle = 0
    if (receivedNumber == 1 && rain > 65) {
        angle = 90
        servos.P1.setAngle(angle)
    } else {
        angle = 0
        servos.P1.setAngle(angle)
    }
    if (angle == 90) {
        if (Environment.sonarbit_distance(Environment.Distance_Unit.Distance_Unit_cm, DigitalPin.P14) < 3) {
            music.play(music.tonePlayable(988, music.beat(BeatFraction.Half)), music.PlaybackMode.UntilDone)
            Environment.ledBrightness(AnalogPin.P4, true)
        }
    }
    Environment.ledBrightness(AnalogPin.P4, false)
})
let rain = 0
let angle = 0
OLED.init(128, 64)
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
ESP8266_IoT.connectWifi("iptime", "")
basic.clearScreen()
Environment.ledBrightness(AnalogPin.P4, false)
radio.setGroup(50)
basic.forever(function () {
    rain = Environment.ReadWaterLevel(AnalogPin.P2)
    OLED.clear()
    OLED.writeString("water level:")
    OLED.writeNumNewLine(rain)
    // 手動で扉を開く
    while (input.buttonIsPressed(Button.A)) {
        servos.P1.setAngle(90)
        ESP8266_IoT.sendGet(
        "192.168.0.74:8000",
        "/",
        "open"
        )
    }
    // 手動で扉を閉める
    while (input.buttonIsPressed(Button.B)) {
        servos.P1.setAngle(0)
        ESP8266_IoT.sendGet(
        "192.168.0.74:8000",
        "/",
        "close"
        )
    }
    if (rain > 65) {
        radio.sendNumber(2)
    } else {
        radio.sendNumber(0)
    }
    basic.pause(1000)
})
