"use client";

import { useTranslation } from "react-i18next";
import InfoToggle from "./ui/InfoToggle";

export default function ModulesHeader() {
  const { t } = useTranslation();

  return (
    <InfoToggle 
      title={t('modulesHeader.title')} 
      subtitle={t('modulesHeader.subtitle')}
      description={t('modulesHeader.description')} 
    />
  );
}