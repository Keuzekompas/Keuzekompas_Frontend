import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '../../components/ui/card';

async function getModule(id: string) {
    const res = await fetch(`http://localhost:1000/api/modules/${id}`);
    const data = await res.json();
    return data;
}

export default async function Page({ params }: { params: { id: string } }) {
    const selectedModule = await getModule(params.id);

    if (!selectedModule) {
        return <div>Module not found</div>;
    }

    return (
        <div className="flex-grow flex flex-col items-center justify-center w-full p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Module Informatie</CardTitle>
                    <CardDescription>{selectedModule.name_nl}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                    <p className="font-bold">Beschrijving:</p>
                    <p>{selectedModule.description_nl}</p>
                    <div className="mt-4">
                        <p><span className="font-bold">Locatie:</span> {selectedModule.location}</p>
                        <p><span className="font-bold">EC&apos;s:</span> {selectedModule.studycredit}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
