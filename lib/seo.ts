// адреса сайту для metadataBase: на Vercel — продакшн-домен проєкту,
// локально — dev-сервер (відносні openGraph.url стають абсолютними)
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const OG_IMAGE = {
  url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
  width: 1200,
  height: 630,
  alt: "NoteHub",
};
