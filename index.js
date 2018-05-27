const sp = require("serialport");

var equipmentsNames = [
    'Aiguillages et Croisements',
    'Feux de Signalisation',
    'Locomotives',
    'Capteurs Optiques (Position)',
    'Boucles de Retournement',
    'Ponts Tournant',
];

sp.list(function(err, ports) {
    ports.forEach(function(port) {

        if (port.vendorId == 0x0403) {
            var serialPort = new sp(port.comName, {
                baudRate: 57600,
                parser: sp.parsers.readline('\r\n')
            });

            serialPort.on('open', function() {
                process.stdout.write('Connection ouverte sur le port : ' + port.comName + '\n');
                var incomingByte = serialPort.read;

                serialPort.on('data', function(incomingByte) {
                        if (incomingByte.charAt(0) === '6') {
                            var identifier = incomingByte.split(" ")[0].substr(1);
                            var data = incomingByte.split(" ")[1];

                            var equipBin = hexToBin(identifier.charAt(0) + identifier.charAt(1), true);
                            var modBin = hexToBin(identifier.charAt(2) + identifier.charAt(3), true);

                            process.stdout.write('incomingByte : ' + incomingByte + '\n');
                            process.stdout.write('equipBin : ' + equipBin + '\n');
                            process.stdout.write('modBin : ' + modBin + '\n');

                            var equipmentsId = [];
                            var modsId = [];
                            var equipmentsText = [];

                            for (var i = 0; i < equipBin.length; i++) {
                                equipBin.charAt(i) == '1' ? equipmentsId.push(i + 1) && equipmentsText.push(equipmentsNames[i]) : null;
                                modBin.charAt(i) == '1' ? modsId.push(i + 1) : null;
                            }

                            // debug :
                            process.stdout.write('equipmentsId : ' + equipmentsId + '\n');
                            process.stdout.write('equipmentsText : ' + equipmentsText + '\n');
                            process.stdout.write('modsId : ' + modsId + '\n');
                        }
                    }
                );
            });
        }
    });
});

function hexToBin(hex, reverse) {
    var str = parseInt(hex, 16).toString(2);
    while (str.length < 8) str = "0" + str;
    if (!reverse) {
        return str;
    } else {
        return str.split("").reverse().join("");
    }
}
