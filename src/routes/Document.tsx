import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { INSET_DIVIDER } from "@/components/InsetRow";
import { Editable } from "@/components/Editable";
import { FieldList } from "@/components/FieldList";
import { RichNote } from "@/components/RichNote";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Icon } from "@/components/Icon";
import { useData } from "@/lib/data";
import { useApp, undoable } from "@/store/useApp";
import { useAuth } from "@/lib/auth";
import { supabaseEnabled } from "@/lib/supabase";
import { uploadFile, signedFileUrl, MAX_FILE_BYTES } from "@/lib/cloudFiles";
import { useReadOnly } from "@/lib/readonly";
import { APP_NAME } from "@/lib/app";
import { putFile, fileUrl } from "@/lib/fileStore";
import { driveEnabled, ensureFolder, uploadToDrive, shareFile, driveViewUrl, driveImageUrl } from "@/lib/drive";
import type { Doc, DocFile } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 8);

/** One document from Logbook → Documents, pushed as its own page: its files,
 *  its fields, a note. */
export default function Document() {
  const data = useData();
  const { id } = useParams();
  const navigate = useNavigate();
  const updateEntity = useApp((s) => s.updateEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const tripId = useApp((s) => s.activeId);
  const { user } = useAuth();
  const ro = useReadOnly();
  if (!data) return null;

  const doc = data.docs.find((d) => d.id === id);
  // emergency contacts are docs too, but they live on their own list
  if (doc?.kind === "contact") return <Navigate to="/logbook/emergency" replace />;
  if (!doc)
    return <Missing title="No document here" body="That document isn’t part of this trip." to="/logbook/documents" cta="See all documents" />;
  const p = (patch: Partial<Doc>) => updateEntity<Doc>("docs", doc.id, patch);

  const cloud = driveEnabled && !!user;
  // signed in without Drive: files go to the account's own private storage
  const stored = !cloud && supabaseEnabled && !!user;
  const shareWith = (data.config.driveShareEmails ?? [])
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e && e !== user?.email?.toLowerCase());
  const files = doc.files ?? [];

  return (
    <Page>
      <PageHeader
        back="/logbook/documents"
        title={ro ? doc.title : <Editable label="Document name" value={doc.title} placeholder="Name" onCommit={(v) => p({ title: v || "Untitled" })} />}
      />

      <div className="space-y-6">
        {(!ro || files.length > 0) && (
          <Section icon="vault" title="Files">
            <Attachments
              files={files}
              cloud={cloud}
              tripId={stored ? tripId : null}
              folderName={`${APP_NAME} · ${data.meta.title}`}
              shareWith={shareWith}
              onChange={(next) => p({ files: next })}
            />
          </Section>
        )}

        {(!ro || doc.fields.length > 0) && (
          <Section icon="list" title="Details">
            <ul>
              <FieldList inset fields={doc.fields} onChange={(next) => p({ fields: next })} />
            </ul>
          </Section>
        )}

        {(doc.note?.trim() || !ro) && (
          <Section icon="list" title="Notes">
            <div className="note px-3.5 py-3">
              <RichNote value={doc.note ?? ""} onCommit={(v) => p({ note: v || undefined })} placeholder="Add a note…" />
            </div>
          </Section>
        )}

        {!ro && (
          <Section>
            <ConfirmButton
              onConfirm={() => undoable("Document deleted", () => { removeEntity("docs", doc.id); navigate("/logbook/documents"); })}
              label="Delete document"
              className="w-full justify-center px-3.5 py-3 text-sm text-danger"
            >
              Delete document
            </ConfirmButton>
          </Section>
        )}
      </div>
    </Page>
  );
}

