import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const outputPath = path.join(__dirname, "outputs");

if(!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, {recursive: true});
}

const executeCpp = (filePath) => {
    const jobId = path.basename(filePath).split('.')[0];
    const filename = `${jobId}.out`;
    const outPath = path.join(outputPath, filename);

    return new Promise((resolve, reject) => {
        exec(
            `g++ ${filePath} -o ${outPath} && ${outPath}`, 
            (error, stdout, stderr) => {
                if(error){
                    reject(error);
                }
                if(stderr){
                    reject(stderr);
                }
                resolve(stdout);
        });
    })
}

export default executeCpp