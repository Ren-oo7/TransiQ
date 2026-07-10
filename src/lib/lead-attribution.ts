import { standards } from "@/data/diagnostic-content";

type LeadAttributionInput = {
  entryPoint: string;
  channel?: string | null;
  standardKey?: string | null;
};

export function buildAttributedHref(
  pathname: string,
  params: {
    canal?: string;
    norma?: string;
  },
) {
  const searchParams = new URLSearchParams();

  if (params.canal) searchParams.set("canal", params.canal);
  if (params.norma) searchParams.set("norma", params.norma);

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function getStandardAttributionLabel(standardKey?: string | null) {
  if (!standardKey) return "";
  return standards[standardKey]?.short || standards[standardKey]?.label || standardKey;
}

export function buildLeadSource({ entryPoint, channel, standardKey }: LeadAttributionInput) {
  const parts = [entryPoint.trim()];
  const normalizedChannel = channel?.trim();
  const standardLabel = getStandardAttributionLabel(standardKey);

  if (normalizedChannel) parts.push(normalizedChannel);
  if (standardLabel) parts.push(standardLabel);

  return parts.filter(Boolean).join(" · ");
}
