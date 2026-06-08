/** Input sanitization — XSS aur injection se bachao */

export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

export function sanitizeSearch(input: string): string {
  return input.replace(/[<>"'`]/g, "").trim().slice(0, 200);
}

export function sanitizeNumber(input: string): number | undefined {
  const n = parseFloat(input);
  return isNaN(n) ? undefined : n;
}

export function truncate(str: string, max = 100): string {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}
