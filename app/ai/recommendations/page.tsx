"use client";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useRecommendations } from "../../context/RecommendationContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import ModuleCard from "../../components/ModuleCard";
import Modal from "../../components/ui/Modal";
import InfoToggle from "../../components/ui/InfoToggle";

const RecommendationsPage = () => {
  const { t } = useTranslation();
  const {
    recommendations,
    loading,
    error,
    searchParams,
    fetchRecommendations,
    clearRecommendations,
  } = useRecommendations();
  const [showReason, setShowReason] = useState<string | null>(null);
  const router = useRouter();
  const { language } = useLanguage();
  const [currentReason, setCurrentReason] = useState<string>("");
  const [currentScore, setCurrentScore] = useState<number>(0);

  // Re-fetch when language changes if we have params
  useEffect(() => {
    if (!searchParams) return;

    const shouldRefetch =
      recommendations.length > 0 || (!loading && recommendations.length === 0);

    if (shouldRefetch) {
      fetchRecommendations({ ...searchParams, language });
    }
  }, [language]);
  // Only trigger on language change

  const handleBack = () => {
    clearRecommendations();
    router.push("/ai");
  };

  const handleShowReason = (reason: string, score: number) => {
    setCurrentReason(reason);
    setCurrentScore(score);
    setShowReason("open");
  };

  const handleCloseModal = () => {
    setShowReason(null);
    setCurrentReason("");
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8)
      return {
        label: t("ai.score.veryGood"),
        color: "bg-green-100 text-green-800",
      };
    if (score >= 0.6)
      return { label: t("ai.score.good"), color: "bg-green-50 text-green-700" };
    if (score >= 0.4)
      return {
        label: t("ai.score.okay"),
        color: "bg-yellow-100 text-yellow-800",
      };
    return { label: t("ai.score.bad"), color: "bg-gray-100 text-gray-800" };
  };

  if (loading) {
    return <div className="text-center mt-8">{t("ai.loading")}</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  const scoreInfo = getScoreLabel(currentScore);

  return (
    <div className="flex flex-col items-center grow w-full px-4 sm:px-0">
      <div className="w-full max-w-sm">
        <button
          onClick={handleBack}
          className="text-sm font-medium mb-4 flex items-center text-(--text-secondary) hover:text-(--color-brand) transition-colors"
        >
          &larr; <span className="ml-2">{t("ai.submitButton")}</span>
        </button>

        <InfoToggle 
          title={t("ai.recommendationsTitle")}
          subtitle={t("ai.recommendationsSubtitle")}
          description={t("ai.recommendationsHeaderDescription")}
        />
      </div>

      <div className="w-full max-w-sm mt-2">
        {recommendations.map((module) => (
          <div key={module.ID} className="mb-4">
            <ModuleCard
              _id={module.ID}
              name={module.Module_Name}
              description={module.Description}
              location={module.Details.location}
              studycredit={module.Details.ects}
              score={module.Score}
              showReasonButton={true}
              onReasonClick={() =>
                handleShowReason(module.AI_Reason, module.Score)
              }
            />
          </div>
        ))}
      </div>

      <Modal
        isOpen={showReason === "open"}
        onClose={handleCloseModal}
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 sm:gap-4">
            <span className="text-(--color-brand) font-bold text-lg">
              {t("ai.reasonTitle") || "AI Inzicht"}
            </span>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm self-start sm:self-auto ${scoreInfo.color} border border-black/5`}
            >
              <span className="w-2 h-2 rounded-full mr-2 animate-pulse bg-current opacity-70"></span>
              {scoreInfo.label}
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-(--text-primary) font-medium italic opacity-90">
            "
            {currentReason
              .replace(/^💡 AI-(Inzicht|Insight): /, "")
              .replaceAll("", "")}
            "
          </p>
          <div className="pt-4 border-t border-(--border-divider) text-sm text-(--text-secondary)">
            {t("ai.reasonExplanation") ||
              "Dit inzicht is gebaseerd op een match tussen jouw interesses, tags en de inhoud van deze module."}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecommendationsPage;
