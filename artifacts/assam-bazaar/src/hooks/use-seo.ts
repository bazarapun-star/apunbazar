// src/hooks/use-seo.ts
// Per-page SEO meta tags hook
import { useEffect } from "react";

interface SEOMeta {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "product";
}

export function useSEO({ title, description, image, type = "website" }: SEOMeta) {
  useEffect(() => {
    // Page title
    document.title = `${title} | ApunBazar — Assam ka Dil`;

    // Meta description
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (el) {
        el.setAttribute(attr, value);
      } else {
        el = document.createElement("meta");
        // parse attribute from selector if possible
        document.head.appendChild(el);
      }
    };

    if (description) {
      setMeta('meta[name="description"]', "content", description.slice(0, 155));
      setMeta('meta[property="og:description"]', "content", description.slice(0, 155));
    }

    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[property="og:site_name"]', "content", "ApunBazar");

    if (image) {
      setMeta('meta[property="og:image"]', "content", image);
    }

    // Canonical URL
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;

    // Cleanup: restore default title on unmount
    return () => {
      document.title = "ApunBazar — Apun ki Dukaan, Assam ka Dil";
    };
  }, [title, description, image, type]);
}
