import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { INSET_DIVIDER } from "@/components/InsetRow";
import { Editable } from "@/components/Editable";
import { FieldList } from "@/components/FieldList";
import { RichNote } from "@/components/RichNote";
import { ConfirmButton } from "@/components/ConfirmButton";
import { RowMenu } from "@/components/RowMenu";
import { ContextMenu } from "@/components/ContextMenu";
import { ConfirmMenuItem } from "@/components/ActionSheet";
import { Icon } from "@/components/Icon";
import { useData } from "@/lib/data";
import { useApp, undoable } from "@/store/useApp";
import { useAuth } from "@/lib/auth";
import { supabaseEnabled } from "@/lib/supabase";
import { uploadFile, MAX_FILE_BYTES } from "@/lib/cloudFiles";
import { useReadOnly } from "@/lib/readonly";
import { APP_NAME } from "@/lib/app";
import { getFileBlob, putFile, putFileAs } from "@/lib/fileStore";
import { loadFile, saveFilesToDevice, sourceOf, useOnDevice } from "@/lib/offlineFiles";
import type { ViewerFile } from "@/components/FileViewer";
import { driveEnabled, driveConnected, prepareDrive, connectDrive, ensureFolder, uploadToDrive, shareFile, driveViewUrl, driveImageUrl } from "@/lib/drive";
import type { Doc, DocFile } from "@/core/types";

const FileViewer = lazy(() => import("@/components/FileViewer"));

