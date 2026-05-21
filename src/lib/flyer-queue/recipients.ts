import type { FlyerEmailRecipient } from "@/types";

export interface CompetitionTeamRow {
  id: string;
  teamName?: string;
  leaderName?: string;
  leaderEmail?: string;
  members?: { name?: string; email?: string }[];
  createdAt?: { toDate?: () => Date } | null;
}

function toRegisteredAtIso(createdAt: CompetitionTeamRow["createdAt"]): string {
  if (createdAt && typeof createdAt.toDate === "function") {
    return createdAt.toDate().toISOString();
  }
  return "";
}

/** Flatten teams (leader first, then members) into unique recipients, earliest teams first. */
export function flattenCompetitionRecipients(
  teams: CompetitionTeamRow[],
  limitCount = 100
): FlyerEmailRecipient[] {
  const seen = new Set<string>();
  const recipients: FlyerEmailRecipient[] = [];

  for (const team of teams) {
    if (recipients.length >= limitCount) break;

    const teamName = team.teamName || "";
    const registeredAt = toRegisteredAtIso(team.createdAt);

    const addRecipient = (email: string | undefined, memberName: string) => {
      const normalized = email?.toLowerCase()?.trim();
      if (!normalized || seen.has(normalized) || recipients.length >= limitCount) {
        return;
      }
      seen.add(normalized);
      recipients.push({
        email: normalized,
        memberName: memberName || "",
        teamName,
        teamId: team.id,
        registeredAt,
      });
    };

    addRecipient(team.leaderEmail, team.leaderName || "");
    for (const member of team.members || []) {
      if (recipients.length >= limitCount) break;
      addRecipient(member.email, member.name || "");
    }
  }

  return recipients;
}
