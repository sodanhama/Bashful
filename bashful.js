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

function createNode(cwd, name, node) {
  if (cwd.children[name]) {
    return { error: `cannot create '${name}': File exists` };
  }
  node.parent = cwd;
  cwd.children[name] = node;
  return { error: null };
}

function mkdir(cwd, dirName) {
  const result = createNode(cwd, dirName, {
    type: 'dir',
    name: dirName,
    children: {}
  });
  if (result.error) console.log(`mkdir: ${result.error}`);
}

function touch(cwd, fileName) {
  const result = createNode(cwd, fileName, {
    type: 'file',
    name: fileName,
    content: ''
  });
  if (result.error) console.log(`touch: ${result.error}`);
}

// command parser

function parseCommand(rawInput) {
    const parts = rawInput.trim().split(' ');
    const command = parts[0];
    const args = parts.slice(1);
    return { command, args };
}