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
    } else if (data === '\u007F') {
        if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            terminal.write('\b \b');        
        }
    }    else {
        currentLine += data;
        terminal.write(data);
    }
})

function print(text) {
    terminal.write(text + '\r\n');
}