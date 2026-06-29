// ESM browser stub for resolveSignedURLKey.
// Server-only utility — not needed in client bundles. The no-op export allows
// the cloud-storage utilities barrel to re-export it without bundling
// payload/dist/exports/internal (and its server-only deps: pino, undici, etc).
export async function resolveSignedURLKey() {
  return { fileKey: '', sanitizedDocPrefix: '', sanitizedFilename: '' }
}
