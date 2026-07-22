// file system

const root = {
    type: 'dir',
    name: '/',
    parent: null,
    children: {}
}

const home = {
    type: 'dir',
    name: 'home',
    parent: root,
    children: {}
}

root.children['home'] = home

const soham = {
    type: 'dir',
    name: 'soham',
    parent: home,
    children: {}
}

home.children['soham'] = soham

let cwd = root

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

// command parser

function parseInput(rawInput) {
    const parts = rawInput.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);
    return { command, args };
}

const commands = {
    mkdir,
    touch
}

function dispatch (command, args, cwd, output) {
    if (command === '') {
        return;
    }
    if (commands[command]) {
        commands[command](cwd, args, output);
    }
    else {
        output(`${command}: command not found`);
    }
}

function runCommand(rawInput, output) {
  const { command, args } = parseInput(rawInput);
  dispatch(command, args, cwd, output);
}