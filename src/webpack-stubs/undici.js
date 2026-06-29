// ESM browser stub for undici.
// @vercel/blob checks `hasFetch = typeof fetch === "function"` and falls back
// to XMLHttpRequest when fetch is undefined — XHR works in all modern browsers.
// Exporting undefined as named ESM exports satisfies webpack's static analysis
// without bundling any Node.js-only APIs.
export const fetch = undefined
export const Headers = undefined
export const Request = undefined
export const Response = undefined
export const FormData = undefined
export const File = undefined
