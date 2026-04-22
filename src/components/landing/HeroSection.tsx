"use client";

import TripleReveal from "@/components/landing/TripleReveal";

export default function HeroSection() {
  return (
    <section className="boc-section boc-hero">
      <TripleReveal wrapperClassName="boc-kicker">COMING SOON</TripleReveal>

      <TripleReveal
        as="h1"
        wrapperClassName="boc-title-wrap"
        textClassName="boc-title"
      >
        Beauty Of Cloud
      </TripleReveal>

      <TripleReveal
        wrapperClassName="boc-subtitle-wrap"
        textClassName="boc-subtitle"
      >
        Sri Lanka&apos;s first Student-led cloud Ideathon. Second edition.
      </TripleReveal>
    </section>
  );
}
