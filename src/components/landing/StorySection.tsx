"use client";

import TripleReveal from "@/components/landing/TripleReveal";
import { CONVERSATION_LINES, STORY_STICKY_COPY } from "@/components/landing/content";

export default function StorySection() {
  return (
    <section className="boc-section boc-story js-conversation-grid js-story-wrap">
      <aside className="boc-sticky-column">
        <TripleReveal
          wrapperClassName="boc-sticky-copy-wrap js-pin-copy"
          textClassName="boc-sticky-copy"
        >
          {STORY_STICKY_COPY}
        </TripleReveal>
      </aside>

      <div className="boc-panels">
        {CONVERSATION_LINES.map((line, index) => (
          <article key={line} className="boc-panel js-panel">
            <span className="boc-panel-index">0{index + 1}</span>
            <p>{line}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
