"use client";
import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import ModuleCard from '../../components/ModuleCard';
import { useRecommendations } from '../../context/RecommendationContext';
import { useRouter } from 'next/navigation';

const RecommendationsPage = () => {
  const { recommendations, loading, error } = useRecommendations();
  const [showReason, setShowReason] = useState<string | null>(null);
  const router = useRouter();

  const toggleReason = (id: string) => {
    setShowReason(prevId => (prevId === id ? null : id));
  };

  if (loading) {
    return <div className="text-center mt-8">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center grow w-full px-4 sm:px-0">
        <div className='w-full max-w-sm'>
            <button onClick={() => router.back()} className="text-lg font-semibold mb-4 flex items-center">
                &larr; <span className='ml-2'>Top Vijf Keuzemodules</span>
            </button>
        </div>
      <p className="text-center mb-4 max-w-sm">Hier komt een uitleg over het systeem en wat die waarom deze module knop doet</p>

      <div className="w-full max-w-sm">
        {recommendations.map((module) => (
          <div key={module.ID} className="mb-4">
            <ModuleCard 
                _id={module.ID}
                name={module.Module_Name}
                description={"Je leert veilig om te gaan met code"} // Example description, as it's not in the AI response
                location={module.Details.location}
                studycredit={module.Details.ects}
                showReasonButton={true}
                onReasonClick={() => toggleReason(module.ID)}
            />
            {showReason === module.ID && (
              <Card className="mt-2 bg-gray-100">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-700">{module.AI_Reason}</p>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPage;
