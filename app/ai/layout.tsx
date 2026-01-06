"use client";
import { RecommendationProvider } from "../context/RecommendationContext";

export default function AiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RecommendationProvider>{children}</RecommendationProvider>;
}
