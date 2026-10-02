-- A note with no title used to be saved as the literal "Untitled" (0025
-- wrote the same for the first Scratchpad note). The app already shows
-- these as untitled; this clears the stored text to match. Safe to re-run.

update scratch_notes set title = '' where title = 'Untitled';
update luggage set title = '' where title = 'Untitled';
