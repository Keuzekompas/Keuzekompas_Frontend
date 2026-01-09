"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
} from "../components/ui/card";
import { useTranslation } from "react-i18next";
import { useRecommendations } from "../context/RecommendationContext";
import { useLanguage } from "../context/LanguageContext";
import InfoToggle from "../components/ui/InfoToggle";

// Define Mapping: Category -> [Boost Tags]
const CATEGORY_MAPPING: Record<string, Record<string, string[]>> = {
  NL: {
    Techniek: ["Innovatie", "Constructie", "Systeem", "Engineering"],
    Zorg: ["Mensen", "Gezondheid", "Hulp", "Verpleging"],
    Recht: ["Wetten", "Regels", "Maatschappij", "Justitie"],
    Kunst: ["Creatief", "Design", "Expressie", "Cultuur"],
    Dieren: ["Natuur", "Biologie", "Verzorging", "Fauna"],
    Educatie: ["Onderwijs", "Leren", "Ontwikkeling", "Didactiek"],
    Welzijn: ["Geluk", "Mentaal", "Balans", "Psychologie"],
    Sport: ["Beweging", "Fysiek", "Training", "Gezondheid"],
    Computer: ["Software", "Data", "AI", "Programmeren"],
    Branding: ["Marketing", "Communicatie", "Media", "Strategie"],
  },
  EN: {
    Technology: ["Innovation", "Construction", "System", "Engineering"],
    Healthcare: ["People", "Health", "Help", "Nursing"],
    Law: ["Laws", "Rules", "Society", "Justice"],
    Art: ["Creative", "Design", "Expression", "Culture"],
    Animals: ["Nature", "Biology", "Care", "Fauna"],
    Education: ["Teaching", "Learning", "Development", "Didactics"],
    "Well-being": ["Happiness", "Mental", "Balance", "Psychology"],
    Sports: ["Movement", "Physical", "Training", "Health"],
    IT: ["Software", "Data", "AI", "Programming"],
    Branding: ["Marketing", "Communication", "Media", "Strategy"],
  },
};

const CATEGORY_KEYS = {
  NL: Object.keys(CATEGORY_MAPPING.NL),
  EN: Object.keys(CATEGORY_MAPPING.EN),
};

