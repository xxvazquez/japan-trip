import "fake-indexeddb/auto";
import { afterEach } from "vitest";
import { clear } from "idb-keyval";

// every test starts from an empty device store — nothing from one test's
// snapshots/quarantine entries should be visible to the next
afterEach(async () => {
  await clear();
});
