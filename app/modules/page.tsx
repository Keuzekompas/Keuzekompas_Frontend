import ModuleFilter from "../components/ModuleFilter";
import { getModules } from "@/lib/modules";

const ModulesPage = async () => {
  const modules = await getModules();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Keuzemodules bij Avans</h2>
      <ModuleFilter modules={modules} />
    </div>
  );
};

export default ModulesPage;
