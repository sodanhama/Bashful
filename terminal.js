const terminal = new Terminal();
const fitAddon = new FitAddon.FitAddon();
terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal'));

window.addEventListener('load', () => {
  fitAddon.fit();
});

window.addEventListener('resize', () => {
  fitAddon.fit();
});

writePrompt();

let currentLine = '';

terminal.onData(data => {
    if (data==='\r') {
        terminal.write('\r\n');
        runCommand(currentLine, print);
        currentLine = '';
        writePrompt();
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

function writePrompt() {
    const path = getPath(cwd);
    terminal.write(`${path} $ `);
}