/** "840 KB", "2.4 MB" — the way Files sizes a document; never "0.0 MB". */
const fmtBytes = (b: number) =>
  b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1048576).toFixed(1)} MB`;

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
          <Section title="Files">
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
          <Section title="Details">
            <ul>
              <FieldList inset fields={doc.fields} onChange={(next) => p({ fields: next })} />
            </ul>
          </Section>
        )}

        {(doc.note?.trim() || !ro) && (
          <Section title="Notes">
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
  // Drive access comes from a Google popup, which the browser only allows
  // straight from a tap — so it's its own step before the file picker, not
  // something the upload asks for halfway through
  const [connected, setConnected] = useState(driveConnected);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!cloud || ro) return;
    prepareDrive().then(() => setReady(true), (e) => setErr(e instanceof Error ? e.message : "Couldn’t reach Google."));
  }, [cloud, ro]);
  const connect = () => {
    setErr("");
    connectDrive().then(() => setConnected(true), (e) => setErr(e instanceof Error ? e.message : "Google sign-in failed."));
  };
  // keep a copy of each file on this device, so it opens with no signal
  const onDevice = useOnDevice(files);
  useEffect(() => {
    void saveFilesToDevice(files, { drive: connected });
  }, [files, connected]);
  const [viewing, setViewing] = useState<ViewerFile | null>(null);

  const add = async (fileList: File[]) => {
    if (!fileList.length) return;
    setErr("");
    if (cloud) {
      setBusy(true);
      try {
        const folderId = await ensureFolder(folderName);
        const added: DocFile[] = [];
        for (const f of fileList) {
          const up = await uploadToDrive(f, f.name, folderId);
          if (shareWith.length) await shareFile(up.id, shareWith);
          const id = rid();
          await putFileAs(id, f, { copy: true }).catch(() => {}); // opens offline from the start
          added.push({ id, name: up.name, size: up.size, driveId: up.id, mime: up.mime });
        }
        onChange([...files, ...added]);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setBusy(false);
        setConnected(driveConnected());
      }
    } else if (tripId) {
      setBusy(true);
      try {
        const added: DocFile[] = [];
        for (const f of fileList) {
          if (f.size > MAX_FILE_BYTES) throw new Error(`“${f.name}” is over ${MAX_FILE_BYTES / 1048576} MB, which is the most one file can be.`);
          const id = crypto.randomUUID();
          const storagePath = `${tripId}/${id}`;
          await uploadFile(storagePath, f);
          await putFileAs(id, f, { copy: true }).catch(() => {}); // opens offline from the start
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
      for (const f of fileList) added.push({ id: await putFile(f), name: f.name, size: f.size, mime: f.type });
      onChange([...files, ...added]);
    }
  };

  // opens inside the app, from the copy on this device (fetched first if it
  // isn't here yet). A Drive file this device has no copy of, with Drive not
  // connected, can only be shown by Google — online, in a new tab.
  const open = (f: DocFile) => {
    if (sourceOf(f) === "drive" && !onDevice?.has(f.id) && !driveConnected() && navigator.onLine) {
      window.open(driveViewUrl(f.driveId!), "_blank", "noopener");
      return;
    }
    setViewing({ name: f.name, mime: f.mime, load: () => loadFile(f) });
  };
  // Only the reference goes. The bytes (device or Drive) are deliberately left
  // where they are: removing a row can be undone from the toast or a restore
  // point, and an undo pointing at a deleted file would restore a dead link.
  const remove = (f: DocFile) => onChange(files.filter((x) => x.id !== f.id));

  return (
    <>
      <ul>
        {files.map((f) => {
          const img = f.mime?.startsWith("image/") && !broken.has(f.id) && (f.driveId || onDevice?.has(f.id));
          return (
            <ContextMenu as="li" key={f.id} className={`${INSET_DIVIDER} px-3.5 py-3`}>
              <div className="flex items-center gap-2.5">
                <Icon name="vault" size={16} className="shrink-0 text-ink-soft" />
                <button onClick={() => open(f)} className="value min-w-0 flex-1 break-words text-left text-accent">{f.name}</button>
                {/* Files' iCloud badge: not on this device yet */}
                {onDevice && sourceOf(f) && !onDevice.has(f.id) && (
                  <span className="shrink-0 text-ink-faint" aria-label="Not saved on this device">
                    <Icon name="cloud-down" size={16} />
                  </span>
                )}
                {f.size ? <span className="meta shrink-0 tabular-nums">{fmtBytes(f.size)}</span> : null}
                {/* one quiet ⋯ like every other list row, not a bin on each file */}
                {!ro && (
                  <RowMenu label="File options">
                    <button type="button" className="menu-item" onClick={() => open(f)}>Open</button>
                    <ConfirmMenuItem onConfirm={() => remove(f)} label="Remove file" confirmLabel="Tap again to remove" />
                  </RowMenu>
                )}
              </div>
              {img && (
                <button onClick={() => open(f)} className="mt-2 block">
                  <FilePreview
                    file={f}
                    local={!!onDevice?.has(f.id)}
                    onError={() => setBroken((s) => new Set(s).add(f.id))}
                  />
                </button>
              )}
            </ContextMenu>
          );
        })}
        {!ro && cloud && !connected && (
          <li className={INSET_DIVIDER}>
            <button
              type="button"
              onClick={connect}
              disabled={!ready}
              className="action w-full px-3.5 py-2.5 text-xs transition-colors duration-150 active:bg-ink/[0.07] disabled:opacity-50"
            >
              <Icon name="link" size={14} /> Connect Google Drive to attach
            </button>
          </li>
        )}
        {!ro && (!cloud || connected) && (
          <li className={INSET_DIVIDER}>
            <label className={`action w-full px-3.5 py-2.5 text-xs transition-colors duration-150 active:bg-ink/[0.07] ${busy ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
              <Icon name="plus" size={14} /> {busy ? "Uploading…" : files.length ? "Attach another file" : "Attach a file"}
              <input type="file" accept=".pdf,image/*" multiple className="hidden" disabled={busy} onChange={(e) => {
                  // copy first: the input's FileList is live, and clearing the
                  // value (so the same file can be picked again) empties it —
                  // before the Drive path, which awaits its folder, reads it
                  void add(Array.from(e.target.files ?? []));
                  e.target.value = "";
                }} />
            </label>
          </li>
        )}
      </ul>
      {err && <p className="meta px-3.5 pb-3 text-danger">{err}</p>}
      {viewing && (
        <Suspense fallback={null}>
          <FileViewer file={viewing} onClose={() => setViewing(null)} />
        </Suspense>
      )}
    </>
  );
}

/** A photo attachment's preview — the copy on this device when there is
 *  one, so it shows with no signal, else Drive's own thumbnail. */
function FilePreview({ file, local, onError }: { file: DocFile; local: boolean; onError: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!local) return;
    let u: string | null = null;
    let live = true;
    void getFileBlob(file.id).then((b) => {
      if (!live || !b) return;
      u = URL.createObjectURL(b);
      setUrl(u);
    }).catch(() => {});
    return () => {
      live = false;
      if (u) URL.revokeObjectURL(u);
    };
  }, [file.id, local]);
  const src = url ?? (local || !file.driveId ? null : driveImageUrl(file.driveId));
  if (!src) return null;
  return <img src={src} alt={file.name} loading="lazy" onError={onError} className="max-h-40 rounded border border-line object-cover" />;
}
