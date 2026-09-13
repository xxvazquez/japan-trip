import type { EntityType } from "@/core/types";

/** The detail-page route for an entity, or null for types with no page of
 *  their own (places, areas, luggage, docs, packing — edited in place on
 *  their list). Shared by Manage → Content and the sync-error popover. */
export function entityLink(type: EntityType, id: string): string | null {
  switch (type) {
    case "days": return `/day/${id}`;
    case "legs": return `/leg/${id}`;
    case "hotels": return `/hotel/${id}`;
    case "journeys": return `/journey/${id}`;
    default: return null;
  }
}
