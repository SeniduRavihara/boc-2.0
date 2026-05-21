const DEFAULT_SITE_URL = "https://www.beautyofcloud.com";

export function getFlyerGeneratorUrl(teamName: string, memberName: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "");
  const url = new URL("/flyer-generator", base);
  url.searchParams.set("team", teamName);
  url.searchParams.set("member", memberName);
  return url.toString();
}

export function getFlyerEmailSubject(): string {
  return "Create your Beauty of Cloud 2.0 flyer";
}

/** Inner HTML passed to getBaseTemplate() in sendMail. */
export function getFlyerEmailHtml(
  memberName: string,
  teamName: string,
  flyerUrl: string
): string {
  const safeName = memberName || "Participant";
  const safeTeam = teamName || "your team";

  return `<p>Dear ${safeName},</p>

<p>Your team <strong>${safeTeam}</strong> is registered for Beauty of Cloud 2.0. Create and download your personalized event flyer using the link below — your team and name will already be selected when you open the generator.</p>

<p style="text-align: center; margin: 28px 0;">
  <a href="${flyerUrl}" style="display: inline-block; padding: 14px 28px; background: #2563eb; color: #ffffff !important; border-radius: 12px; font-weight: 700; text-decoration: none;">Open Flyer Generator</a>
</p>

<p style="font-size: 14px; color: #94a3b8;">Or copy this link:<br><a href="${flyerUrl}">${flyerUrl}</a></p>

<p>Best regards,<br>Beauty of Cloud 2.0 Organizing Committee</p>`;
}
