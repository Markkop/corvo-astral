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