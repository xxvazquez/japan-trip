/**
 * Typed failures for the data-safety layer. The point of having types at all:
 * "couldn't read it" and "there is nothing there" must never look the same to a
 * caller, because the second one is allowed to seed defaults and the first one
 * is not.
 */

/** An error whose message is written for the person using the app — safe to
 *  show as-is (anything else gets a generic line, never a stack or a SQL hint). */
export class UserFacingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserFacingError";
  }
}

/** Why a trip couldn't be opened. */
export type LoadFailure =
  /** the stored data is there but structurally broken */
  | "corrupt"
  /** the trip is listed but its data is gone */
  | "missing"
  /** storage or the network failed — the data may be perfectly fine */
  | "unavailable"
  /** written by a newer version of the app than this one */
  | "newer";

/** A trip couldn't be opened safely. Carries enough to drive the recovery screen. */
export class TripLoadError extends UserFacingError {
  constructor(
    public readonly kind: LoadFailure,
    message: string,
    public readonly tripId?: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "TripLoadError";
  }
}

/** A write to local storage failed or didn't stick. */
export class StorageError extends UserFacingError {
  constructor(
    public readonly kind: "read" | "write" | "quota" | "corrupt",
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "StorageError";
  }
}

/**
 * A save was refused on purpose because writing it would (or might) destroy
 * good data. The in-memory state is untouched and nothing was written.
 */
export class SaveBlockedError extends UserFacingError {
  constructor(
    public readonly reason: "invalid" | "would-erase" | "no-backup",
    message: string,
  ) {
    super(message);
    this.name = "SaveBlockedError";
  }
}

export const isQuotaError = (e: unknown): boolean =>
  !!e &&
  typeof e === "object" &&
  (((e as { name?: string }).name === "QuotaExceededError") ||
    ((e as { code?: number }).code === 22) ||
    /quota/i.test(String((e as { message?: string }).message ?? "")));
