import { DocManifest } from './DocManifest';
import homeManifest from './home/manifest';
import fooManifest from './foo/manifest';
import glossaryManifest from './glossary/manifest';
import btesworksManifest from './btesworks/manifest';
import coursecatalogManifest from './coursecatalog/manifest';

export const allDocManifests: ReadonlyArray<DocManifest> = [
  homeManifest,
  btesworksManifest,
  coursecatalogManifest,
  glossaryManifest,
  fooManifest,
];
