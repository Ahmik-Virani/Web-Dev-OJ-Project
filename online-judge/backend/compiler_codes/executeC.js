import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url); // Get the resolved path to the file
const __dirname = path.dirname(__filename); // Get the name of the directory

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = (filePath, inputPath) => {
    const jobId = path.basename(filePath).split('.')[0];
    const filename = `${jobId}.out`;
    const outPath = path.join(outputPath, filename);

    return new Promise((resolve, reject) => {
        exec(
            `gcc '${filePath}' -o '${outPath}' && cd '${outputPath}' && ./${jobId}.out < '${inputPath}'`,
            (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else if (stderr) {
                    reject(stderr);
                } else {
                    // Cleanup the compiled and temporary files
                    exec(
                        `rm '${outPath}' && rm '${inputPath}' && rm '${filePath}'`,
                        (cleanupError, cleanupStdout, cleanupStderr) => {
                            if (cleanupError) {
                                reject(cleanupError);
                            } else if (cleanupStderr) {
                                reject(cleanupStderr);
                            } else {
                                resolve(stdout);
                            }
                        }
                    );
                }
            }
        );
    });
};

export default executeC

