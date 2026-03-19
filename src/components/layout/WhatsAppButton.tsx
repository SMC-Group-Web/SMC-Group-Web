import { siteConfig } from '@/lib/site'

export default function WhatsAppButton() {
  const href = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappMessage
  )}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
    >
      WhatsApp
    </a>
  )
}