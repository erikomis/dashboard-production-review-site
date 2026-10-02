import type { Review } from "@/shared/types/review";

export const makeReview = (overrides: Partial<Review> = {}): Review => ({
  id: 12,
  title: "Ótimo café",
  description: "Rápida e silenciosa, faz um espresso encorpado.",
  note: 5,
  productId: 3,
  userId: 7,
  createdAt: "2026-10-02T14:12:27Z",
  productName: "Cafeteira Express",
  productSlug: "cafeteira-express",
  userName: "Ana Souza",
  userUsername: "ana",
  helpfulCount: 2,
  helpfulByMe: false,
  status: "VISIBLE",
  moderationReason: null,
  moderatedAt: null,
  images: [],
  reply: null,
  reportedByMe: false,
  ...overrides,
});
