import { logger } from '../helpers';
import { runDataloadJob } from './dataload';
import { runSsrUrlsJob } from './ssrurls';

interface JobMap {
  [key: string]: Function;
}

// list of available batch jobs (subfolder for each job under /jobs)
export const JOBS: JobMap = {
  dataload: runDataloadJob,
  ssrurls: runSsrUrlsJob
};

// using the arguments, find the appropriate command and execute it
export async function findJobAndExecute(args: any) {
  const startTime = new Date().getTime();

  // if -l in command, just display the available jobs
  if (args.list) {
    logger.info('list of jobs:\n' + Object.keys(JOBS).join('\n'));
    return Promise.resolve();

    // else if no job name passed in, then the command is invalid
  } else if (!args.jobName || !JOBS[args.jobName]) {
    logger.error('invalid command');
    args.help();
    return Promise.resolve();
  }

  // else we have a command, so execute it
  await JOBS[args.jobName](args);

  // finally display the time it took to complete
  const endTime = new Date().getTime();
  const seconds = (endTime - startTime) / 1000;
  logger.info(`batch completed in ${seconds} seconds`);
}
