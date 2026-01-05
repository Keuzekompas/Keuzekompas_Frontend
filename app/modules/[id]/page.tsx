"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { getModuleById } from "@/lib/modules";
import type { ModuleResponse } from "@/app/types/module";

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

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [module, setModule] = useState<ModuleResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchModule = async () => {
      try {
        const response = await getModuleById(id);
        setModule(response?.data ?? null);
      } catch (error) {
        console.error("Failed to fetch module:", error);
        setModule(null);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  // id nog niet beschikbaar (heel kort moment) -> laadstatus
  if (!id || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Laden...</p>
      </div>
    );
  }

  if (!module) {
    return notFound();
  }

  const tagsNl = parseTags(module.module_tags_nl);

  return (
    <div className="min-h-screen bg-(--bg-page)">
      {/* Header */}
      <div className="border-b border-(--border-divider) bg-(--bg-card)">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-(--text-secondary)">Module detail</p>
              <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-(--text-primary) sm:text-3xl">
                {module.name_nl}
              </h1>
              <p className="mt-1 text-sm text-(--text-secondary)">
                {module.name_en}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              <span className="inline-flex items-center rounded-full bg-(--bg-input) px-3 py-1 text-sm font-medium text-(--text-primary)">
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

          <div className="mt-4 text-sm text-(--text-secondary)">
            <span className="font-medium text-(--text-primary)">Locatie:</span>{" "}
            {module.location} •{" "}
            <span className="font-medium text-(--text-primary)">Start:</span>{" "}
            {formatDate(module.start_date)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl bg-(--bg-card) p-5 shadow-sm ring-1 ring-(--border-divider)">
            <h2 className="text-lg font-semibold text-(--text-primary)">
              Beschrijving (NL)
            </h2>
            <p className="mt-2 leading-relaxed text-(--text-secondary)">
              {module.description_nl}
            </p>
          </section>

          <section className="rounded-2xl bg-(--bg-card) p-5 shadow-sm ring-1 ring-(--border-divider)">
            <h2 className="text-lg font-semibold text-(--text-primary)">
              Tags
            </h2>

            <div className="mt-3">
              <p className="text-sm font-medium text-(--text-secondary)">NL</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {tagsNl.length ? (
                  tagsNl.map((t, i) => (
                    <span
                      key={`nl-${i}-${t}`}
                      className="inline-flex items-center rounded-full bg-(--bg-input) px-3 py-1 text-sm text-(--text-secondary)"
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-(--text-secondary)">
                    Geen tags
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="rounded-2xl bg-(--bg-card) p-5 shadow-sm ring-1 ring-(--border-divider)">
            <h2 className="text-lg font-semibold text-(--text-primary)">
              Overzicht
            </h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-(--text-secondary)">Locatie</dt>
                <dd className="text-right font-medium text-(--text-primary)">
                  {module.location}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-(--text-secondary)">Startdatum</dt>
                <dd className="text-right font-medium text-(--text-primary)">
                  {formatDate(module.start_date)}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="text-(--text-secondary)">EC</dt>
                <dd className="text-right font-medium text-(--text-primary)">
                  {module.studycredit}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="text-(--text-secondary)">Beschikbare plekken</dt>
                <dd className="text-right font-medium text-(--text-primary)">
                  {module.available_spots}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="text-(--text-secondary)">Niveau</dt>
                <dd className="text-right font-medium text-(--text-primary)">
                  {module.level}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl bg-(--bg-card) p-5 shadow-sm ring-1 ring-(--border-divider)">
            <h2 className="text-lg font-semibold text-(--text-primary)">
              Acties
            </h2>

            <div className="mt-3 flex flex-col gap-2">
              <a
                href="https://osirisstudent.avans.nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Inschrijven
              </a>
              <Link
                href="/modules"
                className="inline-flex items-center justify-center rounded-xl bg-(--text-primary) px-4 py-2 text-sm font-semibold text-(--bg-card) hover:opacity-90"
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
