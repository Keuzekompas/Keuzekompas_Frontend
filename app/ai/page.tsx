"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useTranslation } from "react-i18next";
import { useRecommendations } from "../context/RecommendationContext";

const AiSupportPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { fetchRecommendations } = useRecommendations();
  const [interests, setInterests] = useState("");
  const [location, setLocation] = useState("Geen");
  const [ecs, setEcs] = useState("Geen");
  const [tags, setTags] = useState<string[]>([]);
  const [ecsError, setEcsError] = useState<string | null>(null);

  const allTags = [
    "Zorg", "Recht", "Techniek", "Dieren", "Kunst", "Brand", 
    "Educatie", "Welzijn", "Sport", "Welvaart", "Ontwikkeling", "Computer"
  ];

  const handleTagClick = (tag: string) => {
    setTags(prevTags => 
      prevTags.includes(tag) 
        ? prevTags.filter(t => t !== tag) 
        : [...prevTags, tag]
    );
  };

  const handleSubmit = async () => {
    setEcsError(null);
    let hasError = false;

    if (ecs === "Geen") {
      setEcsError("Selecteer alsjeblieft een geldig aantal EC's.");
      hasError = true;
    }

    if (hasError) return;

    await fetchRecommendations({ interests, location, ecs, tags });
    router.push('/ai/recommendations');
  };

  return (
    <div className="flex flex-col items-center grow w-full px-4 sm:px-0">
      <Card className="w-full max-w-sm bg-(--bg-card) mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-(--text-primary)">AI Ondersteuning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col w-full">
            <label htmlFor="interests" className="mb-2 text-(--text-primary)">Vul je interesses in:</label>
            <textarea
              id="interests"
              className="p-2 border rounded-lg outline-none bg-(--bg-input) text-(--text-primary) border-(--border-input) focus:border-(--color-brand) mb-4"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Mijn interesses zijn gamen, techniek en zorg"
            />

            <div className="flex justify-between mb-4">
              <div className="w-1/2 pr-2">
                <label htmlFor="location" className="mb-2 text-(--text-primary)">Locatie voorkeur:</label>
                <select
                  id="location"
                  className="p-2 border rounded-lg outline-none w-full bg-(--bg-input) text-(--text-primary) border-(--border-input) focus:border-(--color-brand)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option>Geen</option>
                  <option>Breda</option>
                  <option>Den Bosch</option>
                </select>
              </div>
              <div className="w-1/2 pl-2">
                <label htmlFor="ecs" className="mb-2 text-(--text-primary)">Hoeveel EC's:</label>
                <select
                  id="ecs"
                  className={`p-2 border rounded-lg outline-none w-full bg-(--bg-input) text-(--text-primary) ${
                    ecsError 
                      ? "border-(--color-error) focus:border-red-700 mb-1" 
                      : "border-(--border-input) focus:border-(--color-brand) mb-4"
                  }`}
                  value={ecs}
                  onChange={(e) => {
                    setEcs(e.target.value);
                    if (ecsError) setEcsError(null);
                  }}
                >
                  <option>Geen</option>
                  <option>15</option>
                  <option>30</option>
                </select>
                {ecsError && <p className="text-(--color-error) text-sm mb-3">{ecsError}</p>}
              </div>
            </div>

            <label className="mb-2 text-(--text-primary)">Selecteer tags die bij jouw interesses passen</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`p-2 rounded-lg transition-colors ${
                    tags.includes(tag) 
                      ? 'bg-(--color-brand) text-white' 
                      : 'bg-(--bg-input) text-(--text-primary) border border-(--border-input)'
                  }`}
                >
                  {tags.includes(tag) ? `✓ ${tag}` : tag}
                </button>
              ))}
            </div>

            <button 
              onClick={handleSubmit} 
              className="p-2 bg-(--color-brand) text-white rounded-lg hover:bg-(--color-brand-hover) transition-colors mt-2"
            >
              Maak top 5
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiSupportPage;

