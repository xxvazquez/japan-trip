-- Document attachments. Each entry is { id, name, size?, driveId?, mime? } —
-- `driveId` set means the file lives in the trip's shared Google Drive folder
-- and is visible to everyone the trip is shared with; without it the bytes are
-- only in the adder's browser (legacy). Run AFTER 0013. Safe to re-run.

alter table docs add column if not exists files jsonb not null default '[]';
