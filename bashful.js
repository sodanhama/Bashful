// file system

const root = {
    type: 'dir',
    name: '/',
    parent: null,
    children: {}
}

let cwd = root

// commands

function createNode(cwd, name, node) {
  if (cwd.children[name]) {
    return { error: `cannot create '${name}': File exists` };
  }
  node.parent = cwd;
  cwd.children[name] = node;
  return { error: null };
}

function mkdir(cwd, args, output) {
    const dirName = args[0];
    const result = createNode(cwd, dirName, {
        type: 'dir',
        name: dirName,
        children: {}
    });
    if (result.error) output(`mkdir: ${result.error}`);
}

function touch(cwd, args, output) {
    const fileName = args[0];
    const result = createNode(cwd, fileName, {
        type: 'file',
        name: fileName,
        content: ''
    });
    if (result.error) output(`touch: ${result.error}`);
}

function ls(cwd, args, output) {
    const result = Object.keys(cwd.children).join('\r\n');
    output(result);
}

function cd(cwd, args, output) {
    const target = args[0];
    const dest = cwd.children[target];

    if (!dest) {
        output(`cd: ${target}: No such file or directory`);
        return cwd;
    }
    if (dest.type !== 'dir') {
        output(`cd: not a directory: ${target}`);
        return cwd;
    }
    return dest;
}

// command parser

function parseInput(rawInput) {
    const parts = rawInput.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);
    return { command, args };
}

const commands = {
    ls,
    mkdir,
    touch,
    cd
}

function dispatch (command, args, cwd, output) {
    if (command === '') {
        return cwd;
    }
    if (commands[command]) {
        const result = commands[command](cwd, args, output);
        if (result !== undefined) {
            cwd = result;
        }
    }
    else {
        output(`${command}: command not found`);
    }
    return cwd;
}

function runCommand(rawInput, output) {
    const { command, args } = parseInput(rawInput);
    cwd = dispatch(command, args, cwd, output)
}