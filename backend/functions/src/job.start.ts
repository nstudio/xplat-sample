import * as commander from 'commander';
import { initBackend } from './backend.init';
import { findJobAndExecute } from './jobs/job.manager';

(async function() {
  commander
    .version('1.0.0')
    .option('-n, --jobName [jobName]', 'Name of batch job to run (required)')
    .option('-t, --target', 'Target only one specific thing')
    .option('-d, --del', 'Delete data before processing job')
    .option('-x, --exportdata', 'Export data only from the data processing job')
    .option('-e, --env [dev|staging|production]', 'Use [dev] environment', 'localdev')
    .option('-l, --list', 'List available batch jobs')
    .parse(process.argv);

  initBackend(commander.env);
  await findJobAndExecute(commander);
})();
