import fs from 'fs'

export function openFile (path: string) {
  try {
    const file = fs.readFileSync(path)
    return JSON.parse(String(file))
  } catch (err) {
    console.error(err)
  }
}

function createFoldersIfInexistent(filePath: string) {
  const folders = filePath.split('/').slice(0, -1); 
  folders.reduce((acc, folder) => {
    const folderPath = acc + folder + '/';
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    return folderPath
  }, ''); 
}

export function saveFile (data: any, filePath: string) {
  try {
    createFoldersIfInexistent(filePath)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error(err)
  }
}

export function writeFileSyncRecursive(filename, content, charset) {
  // -- normalize path separator to '/' instead of path.sep, 
  // -- as / works in node for Windows as well, and mixed \\ and / can appear in the path
  let filepath = filename.replace(/\\/g,'/');  

  // -- preparation to allow absolute paths as well
  let root = '';
  if (filepath[0] === '/') { 
    root = '/'; 
    filepath = filepath.slice(1);
  } 
  else if (filepath[1] === ':') { 
    root = filepath.slice(0,3);   // c:\
    filepath = filepath.slice(3); 
  }

  // -- create folders all the way down
  const folders = filepath.split('/').slice(0, -1);  // remove last item, file
  folders.reduce(
    (acc, folder) => {
      const folderPath = acc + folder + '/';
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      return folderPath
    }, 
    root // first 'acc', important
  ); 
  
  // -- write file
  fs.writeFileSync(root + filepath, content, charset);
}