// Helper Component for Radio Groups
interface RadioGroupProps {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

const RadioGroup = ({ label, options, value, onChange, error }: RadioGroupProps) => (
  <div>
    <label className="block text-(--text-primary) font-medium mb-2">
      {label}
    </label>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          data-selected={value === opt.value}
          className={`btn-tag rounded-lg ${
            error && value === "Geen" ? "border-(--color-error)" : ""
          }`}
          type="button" // Ensure it doesn't submit forms if inside one
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const AiSupportPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const router = useRouter();
  const { fetchRecommendations, recommendations } = useRecommendations();
  const [interests, setInterests] = useState("");
  const [location, setLocation] = useState("Geen");
  const [ecs, setEcs] = useState("Geen");
  const [tags, setTags] = useState<string[]>([]);

  // Available tags are now the Categories
  const [availableTags, setAvailableTags] = useState<string[]>(
    CATEGORY_KEYS[language === "NL" ? "NL" : "EN"]
  );

  const [ecsError, setEcsError] = useState<string | null>(null);
  const [interestsError, setInterestsError] = useState<string | null>(null);
  const [tagsError, setTagsError] = useState<string | null>(null);

  // Redirect if results exist in cookie (context loads them)
  useEffect(() => {
    if (recommendations.length > 0) {
      router.push("/ai/recommendations");
    }
  }, [recommendations, router]);

  // Update tags when language changes
  useEffect(() => {
    const isNL = language === "NL";
    const newKeys = CATEGORY_KEYS[isNL ? "NL" : "EN"];
    setAvailableTags(newKeys);

    // Map selected tags to new language
    setTags((prevTags) => {
      const oldLang = isNL ? "EN" : "NL";
      const oldList = CATEGORY_KEYS[oldLang];
      const newList = newKeys;

      const translationMap = new Map(
        oldList.map((key, index) => [key, newList[index]])
      );

      return prevTags
        .map((tag) => translationMap.get(tag) ?? tag)
        .filter((tag) => newList.includes(tag));
    });
  }, [language]);

  const handleTagClick = (tag: string) => {
    setTagsError(null);
    setTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        if (prevTags.length >= 3) return prevTags; // Max 3
        return [...prevTags, tag];
      }
    });
  };

  const sanitizeInput = (input: string) => {
    // Basic sanitization: strip HTML tags and potential script injections
    let sanitized = input.replaceAll(/<[^>]*>?/gm, "");
    sanitized = sanitized.replaceAll(/javascript:/gi, "");
    // Trim and limit length (e.g. max 500 chars for interests)
    return sanitized.trim().slice(0, 500);
  };

  const handleSubmit = async () => {
    setEcsError(null);
    setInterestsError(null);
    setTagsError(null);
    let hasError = false;

    // Validate & Sanitize Interests
    const sanitizedInterests = sanitizeInput(interests);

    // Also sanitize other string inputs just in case
    const sanitizedLocation = sanitizeInput(location);

    if (!sanitizedInterests) {
      setInterestsError(
        t("ai.validation.interestsRequired") ||
          "Vul alstublieft uw interesses in."
      );
      hasError = true;
    } else if (sanitizedInterests.length < 10) {
      setInterestsError(
        t("ai.validation.interestsTooShort") ||
          "De beschrijving moet minimaal 10 tekens bevatten."
      );
      hasError = true;
    }

    // Validate ECTS
    if (ecs === "Geen") {
      setEcsError(
        t("ai.validation.ectsRequired") ||
          "Selecteer alsjeblieft een geldig aantal EC's."
      );
      hasError = true;
    }

    // Validate Tags
    if (tags.length === 0) {
      setTagsError(
        t("ai.validation.tagsRequired") || "Selecteer minimaal 1 tag."
      );
      hasError = true;
    }

    if (hasError) return;

    // Expand Tags with Boost logic
    const mapping = CATEGORY_MAPPING[language] || CATEGORY_MAPPING.NL;
    let expandedTags = [...tags];

    tags.forEach((tag) => {
      const boostTags = mapping[tag];
      if (boostTags) {
        expandedTags = [...expandedTags, ...boostTags];
      }
    });

    await fetchRecommendations({
      interests: sanitizedInterests,
      location: sanitizedLocation,
      ecs,
      tags: expandedTags,
      language,
    });
    router.push("/ai/recommendations");
  };

  return (
    <div className="flex flex-col items-center grow w-full px-4 sm:px-0 min-h-[700px]">
      <Card className="w-full max-w-lg bg-(--bg-card) mt-8 transition-all duration-300">
        <CardHeader>
          <InfoToggle 
            title={t("ai.title")} 
            subtitle={t("ai.subtitle")}
            description={t("ai.headerDescription")} 
          />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col w-full">
            <label
              htmlFor="interests"
              className="mb-2 text-(--text-primary) font-medium"
            >
              {t("ai.interestsLabel")}*
            </label>
            <textarea
              id="interests"
              className={`p-3 border rounded-lg outline-none bg-(--bg-input) text-(--text-primary) h-48 resize-none transition-colors ${
                interestsError
                  ? "border-(--color-error)"
                  : "border-(--border-input) focus:border-(--color-brand)"
              }`}
              value={interests}
              onChange={(e) => {
                setInterests(e.target.value);
                if (interestsError) setInterestsError(null);
              }}
              placeholder={t("ai.interestsPlaceholder")}
            />
            {/* Fixed height container for error to prevent jump */}
            <div className="min-h-6 mt-1 mb-2">
              {interestsError && (
                <p className="text-(--color-error) text-sm animate-in fade-in slide-in-from-top-1">
                  {interestsError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4 mb-4">
              <RadioGroup
                label={t("ai.locationLabel")}
                value={location}
                onChange={setLocation}
                options={[
                  { label: t("ai.options.none-location"), value: "Geen" },
                  { label: t("ai.options.breda"), value: "Breda" },
                  { label: t("ai.options.den_bosch"), value: "Den Bosch" },
                  { label: t("ai.options.tilburg"), value: "Tilburg" },
                ]}
              />

              <RadioGroup
                label={t("ai.ectsLabel") + "*"}
                value={ecs}
                onChange={(val) => {
                  setEcs(val);
                  if (ecsError) setEcsError(null);
                }}
                error={!!ecsError}
                options={[
                  { label: t("ai.options.none-ec"), value: "Geen" },
                  { label: t("ai.options.15"), value: "15" },
                  { label: t("ai.options.30"), value: "30" },
                ]}
              />
            </div>

            {/* Fixed height container for ECTS error */}
            <div className="min-h-6 mb-2">
              {ecsError && (
                <p className="text-(--color-error) text-sm animate-in fade-in slide-in-from-top-1">
                  {ecsError}
                </p>
              )}
            </div>

            <label className="mb-2 text-(--text-primary) font-medium">
              {t("ai.tagsLabel")}* (Min 1, Max 3)
            </label>
            <div
              className={`grid grid-cols-2 gap-2 mb-2 p-2 rounded-lg border ${
                tagsError ? "border-(--color-error)" : "border-transparent"
              }`}
            >
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  data-selected={tags.includes(tag)}
                  className={`btn-tag rounded-lg ${
                    !tags.includes(tag) && tags.length >= 3
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {tags.includes(tag) ? `✓ ${tag}` : tag}
                </button>
              ))}
            </div>
            {/* Fixed height container for Tags error */}
            <div className="min-h-6 mb-2">
              {tagsError && (
                <p className="text-(--color-error) text-sm animate-in fade-in slide-in-from-top-1">
                  {tagsError}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="btn btn-primary w-full mt-2"
            >
              {t("ai.submitButton")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiSupportPage;
