import { DocManifest } from './DocManifest';
import homeManifest from './home/manifest';
import glossaryManifest from './glossary/manifest';
import btesworksManifest from './btesworks/manifest';
import coursecatalogManifest from './coursecatalog/manifest';
import acknowledgementsManifest from './acknowledgements/manifest';
import platformbasicsManifest from './platformbasics/manifest';
import coursecontentManifest from './coursecontent/manifest';

export const allDocManifests: ReadonlyArray<DocManifest> = [
  homeManifest,
  btesworksManifest,
  coursecontentManifest,
  platformbasicsManifest,
  coursecatalogManifest,
  acknowledgementsManifest,
  glossaryManifest,
];
