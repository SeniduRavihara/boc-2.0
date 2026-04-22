"use client";

import Image from "next/image";
import TripleReveal from "@/components/landing/TripleReveal";
import { CLOUD_QUESTION, CLOUD_SUPPORT_COPY } from "@/components/landing/content";

export default function CloudSection() {
  return (
    <section className="boc-section boc-cloud js-cloud-stage">
      <div className="boc-cloud-copy">
        <TripleReveal
          as="h2"
          wrapperClassName="boc-cloud-question-wrap"
          textClassName="boc-cloud-question"
        >
          {CLOUD_QUESTION}
        </TripleReveal>

        <TripleReveal
          wrapperClassName="boc-cloud-note-wrap"
          textClassName="boc-cloud-note"
        >
          {CLOUD_SUPPORT_COPY}
        </TripleReveal>
      </div>

      <div className="boc-cloud-frame">
        <Image
          src="/background_img.webp"
          alt="Man falling toward a cloud formation"
          fill
          priority
          className="js-cloud-image boc-cloud-image"
          sizes="100vw"
        />
        <div className="boc-cloud-scrim" />
      </div>
    </section>
  );
}
