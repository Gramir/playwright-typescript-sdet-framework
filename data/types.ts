import usersData from './swaglabs/users.json' with { type: 'json' };
import snapshotsData from './snapshots.json' with { type: 'json' };

export type SwagUserRole = keyof typeof usersData;
export type UserCredentials = (typeof usersData)[SwagUserRole];

export type SnapshotKey = keyof typeof snapshotsData;
export type SnapshotConfig = (typeof snapshotsData)[SnapshotKey];

export { usersData, snapshotsData };
