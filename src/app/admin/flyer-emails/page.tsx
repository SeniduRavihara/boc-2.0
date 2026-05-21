"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  Clock,
  ImageIcon,
  Loader2,
  RefreshCw,
  Send,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase/config";
import { subscribeToFlyerEmailQueue } from "@/firebase/api";
import {
  refreshFlyerQueue,
  sendFlyerBatch,
  type FlyerBatchSendResult,
} from "@/app/actions/flyer-campaign";
import type { FlyerEmailQueue, FlyerEmailRecipient } from "@/types";
import { getMsUntil8pmIST, isAfter8pmIST } from "@/lib/time/ist";

const BATCH_SIZE = 10;
const BATCH_COUNT = 10;

function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

function isRecipientSent(
  recipient: FlyerEmailRecipient,
  sentEmails: string[]
): boolean {
  const sentSet = new Set(sentEmails.map(normalizeEmail));
  return sentSet.has(normalizeEmail(recipient.email));
}

function batchIsFullySent(
  recipients: FlyerEmailRecipient[],
  sentEmails: string[]
): boolean {
  if (recipients.length === 0) return true;
  return recipients.every((r) => isRecipientSent(r, sentEmails));
}

export default function AdminFlyerEmailsPage() {
  const { user, loading: authLoading } = useAuth();
  const [queue, setQueue] = useState<FlyerEmailQueue | null>(null);
  const [queueLoading, setQueueLoading] = useState(true);
  const [countdownMs, setCountdownMs] = useState(getMsUntil8pmIST());
  const [after8pm, setAfter8pm] = useState(isAfter8pmIST());
  const [refreshing, setRefreshing] = useState(false);
  const [sendingBatch, setSendingBatch] = useState<number | null>(null);
  const [batchErrors, setBatchErrors] = useState<Record<number, FlyerBatchSendResult[]>>({});
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const autoRefreshDone = useRef(false);

  const getIdToken = useCallback(async () => {
    if (!auth?.currentUser) throw new Error("Not signed in");
    return auth.currentUser.getIdToken();
  }, []);

  useEffect(() => {
    if (!user || authLoading) {
      setQueueLoading(false);
      return;
    }

    setQueueLoading(true);
    const unsubscribe = subscribeToFlyerEmailQueue(
      (data) => {
        setQueue(data);
        setQueueLoading(false);
      },
      () => setQueueLoading(false)
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  useEffect(() => {
    const tick = () => {
      setCountdownMs(getMsUntil8pmIST());
      setAfter8pm(isAfter8pmIST());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!after8pm || autoRefreshDone.current || !user || authLoading) return;

    const runAutoRefresh = async () => {
      try {
        const token = await getIdToken();
        await refreshFlyerQueue(token, false);
        autoRefreshDone.current = true;
      } catch (err) {
        console.error("[flyer-emails] auto refresh failed:", err);
      }
    };

    runAutoRefresh();
  }, [after8pm, user, authLoading, getIdToken]);

  const handleRefreshQueue = async (force: boolean) => {
    setRefreshing(true);
    setActionMessage(null);
    try {
      const token = await getIdToken();
      const result = await refreshFlyerQueue(token, force);
      if (result.success) {
        setActionMessage(
          `Queue ready: ${result.recipientCount ?? 0} recipients (${result.status}).`
        );
      } else {
        setActionMessage(result.error ?? "Failed to refresh queue.");
      }
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Refresh failed.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSendBatch = async (batchIndex: number) => {
    const batchRecipients =
      queue?.recipients.slice(
        batchIndex * BATCH_SIZE,
        batchIndex * BATCH_SIZE + BATCH_SIZE
      ) ?? [];
    const pending = batchRecipients.filter(
      (r) => !isRecipientSent(r, queue?.sentEmails ?? [])
    );

    if (pending.length === 0) return;

    const confirmed = window.confirm(
      `Send flyer emails to ${pending.length} recipient(s) in batch ${batchIndex + 1}?`
    );
    if (!confirmed) return;

    setSendingBatch(batchIndex);
    setActionMessage(null);
    try {
      const token = await getIdToken();
      const result = await sendFlyerBatch(batchIndex, token);

      if (result.results?.length) {
        setBatchErrors((prev) => ({ ...prev, [batchIndex]: result.results! }));
      }

      if (result.success) {
        setActionMessage(
          `Batch ${batchIndex + 1}: sent ${result.sent ?? 0}, failed ${result.failed ?? 0}, skipped ${result.skipped ?? 0}.`
        );
      } else {
        setActionMessage(result.error ?? `Batch ${batchIndex + 1} send failed.`);
      }
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Send failed.");
    } finally {
      setSendingBatch(null);
    }
  };

  const sentEmails = queue?.sentEmails ?? [];
  const recipients = queue?.recipients ?? [];
  const sentCount = recipients.filter((r) => isRecipientSent(r, sentEmails)).length;
  const progressPct =
    recipients.length > 0 ? Math.round((sentCount / recipients.length) * 100) : 0;

  const batches = Array.from({ length: BATCH_COUNT }, (_, i) => {
    const slice = recipients.slice(i * BATCH_SIZE, i * BATCH_SIZE + BATCH_SIZE);
    return { index: i, recipients: slice };
  });

  if (authLoading || queueLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-slate-400 text-center py-20">
        Sign in as admin to manage flyer emails.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 min-h-[800px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">
            Flyer <span className="text-purple-500">Email Campaign</span>
          </h1>
          <p className="text-slate-400 text-sm">
            First 100 ideathon registrants · batches of 10 · 8:00 PM IST queue build
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!after8pm && (
            <button
              type="button"
              onClick={() => handleRefreshQueue(true)}
              disabled={refreshing}
              className="bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 px-4 py-2.5 rounded-xl text-sm font-bold border border-amber-500/30 flex items-center gap-2 disabled:opacity-50"
            >
              {refreshing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              Build queue now (test)
            </button>
          )}
          <button
            type="button"
            onClick={() => handleRefreshQueue(after8pm)}
            disabled={refreshing || (!after8pm && !queue)}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold border border-white/5 flex items-center gap-2 disabled:opacity-50"
          >
            {refreshing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            Refresh queue
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-slate-300">
          {actionMessage}
        </div>
      )}

      {!after8pm && !queue && (
        <GlassCard className="p-8 border-white/5">
          <div className="flex flex-col items-center text-center gap-4">
            <Clock className="w-12 h-12 text-purple-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Queue builds at 8:00 PM IST
            </h2>
            <p className="text-slate-400 max-w-md text-sm">
              The first 100 competition registrants will be fetched automatically when
              the clock hits 8 PM India time. You can send emails in batches of 10
              after that.
            </p>
            <div className="text-4xl font-mono font-black text-purple-400 tabular-nums">
              {formatCountdown(countdownMs)}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">
              Time until auto-build
            </p>
          </div>
        </GlassCard>
      )}

      {after8pm && !queue && (
        <GlassCard className="p-6 border-white/5 flex items-center gap-4">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400 shrink-0" />
          <p className="text-slate-400 text-sm">
            Building recipient queue… If this persists, use Refresh queue.
          </p>
        </GlassCard>
      )}

      {queue && recipients.length > 0 && (
        <>
          <GlassCard className="p-6 border-white/5">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <ImageIcon className="text-purple-400" size={24} />
                <div>
                  <p className="text-white font-bold">
                    {sentCount} / {recipients.length} emails sent
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">
                    Status: {queue.status}
                  </p>
                </div>
              </div>
              <span className="text-2xl font-black text-purple-400">{progressPct}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {batches.map(({ index, recipients: batchRecipients }) => {
              if (batchRecipients.length === 0) return null;

              const fullySent = batchIsFullySent(batchRecipients, sentEmails);
              const pendingCount = batchRecipients.filter(
                (r) => !isRecipientSent(r, sentEmails)
              ).length;
              const isSending = sendingBatch === index;
              const errors = batchErrors[index] ?? [];

              return (
                <GlassCard
                  key={index}
                  className="p-5 border-white/5 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                      Batch {index + 1}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      {pendingCount} pending
                    </span>
                  </div>

                  <div className="overflow-x-auto -mx-1">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-widest text-slate-600 border-b border-white/5">
                          <th className="pb-2 pr-2 font-bold">Member</th>
                          <th className="pb-2 pr-2 font-bold">Email</th>
                          <th className="pb-2 pr-2 font-bold">Team</th>
                          <th className="pb-2 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batchRecipients.map((r) => {
                          const sent = isRecipientSent(r, sentEmails);
                          const rowError = errors.find(
                            (e) => normalizeEmail(e.email) === normalizeEmail(r.email)
                          );
                          return (
                            <tr
                              key={r.email}
                              className="border-b border-white/[0.03] text-slate-300"
                            >
                              <td className="py-2 pr-2 font-medium text-white">
                                {r.memberName}
                              </td>
                              <td className="py-2 pr-2 text-xs text-slate-500 max-w-[140px] truncate">
                                {r.email}
                              </td>
                              <td className="py-2 pr-2 text-xs max-w-[100px] truncate">
                                {r.teamName}
                              </td>
                              <td className="py-2">
                                {sent ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                                    <Check size={10} /> Sent
                                  </span>
                                ) : rowError && !rowError.success ? (
                                  <span
                                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full"
                                    title={rowError.error}
                                  >
                                    <AlertCircle size={10} /> Failed
                                  </span>
                                ) : (
                                  <span className="inline-flex text-[10px] font-bold uppercase text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                                    Pending
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSendBatch(index)}
                    disabled={fullySent || isSending}
                    className="w-full mt-auto flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-purple-600 hover:bg-purple-500 text-white"
                  >
                    {isSending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending…
                      </>
                    ) : fullySent ? (
                      <>
                        <Check size={18} />
                        Batch {index + 1} complete
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send batch {index + 1} ({pendingCount} emails)
                      </>
                    )}
                  </button>
                </GlassCard>
              );
            })}
          </div>
        </>
      )}

      {queue && recipients.length === 0 && (
        <GlassCard className="p-8 text-center text-slate-400 text-sm">
          Queue is empty — no competition registrants found. Refresh after teams
          register.
        </GlassCard>
      )}
    </div>
  );
}
