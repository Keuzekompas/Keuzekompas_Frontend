import { notFound } from "next/navigation";

import { modules } from "../../data/modules";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId)) notFound();

  const selectedModule = modules[numericId];
  if (!selectedModule) notFound();

  return (
    <div className="flex-grow flex flex-col items-center justify-center w-full p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Module Informatie</CardTitle>
          <CardDescription>{selectedModule.title}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="w-full h-48 bg-gray-200 rounded-md mb-4" />
          <p className="font-bold">Beschrijving:</p>
          <p>{selectedModule.description}</p>

          <div className="mt-4">
            <p>
              <span className="font-bold">Locatie:</span>{" "}
              {selectedModule.location}
            </p>
            <p>
              <span className="font-bold">EC&apos;s:</span>{" "}
              {selectedModule.ects}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
