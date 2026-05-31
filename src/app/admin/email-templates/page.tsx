"use client";

import { useMemo } from "react";
import { FileText, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  FLYER_CAMPAIGN_SUBJECT,
  FLYER_EMAIL_FONT_FAMILY,
  getBaseTemplate,
  getFlyerCampaignTemplate,
  getLightTemplate,
} from "@/lib/email/templates";

type TemplatePreview = {
  id: string;
  title: string;
  subject: string;
  description: string;
  html: string;
};

export default function EmailTemplatesPage() {
  const baseUrl = "https://www.beautyofcloud.com";

  const templates = useMemo<TemplatePreview[]>(() => {
    const baseContent = `Dear Alex,\n\nThis is a quick update from the Beauty of Cloud 2.0 team.\nWe are finalizing the session schedule and will share the full lineup soon.\n\nBest regards,\nBOC Team`;

    const lightContent = `Dear Alex,\n\nThank you for your interest in partnering with Beauty of Cloud 2.0.\nWe would love to discuss collaboration opportunities and next steps.\n\nWarm regards,\nIndustry Relations Team`;

    const flyerContent = getFlyerCampaignTemplate(
      "Alex",
      "Team Nimbus",
      "https://www.beautyofcloud.com/flyer-generator?team=Team%20Nimbus&member=Alex"
    );

    return [
      {
        id: "base-dark",
        title: "Base Template (Dark)",
        subject: "Beauty of Cloud 2.0 Update",
        description: "Default branded template used for general announcements.",
        html: getBaseTemplate(baseContent, baseUrl),
      },
      {
        id: "light-signature",
        title: "Light Template + Signature",
        subject: "Industry Relations Outreach",
        description: "Light variant with committee member signature block.",
        html: getLightTemplate(lightContent, "Shanki Tharusha", baseUrl),
      },
      {
        id: "flyer-campaign",
        title: "Flyer Campaign",
        subject: FLYER_CAMPAIGN_SUBJECT,
        description: "Flyer generator invite with campaign typography.",
        html: getBaseTemplate(flyerContent, baseUrl, {
          fontFamily: FLYER_EMAIL_FONT_FAMILY,
        }),
      },
    ];
  }, []);

  return (
    <div className="flex flex-col gap-8 min-h-[800px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">
            Email <span className="text-blue-500">Template Lab</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Dev-only preview of transactional and campaign layouts.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-xl">
          <Sparkles size={14} />
          Preview Mode
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {templates.map((template) => (
          <GlassCard key={template.id} className="p-6 border-white/5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <FileText size={18} className="text-blue-400" />
                  {template.title}
                </div>
                <p className="text-xs text-slate-500 mt-1">{template.description}</p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                {template.subject}
              </span>
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden bg-[#020617]">
              <iframe
                title={`${template.title} preview`}
                srcDoc={template.html}
                className="w-full h-[520px]"
              />
            </div>

            <details className="text-xs text-slate-400">
              <summary className="cursor-pointer text-slate-500 hover:text-slate-300">
                View HTML
              </summary>
              <pre className="mt-3 p-4 rounded-xl bg-black/40 border border-white/5 overflow-auto text-[11px] leading-relaxed text-slate-300">
                {template.html}
              </pre>
            </details>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
