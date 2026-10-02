import { BadgeCheck } from "lucide-react";
import type { ReviewReply as ReviewReplyType } from "@/shared/types/review";
import { formatDate } from "@/shared/utils/format";

/** Resposta oficial exibida abaixo da avaliação. */
export const ReviewReply = ({ reply }: { reply: ReviewReplyType }) => (
  <section
    aria-label="Resposta da equipe ReviewStore"
    className="mt-4 rounded-xl border border-brand-300/40 bg-tint px-4 py-3.5 dark:border-brand-300/20"
  >
    <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
      <BadgeCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-700" />
      <span className="font-semibold text-brand-800">Resposta da equipe ReviewStore</span>
      <span className="text-xs text-ink-soft">
        {reply.authorName ? `${reply.authorName} · ` : ""}
        <time dateTime={reply.repliedAt}>{formatDate(reply.repliedAt)}</time>
      </span>
    </p>
    <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-relaxed text-ink-soft">{reply.text}</p>
  </section>
);
