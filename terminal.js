const terminal = new Terminal();
terminal.open(document.getElementById('terminal'));
terminal.write('$ ');

let currentLine = '';

terminal.onData(data => {
    if (data==='\r') {
        terminal.write('\r\n');
        runCommand(currentLine, print);
        currentLine = '';
        terminal.write('$ ');
    }
    else {
        currentLine += data;
        terminal.write(data);
    }
})

function print(text) {
    terminal.write(text + '\r\n');
}