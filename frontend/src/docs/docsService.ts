import _ from 'lodash';
import { DocManifest } from './DocManifest';
import { allDocManifests } from './allDocManifests';

const idToDocMap = _.keyBy(allDocManifests, (m) => m.id);

/**
 * Returns the `DocManifest` of the doc with the given `id`.
 * Returns `null` if no doc with the given `id` is found.
 * @param id `id` of the doc. Specified in the doc's manifest file.
 * @returns The `DocManifest` with the given id. `null` if no doc has the given `id`.
 */
export const getDoc = (id: string): DocManifest | null =>
  idToDocMap[id] ?? null;

/** Returns `DocManifest`s of all registered docs. */
export const getAllDocIds = (): ReadonlyArray<string> =>
  Object.keys(idToDocMap);
