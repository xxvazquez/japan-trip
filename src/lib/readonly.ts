import { useApp } from "@/store/useApp";

/** True when the active trip is the built-in demo — every screen hides its
 *  editing controls and `<Editable>` renders plain text. */
export const useReadOnly = () => useApp((s) => !!s.data?.config.demo);
