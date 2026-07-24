// file system

const root = {
    type: 'dir',
    name: '/',
    parent: null,
    children: {}
}

const text = {
    type: 'file',
    name: 'text',
    content: 'Hello, world!',
    parent: root,
}

root.children['text'] = text;

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

function getPath(node) {
    const parts = [];
    while (node.parent !== null) {
        parts.unshift(node.name);
        node = node.parent;
    }
    return '/' + parts.join('/');
}

const commands = {
    ls,
    rm,
    mkdir,
    touch,
    cd,
    pwd,
    cat,
    echo
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

function rm(cwd, args, output) {
    const target = args[0];
    const dest = cwd.children[target];

    if (!dest) {
        output(`rm: ${target}: No such file or directory`);
        return cwd;
    }
    delete cwd.children[target];
    return cwd;
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

function echo(cwd, args, output) {
    const text = args.join(' ');
    output(text);
}

function cd(cwd, args, output) {
    const target = args[0];
    if (target === "..") {
        if (cwd === root) {
            return cwd;
        }
        return cwd.parent;
    }
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

function cat(cwd, args, output) {
    const target = args[0];
    const dest = cwd.children[target];

    if (!dest) {
        output(`cat: ${target}: No such file or directory`);
        return cwd;
    }
    if (dest.type !== 'file') {
        output(`cat: not a file: ${target}`);
        return cwd;
    }
    output(dest.content);
    return cwd;
}

function pwd(cwd, args, output) {
    output(getPath(cwd));
    return cwd;
}

// command parser

function parseInput(rawInput) {
    const parts = rawInput.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);
    return { command, args };
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