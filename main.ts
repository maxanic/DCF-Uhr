let dcfPin = DigitalPin.P0;
let bits: number[] = [];
let lastTime = input.runningTime();

function decodeDCF(bits: number[]): string {
    if (bits.length === 59) {
        let minute = 0;
        let hour = 0;

        // Minuten aus Bits 21-27 auslesen (LSB zuerst)
        for (let i = 0; i < 7; i++) {
            minute += bits[21 + i] * (1 << i);
        }

        // Stunden aus Bits 29-34 auslesen (LSB zuerst)
        for (let i = 0; i < 6; i++) {
            hour += bits[29 + i] * (1 << i);
        }

        return ("0" + hour).substr(-2) + ":" + ("0" + minute).substr(-2);
    }
    return "--:--"; // Fehlerfall
}

basic.forever(function () {
    if (pins.digitalReadPin(dcfPin) === 1) {
        let duration = input.runningTime() - lastTime;
        lastTime = input.runningTime();

        if (duration > 70 && duration < 150) {  // 100ms = Bit 0
            bits.push(0);
        } else if (duration > 170 && duration < 250) {  // 200ms = Bit 1
            bits.push(1);
        }

        if (bits.length >= 59) {
            let result = decodeDCF(bits);
            basic.showString(result);
            bits = [];  // Buffer zurücksetzen
        }
    }
    basic.pause(10);
});
