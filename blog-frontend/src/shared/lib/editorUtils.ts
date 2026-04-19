export type InsertResult = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

export function insertAtCursor(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string = "",
  defaultText: string = "texto"
): InsertResult {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end) || defaultText;
  const value =
    textarea.value.substring(0, start) +
    before +
    selected +
    after +
    textarea.value.substring(end);
  return {
    value,
    selectionStart: start + before.length,
    selectionEnd: start + before.length + selected.length,
  };
}

export function prependLinePrefix(
  textarea: HTMLTextAreaElement,
  prefix: string
): InsertResult {
  const start = textarea.selectionStart;
  const lineStart = textarea.value.lastIndexOf("\n", start - 1) + 1;
  const value =
    textarea.value.substring(0, lineStart) +
    prefix +
    textarea.value.substring(lineStart);
  return {
    value,
    selectionStart: start + prefix.length,
    selectionEnd: start + prefix.length,
  };
}

export function insertBlock(
  textarea: HTMLTextAreaElement,
  block: string
): InsertResult {
  const start = textarea.selectionStart;
  const needsNewlineBefore = start > 0 && textarea.value[start - 1] !== "\n";
  const prefix = needsNewlineBefore ? "\n" : "";
  const value =
    textarea.value.substring(0, start) +
    prefix +
    block +
    "\n" +
    textarea.value.substring(start);
  const newPos = start + prefix.length + block.length + 1;
  return { value, selectionStart: newPos, selectionEnd: newPos };
}
