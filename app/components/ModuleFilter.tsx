"use client";
import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ModuleCard from "./ModuleCard";
import { ModuleListResponse } from "../types/moduleList";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../hooks/useDebounce";

export interface FilterState {
  search: string;
  location: string;
  studycredit: number;
}

interface ModuleFilterProps {
  modules: ModuleListResponse[];
  favoriteIds?: Set<string>;
  totalCount: number;
  onFilterChange: (filters: FilterState) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

// Moved FilterOptions outside the parent component
interface FilterOptionsProps {
  location: string;
  setLocation: (loc: string) => void;
  studycredit: number;
  setStudycredit: (credit: number) => void;
  t: (key: string) => string;
}

const FilterOptions = ({ location, setLocation, studycredit, setStudycredit, t }: FilterOptionsProps) => (
  <div className="flex flex-col gap-4 mb-8">
    <div>
      <label className="block text-sm font-medium text-(--text-secondary) mb-2">
        {t('moduleFilter.location')}
      </label>
      <div className="flex flex-wrap gap-2">
        {[
          { label: t('moduleFilter.none'), value: "None" },
          { label: t('moduleFilter.breda'), value: "Breda" },
          { label: t('moduleFilter.denBosch'), value: "Den Bosch" },
          { label: t('moduleFilter.tilburg'), value: "Tilburg" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setLocation(opt.value)}
            data-selected={location === opt.value}
            className="btn-tag rounded-lg"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-(--text-secondary) mb-2">
        {t('moduleFilter.ects')}
      </label>
      <div className="flex flex-wrap gap-2">
        {[
          { label: t('moduleFilter.all'), value: 0 },
          { label: "15", value: 15 },
          { label: "30", value: 30 },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStudycredit(opt.value)}
            data-selected={studycredit === opt.value}
            className="btn-tag rounded-lg"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const ModuleFilter = ({ modules, favoriteIds = new Set(), totalCount, onFilterChange, onLoadMore, hasMore }: ModuleFilterProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("None");
  const [studycredit, setStudycredit] = useState(0);
  const [isVisible, setIsVisible] = useState(false); // Controls mounting
  const [isOpen, setIsOpen] = useState(false); // Controls animation classes
  const observerTarget = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Handle drawer open
  const openDrawer = () => {
    setIsVisible(true);
    // Small delay to allow mount before starting animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsOpen(true));
    });
    document.body.style.overflow = 'hidden';
  };

  // Handle drawer close
  const closeDrawer = () => {
    setIsOpen(false);
    // Wait for animation to finish before unmounting
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
    }, 300);
  };

  // Handle filter changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    onFilterChange({
      search: debouncedSearchQuery,
      location,
      studycredit
    });
  }, [debouncedSearchQuery, location, studycredit, onFilterChange]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, onLoadMore]);

  return (
    <div>
      <div className="relative mb-4 flex gap-2">
        <div className="relative grow">
          <input
            type="text"
            placeholder={t('moduleFilter.searchPlaceholder')}
            className="w-full p-2 pl-10 border border-(--border-input) rounded-lg bg-(--bg-input) text-(--text-primary) placeholder-(--text-placeholder)"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="w-5 h-5 text-(--icon-color)" />
          </div>
        </div>
        <button 
          className="md:hidden btn btn-secondary px-3"
          onClick={openDrawer}
          aria-label="Open filters"
        >
          <AdjustmentsHorizontalIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <FilterOptions 
          location={location} 
          setLocation={setLocation} 
          studycredit={studycredit} 
          setStudycredit={setStudycredit} 
          t={t} 
        />
      </div>

      {/* Mobile Drawer */}
      {isVisible && (
        <div className="fixed inset-0 z-[60] flex justify-end md:hidden">
           {/* Backdrop */}
           <button 
             type="button"
             className={`absolute inset-0 w-full h-full bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out border-none p-0 cursor-default ${
               isOpen ? 'opacity-100' : 'opacity-0'
             }`} 
             onClick={closeDrawer}
             aria-label="Close filters"
           />
           
           {/* Drawer Panel */}
           <div 
             className={`relative w-full mt-auto bg-(--bg-card) rounded-t-3xl shadow-2xl transition-transform duration-300 ease-in-out p-6 pb-24 flex flex-col ${
               isOpen ? 'translate-y-0' : 'translate-y-full'
             }`}
           >
              <div className="w-12 h-1.5 bg-(--border-divider) rounded-full mx-auto mb-6 opacity-50 shrink-0" />
              
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-lg font-bold text-(--text-primary)">Filters</h3>
                <button 
                  onClick={closeDrawer}
                  className="p-1 hover:bg-(--bg-input) rounded-full text-(--text-secondary)"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <FilterOptions 
                location={location} 
                setLocation={setLocation} 
                studycredit={studycredit} 
                setStudycredit={setStudycredit} 
                t={t} 
              />
              
              <div className="mt-6">
                <button 
                  className="btn btn-primary w-full py-3"
                  onClick={closeDrawer}
                >
                  {t('moduleFilter.resultsFound', { count: totalCount })}
                </button>
              </div>
           </div>
        </div>
      )}

      <div className="mb-4 text-sm text-(--text-secondary) font-medium">
        {searchQuery !== "" || location !== "None" || studycredit !== 0 
          ? t('moduleFilter.resultsFound', { count: totalCount })
          : t('moduleFilter.totalCount', { count: totalCount })
        }
      </div>

      <div className="space-y-4">
        {modules.length > 0 ? (
          <>
            {modules.map((module) => (
              <ModuleCard key={module._id} {...module} initialIsFavorite={favoriteIds.has(module._id)} />
            ))}
            {hasMore && (
              <div ref={observerTarget} className="h-10 flex justify-center items-center">
                <span className="text-sm text-(--text-secondary)">Loading more...</span>
              </div>
            )}
          </>
        ) : (
            <div className="text-center text-(--text-secondary) mt-8">
              {t('moduleFilter.noModulesFound')}
            </div>
        )}
      </div>
    </div>
  );
};

export default ModuleFilter;