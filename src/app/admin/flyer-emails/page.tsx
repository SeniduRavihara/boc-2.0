"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  ImageIcon,
  Loader2,
  RefreshCw,
  Send,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase/config";
import {
  getFirstCompetitionRecipients,
  subscribeToFlyerSentEmails,
} from "@/firebase/api";
import { RESEND_MIN_INTERVAL_MS } from "@/lib/email/send-sequential";
import {
  sendFlyerBatch,
  type FlyerBatchSendResult,
} from "@/app/actions/flyer-campaign";
import type { FlyerEmailRecipient } from "@/types";

const BATCH_SIZE = 10;
const BATCH_COUNT = 10;

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
  const [recipients, setRecipients] = useState<FlyerEmailRecipient[]>([]);
  const [sentEmails, setSentEmails] = useState<string[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sendingBatch, setSendingBatch] = useState<number | null>(null);
  const [sendingBatchTotal, setSendingBatchTotal] = useState(0);
  const [batchErrors, setBatchErrors] = useState<Record<number, FlyerBatchSendResult[]>>({});
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const getIdToken = useCallback(async () => {
    if (!auth?.currentUser) throw new Error("Not signed in");
    return auth.currentUser.getIdToken();
  }, []);

  const loadRecipients = useCallback(async (): Promise<number> => {
    setLoadingRecipients(true);
    setFetchError(null);
    try {
      const list = await getFirstCompetitionRecipients(100);
      setRecipients(list);
      return list.length;
    } catch (err) {
      console.error("[flyer-emails] fetch recipients:", err);
      setFetchError(
        err instanceof Error ? err.message : "Failed to load recipients."
      );
      setRecipients([]);
      return 0;
    } finally {
      setLoadingRecipients(false);
    }
  }, []);

  useEffect(() => {
    if (!user || authLoading) return;
    loadRecipients();
  }, [user, authLoading, loadRecipients]);

  useEffect(() => {
    if (!user || authLoading) return;

    const unsubscribe = subscribeToFlyerSentEmails(
      (emails) => setSentEmails(emails),
      (err) => console.error("[flyer-emails] sent subscription:", err)
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  useEffect(() => {
    if (sendingBatch === null || sendingBatchTotal === 0) return;

    const batchRecipients = recipients.slice(
      sendingBatch * BATCH_SIZE,
      sendingBatch * BATCH_SIZE + BATCH_SIZE
    );
    const sentInBatch = batchRecipients.filter((r) =>
      isRecipientSent(r, sentEmails)
    ).length;

    setActionMessage(
      `Sending batch ${sendingBatch + 1}: ${sentInBatch} / ${sendingBatchTotal} sent…`
    );
  }, [sentEmails, sendingBatch, sendingBatchTotal, recipients]);

  const handleRefreshRecipients = async () => {
    setRefreshing(true);
    setActionMessage(null);
    const count = await loadRecipients();
    setActionMessage(
      `Loaded ${count} recipient${count === 1 ? "" : "s"} (first 100 by registration order).`
    );
    setRefreshing(false);
  };

  const handleSendBatch = async (batchIndex: number) => {
    const batchRecipients = recipients.slice(
      batchIndex * BATCH_SIZE,
      batchIndex * BATCH_SIZE + BATCH_SIZE
    );
    const pending = batchRecipients.filter(
      (r) => !isRecipientSent(r, sentEmails)
    );

    if (pending.length === 0) return;

    const estimatedSec = Math.ceil(
      (pending.length * RESEND_MIN_INTERVAL_MS) / 1000
    );
    const confirmed = window.confirm(
      `Send ${pending.length} flyer email(s) in batch ${batchIndex + 1}?\n\nThey will be sent one at a time (about ${estimatedSec} seconds total). Keep this tab open until finished.`
    );
    if (!confirmed) return;

    setSendingBatch(batchIndex);
    setSendingBatchTotal(pending.length);
    setActionMessage(
      `Sending batch ${batchIndex + 1}: 0 / ${pending.length}… (~${estimatedSec}s total)`
    );
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
      setSendingBatchTotal(0);
    }
  };

  const sentCount = recipients.filter((r) => isRecipientSent(r, sentEmails)).length;
  const progressPct =
    recipients.length > 0 ? Math.round((sentCount / recipients.length) * 100) : 0;

  const batches = Array.from({ length: BATCH_COUNT }, (_, i) => {
    const slice = recipients.slice(i * BATCH_SIZE, i * BATCH_SIZE + BATCH_SIZE);
    return { index: i, recipients: slice };
  });

  if (authLoading || loadingRecipients) {
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
            First 100 ideathon registrants (by signup order) · send in batches of 10
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefreshRecipients}
          disabled={refreshing}
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold border border-white/5 flex items-center gap-2 disabled:opacity-50"
        >
          {refreshing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Refresh list
        </button>
      </div>

      {fetchError && (
        <div className="px-4 py-3 rounded-xl bg-red-950/50 border border-red-500/30 text-sm text-red-300">
          {fetchError}
        </div>
      )}

      {actionMessage && (
        <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-slate-300">
          {actionMessage}
        </div>
      )}

      {recipients.length > 0 && (
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
                    Live from competition teams
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
                                    className="inline-flex flex-col items-start gap-0.5 max-w-[140px]"
                                    title={rowError.error}
                                  >
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                                      <AlertCircle size={10} /> Failed
                                    </span>
                                    {rowError.error && (
                                      <span className="text-[9px] text-red-400/80 line-clamp-2 leading-tight">
                                        {rowError.error}
                                      </span>
                                    )}
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
                        Sending batch… (~
                        {Math.ceil(
                          (pendingCount * RESEND_MIN_INTERVAL_MS) / 1000
                        )}
                        s)
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

      {!loadingRecipients && recipients.length === 0 && !fetchError && (
        <GlassCard className="p-8 text-center text-slate-400 text-sm">
          No competition registrants found. Teams will appear here after ideathon
          signup.
        </GlassCard>
      )}
    </div>
  );
}
