import { useEffect } from "react";

export const SITE_URL = "https://logic-guesser.lovable.app";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  noindex?: boolean;
  jsonLd?: JsonLd;
}

function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export function usePageMeta({
  title,
  description,
  path,
  type = "website",
  image,
  noindex = false,
  jsonLd,
}: PageMetaOptions) {
  useEffect(() => {
    const url = absoluteUrl(path);
    document.title = title;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex,follow" : "index,follow,max-image-preview:large");
    upsertCanonical(url);

    upsertMeta("property", "og:site_name", "LogicGuesser");
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    if (image) {
      upsertMeta("property", "og:image", image);
      upsertMeta("name", "twitter:image", image);
    }

    const existing = document.head.querySelector<HTMLScriptElement>('script[data-page-json-ld="true"]');
    if (existing) existing.remove();

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.pageJsonLd = "true";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      if (script?.parentNode) script.parentNode.removeChild(script);
    };
  }, [title, description, path, type, image, noindex, jsonLd]);
}