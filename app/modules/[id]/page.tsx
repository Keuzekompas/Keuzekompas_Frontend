import { notFound } from "next/navigation";
import Link from "next/link";
import { getModuleById } from "@/lib/modules";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function parseTags(tagsString: string): string[] {
  try {
    const jsonish = tagsString.replaceAll("'", '"');
    const parsed = JSON.parse(jsonish);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return tagsString
      .replaceAll("[", "")
      .replaceAll("]", "")
      .replaceAll("'", "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const module = await getModuleById(id, { noStore: true });
  if (!module) notFound();

  const tagsNl = parseTags(module.module_tags_nl);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500">Module detail</p>
              <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {module.name_nl}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{module.name_en}</p>
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {module.studycredit} EC
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {module.level}
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                {module.available_spots} plekken
              </span>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <span className="font-medium text-gray-900">Locatie:</span>{" "}
            {module.location} •{" "}
            <span className="font-medium text-gray-900">Start:</span>{" "}
            {formatDate(module.start_date)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Beschrijving (NL)
            </h2>
            <p className="mt-2 leading-relaxed text-gray-700">
              {module.description_nl}
            </p>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tags</h2>

            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700">NL</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {tagsNl.length ? (
                  tagsNl.map((t, i) => (
                    <span
                      key={`nl-${i}-${t}`}
                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">Geen tags</span>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Overzicht</h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-gray-500">Locatie</dt>
                <dd className="text-right font-medium text-gray-900">
                  {module.location}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="text-gray-500">Startdatum</dt>
                <dd className="text-right font-medium text-gray-900">
                  {formatDate(module.start_date)}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="text-gray-500">EC</dt>
                <dd className="text-right font-medium text-gray-900">
                  {module.studycredit}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="text-gray-500">Beschikbare plekken</dt>
                <dd className="text-right font-medium text-gray-900">
                  {module.available_spots}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="text-gray-500">Niveau</dt>
                <dd className="text-right font-medium text-gray-900">
                  {module.level}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Acties</h2>

            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/modules"
                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Terug naar overzicht
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
