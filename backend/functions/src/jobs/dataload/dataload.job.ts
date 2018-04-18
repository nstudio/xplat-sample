import * as path from 'path';
import * as fs from 'fs';
import { logger } from '../../helpers';
import { DataLoad, DATALOAD_MAP } from './dataload.map';

export async function runDataloadJob(args: any) {
  const { target, del, exportdata } = args;

  if (exportdata) {
    await exportAllData(target);
    return;
  }

  // if we should delete data first, do that
  if (del) {
    await purgeData(target);
  }

  // then load the data
  await seedData(target);
}

export async function exportAllData(target?: string) {
  const allData = (await getAllData(target)) || [];
  const targetFilePath = path.join(process.cwd(), 'src/jobs/dataload/dataexported.json');
  fs.writeFileSync(targetFilePath, JSON.stringify(allData, null, 2), 'utf8');
}

export async function getAllData(target?: string) {
  const collectionNames = target ? [target] : Object.keys(DATALOAD_MAP);
  return Promise.all(collectionNames.map(name => getAllDataForCollection(name)));
}

export async function getAllDataForCollection(collectionName: string) {
  const dataLoad: DataLoad = DATALOAD_MAP[collectionName];
  const allDataFoCollection: any = {};
  allDataFoCollection[collectionName] = dataLoad ? await dataLoad.get() : null;
  return allDataFoCollection;
}

export async function purgeData(target?: string) {
  const allDataToBePurged = await getAllData(target);

  logger.info(`
      -----deleted data begin -----
      ${JSON.stringify(allDataToBePurged, null, 2)}
      -----deleted data end   -----
      `);

  const collectionNames = target ? [target] : Object.keys(DATALOAD_MAP);
  return Promise.all(collectionNames.map(name => purgeDataFromCollection(name)));
}

export async function purgeDataFromCollection(collectionName: string) {
  const dataLoad: DataLoad = DATALOAD_MAP[collectionName];
  return dataLoad ? dataLoad.del() : Promise.resolve();
}

export async function seedData(target?: string) {
  const collectionNames = target ? [target] : Object.keys(DATALOAD_MAP);
  return Promise.all(collectionNames.map(name => seedDataForCollection(name)));
}

export async function seedDataForCollection(collectionName: string) {
  const dataLoad: DataLoad = DATALOAD_MAP[collectionName];
  const docs: any[] = (dataLoad && dataLoad.data) || [];
  return Promise.resolve(docs.map(doc => dataLoad.create(doc)));
}