function Attachments({
  files, onChange, cloud, tripId, folderName, shareWith,
}: {
  files: DocFile[];
  onChange: (files: DocFile[]) => void;
  cloud: boolean;
  /** set when files should go to the account's private storage for this trip */
  tripId: string | null;
  folderName: string;
  shareWith: string[];
}) {
  const ro = useReadOnly();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [broken, setBroken] = useState<Set<string>>(new Set());

  const add = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setErr("");
    if (cloud) {
      setBusy(true);
      try {
        const folderId = await ensureFolder(folderName);
        const added: DocFile[] = [];
        for (const f of Array.from(fileList)) {
          const up = await uploadToDrive(f, f.name, folderId);
          if (shareWith.length) await shareFile(up.id, shareWith);
          added.push({ id: rid(), name: up.name, size: up.size, driveId: up.id, mime: up.mime });
        }
        onChange([...files, ...added]);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setBusy(false);
      }
    } else if (tripId) {
      setBusy(true);
      try {
        const added: DocFile[] = [];
        for (const f of Array.from(fileList)) {
          if (f.size > MAX_FILE_BYTES) throw new Error(`“${f.name}” is over ${MAX_FILE_BYTES / 1048576} MB, which is the most one file can be.`);
          const id = crypto.randomUUID();
          const storagePath = `${tripId}/${id}`;
          await uploadFile(storagePath, f);
          added.push({ id, name: f.name, size: f.size, mime: f.type, storagePath });
        }
        onChange([...files, ...added]);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setBusy(false);
      }
    } else {
      const added: DocFile[] = [];
      for (const f of Array.from(fileList)) added.push({ id: await putFile(f), name: f.name, size: f.size, mime: f.type });
      onChange([...files, ...added]);
    }
  };

  const open = async (f: DocFile) => {
    if (f.driveId) window.open(driveViewUrl(f.driveId), "_blank", "noopener");
    else if (f.storagePath) {
      // open the tab first (a popup blocker only allows it inside the tap), then point it at the signed link
      const w = window.open("", "_blank");
      const url = await signedFileUrl(f.storagePath).catch(() => null);
      if (url && w) w.location.href = url;
      else { w?.close(); setErr("Couldn’t open that file right now — check your connection and try again."); }
    } else {
      const url = await fileUrl(f.id);
      if (url) window.open(url, "_blank");
    }
  };
  // Only the reference goes. The bytes (device or Drive) are deliberately left
  // where they are: removing a row can be undone from the toast or a restore
  // point, and an undo pointing at a deleted file would restore a dead link.
  const remove = (f: DocFile) => onChange(files.filter((x) => x.id !== f.id));

  return (
    <>
      <ul>
        {files.map((f) => {
          const img = f.driveId && f.mime?.startsWith("image/") && !broken.has(f.id);
          return (
            <li key={f.id} className={`${INSET_DIVIDER} px-3.5 py-3`}>
              <div className="flex items-center gap-2.5">
                <Icon name="vault" size={16} className="shrink-0 text-ink-soft" />
                <button onClick={() => open(f)} className="value min-w-0 flex-1 break-words text-left text-accent">{f.name}</button>
                {f.size ? <span className="meta shrink-0 tabular-nums">{(f.size / 1048576).toFixed(1)} MB</span> : null}
                {!ro && (
                  <ConfirmButton onConfirm={() => remove(f)} label="Remove file" className="tap shrink-0 text-ink-faint hover:text-danger">
                    <Icon name="trash" size={15} />
                  </ConfirmButton>
                )}
              </div>
              {img && (
                <button onClick={() => open(f)} className="mt-2 block">
                  <img
                    src={driveImageUrl(f.driveId!)}
                    alt={f.name}
                    loading="lazy"
                    onError={() => setBroken((s) => new Set(s).add(f.id))}
                    className="max-h-40 rounded border border-line object-cover"
                  />
                </button>
              )}
            </li>
          );
        })}
        {!ro && (
          <li className={INSET_DIVIDER}>
            <label className={`action w-full px-3.5 py-2.5 text-xs transition-colors duration-150 active:bg-ink/[0.07] ${busy ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
              <Icon name="plus" size={14} /> {busy ? "Uploading…" : files.length ? "Attach another file" : "Attach a file"}
              <input type="file" accept=".pdf,image/*" multiple className="hidden" disabled={busy} onChange={(e) => { void add(e.target.files); e.target.value = ""; }} />
            </label>
          </li>
        )}
      </ul>
      {err && <p className="meta px-3.5 pb-3 text-danger">{err}</p>}
    </>
  );
}
