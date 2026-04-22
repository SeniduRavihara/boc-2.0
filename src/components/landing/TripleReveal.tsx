"use client";

import type { ElementType, ReactNode } from "react";

type TripleRevealProps = {
  as?: ElementType;
  wrapperClassName?: string;
  textClassName?: string;
  children: ReactNode;
};

const joinClasses = (...classes: Array<string | undefined>) => {
  return classes.filter(Boolean).join(" ");
};

export default function TripleReveal({
  as: Tag = "p",
  wrapperClassName,
  textClassName,
  children,
}: TripleRevealProps) {
  return (
    <div className={joinClasses("js-triple-reveal", wrapperClassName)}>
      <Tag className={joinClasses("js-reveal-text", textClassName)}>{children}</Tag>
      <span className="js-reveal-white boc-reveal-mask-white" aria-hidden="true" />
      <span className="js-reveal-blue boc-reveal-mask-blue" aria-hidden="true" />
    </div>
  );
}
