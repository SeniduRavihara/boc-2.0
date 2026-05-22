const DEFAULT_SITE_URL = "https://www.beautyofcloud.com";

export function getFlyerGeneratorUrl(teamName: string, memberName: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "");
  const url = new URL("/flyer-generator", base);
  url.searchParams.set("team", teamName);
  url.searchParams.set("member", memberName);
  return url.toString();
}
