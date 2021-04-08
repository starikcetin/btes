import { DocManifest } from './DocManifest';
import homeManifest from './home/manifest';
import fooManifest from './foo/manifest';
import glossaryManifest from './glossary/manifest';
import btesworksManifest from './btesworks/manifest';
import coursecatalogManifest from './coursecatalog/manifest';
import acknowledgementManifest from './acknowledgement/manifest';
import platformbasicsManifest from './platformbasics/manifest';
import coursecontentManifest from './coursecontent/manifest';

export const allDocManifests: ReadonlyArray<DocManifest> = [
  homeManifest,
  btesworksManifest,
  coursecontentManifest,
  platformbasicsManifest,
  coursecatalogManifest,
  glossaryManifest,
  acknowledgementManifest,
  fooManifest,
];
