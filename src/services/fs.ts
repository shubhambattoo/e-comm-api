import { readFile, writeFile } from 'node:fs/promises';
import * as path from 'path';

export const readFileContents = async (filePath: string): Promise<any> => {
  try {
    const fileContents = await readFile(path.join(__dirname, filePath), {
      encoding: 'utf-8',
    });
    return fileContents;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const writeFileContents = async (filePath: string, data: any) => {
  try {
    await writeFile(path.join(__dirname, filePath), data, {
      encoding: 'utf-8',
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
