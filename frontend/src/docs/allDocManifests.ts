import { DocManifest } from './DocManifest';
import homeManifest from './home/manifest';
import fooManifest from './foo/manifest';

export const allDocManifests: ReadonlyArray<DocManifest> = [
  homeManifest,
  fooManifest,
];
