import { Gathering, getGatherings, getTags } from '../../services';
import { writeFileSync } from 'fs';
import { join } from 'path';

export async function runSsrUrlsJob(args: any) {
  const urls = await getSsrUrls();
  writeSsrUrlsToFile(urls);
}

export async function getSsrUrls(): Promise<string[]> {
  const allTagUrls = ((await getTags({})) || []).map(tag => `/${tag.slug}`);
  const allGatheringUrls = ((await getGatherings({})) || []).map(g => getGatheringUrl(g));
  return ['/', ...allTagUrls, ...allGatheringUrls];
}

export function getGatheringUrl(gathering: Gathering): string {
  const tagSlug = (gathering && gathering.tags && gathering.tags[0]) || 'ngconf2018';
  return `/${tagSlug}/${gathering.slug}`;
}

export function writeSsrUrlsToFile(urls: string[]) {
  const rootDir = process.cwd();
  const filePath = join(rootDir, '../../frontend/apps/ssr-sketchpoints.io/src/ssr-urls.json');
  const fileContents = JSON.stringify({ urls }, null, 2);
  writeFileSync(filePath, fileContents, 'utf8');
}
