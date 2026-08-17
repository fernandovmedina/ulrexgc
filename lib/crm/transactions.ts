export type TransactionRecord = { id: string; created_at: string; updated_at: string; [key: string]: unknown };
export type TransactionAdapter = { read: () => TransactionRecord[]; write: (records: TransactionRecord[]) => void };
export type RollbackFailure = { operation: string; cause: unknown };

const errorMessage = (cause: unknown) => cause instanceof Error ? cause.message : String(cause);

export function rollbackFailureError(saveCause: unknown, failures: RollbackFailure[]) {
  const details = failures.map(({ operation, cause }) => `${operation}: ${errorMessage(cause)}`).join("; ");
  return new Error(`The save failed and rollback also failed (${details}). This document may be in an inconsistent state. Original save error: ${errorMessage(saveCause)}`);
}

export function commitLocalSalesDocument({ documentAdapter, itemAdapter, documentId, documentInput, itemInputs, parentKey, numberKey }: { documentAdapter: TransactionAdapter; itemAdapter: TransactionAdapter; documentId?: string; documentInput: Record<string, unknown>; itemInputs: Array<Record<string, unknown> & { id?: string }>; parentKey: string; numberKey: string }) {
  const documentsBefore = documentAdapter.read();
  const itemsBefore = itemAdapter.read();
  const timestamp = new Date().toISOString();
  const id = documentId ?? crypto.randomUUID();
  const existing = documentsBefore.find((record) => record.id === id);
  const number = String(documentInput[numberKey] ?? "").toLowerCase();
  if (documentsBefore.some((record) => record.id !== id && String(record[numberKey] ?? "").toLowerCase() === number)) throw new Error(`${numberKey.replace(/_/g, " ")} must be unique.`);
  const document = { ...existing, ...documentInput, id, created_at: existing?.created_at ?? timestamp, updated_at: timestamp } as TransactionRecord;
  const retainedItems = itemsBefore.filter((record) => record[parentKey] !== id);
  const nextItems = itemInputs.map((input) => { const current = input.id ? itemsBefore.find((record) => record.id === input.id && record[parentKey] === id) : undefined; return { ...current, ...input, [parentKey]: id, id: current?.id ?? crypto.randomUUID(), created_at: current?.created_at ?? timestamp, updated_at: timestamp } as TransactionRecord; });
  try {
    itemAdapter.write([...nextItems, ...retainedItems]);
    documentAdapter.write([document, ...documentsBefore.filter((record) => record.id !== id)]);
  } catch (cause) {
    const rollbackFailures: RollbackFailure[] = [];
    try { itemAdapter.write(itemsBefore); } catch (rollbackCause) { rollbackFailures.push({ operation: "restoring line items", cause: rollbackCause }); }
    try { documentAdapter.write(documentsBefore); } catch (rollbackCause) { rollbackFailures.push({ operation: "restoring the document", cause: rollbackCause }); }
    if (rollbackFailures.length) throw rollbackFailureError(cause, rollbackFailures);
    throw cause;
  }
  return { document, items: nextItems };
}
