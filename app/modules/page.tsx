import ModuleFilter from "../components/ModuleFilter";
import ModulesHeader from "../components/ModulesHeader";
import { getModules } from "@/lib/modules";

const ModulesPage = async () => {
  const modules = await getModules();

  return (
    <div className="p-4">
      <ModulesHeader />
      <ModuleFilter modules={modules} />
    </div>
  );
};

export default ModulesPage;
