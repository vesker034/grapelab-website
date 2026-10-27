// app/team/page.tsx (обновленный)

import TranslatedText from "@/components/TranslatedText";
import PageHero from "@/components/PageHero";
import { prisma } from "@/lib/prisma";
import Collaboration from "@/sections/CollaborationSection";
import TeamSection from "@/sections/TeamSection";
import TeamStats from "@/sections/TeamStats";
import type { JsonObject } from "@prisma/client/runtime/library";
import { getTranslations } from "next-intl/server";

export const revalidate = 0;

// Та же логика сортировки, что и в API
// Она нужна, чтобы правильно отсортировать первую порцию данных.
const ROLE_ORDER: string[] = [
  "Management",
  "DevOps",
  "Fullstack",
  "Backend",
  "Frontend",
  "UI/UX",
  "Gamedev",
];

const getSortPriority = (employee: {
  role?: string | null;
  id: number;
}): number => {
  if (!employee.role) return ROLE_ORDER.length;

  // Разбиваем все роли и находим минимальный (лучший) приоритет
  const roles = employee.role.split(",").map((r) => r.trim());
  const priorities = roles.map((role) => {
    const priority = ROLE_ORDER.indexOf(role);
    return priority === -1 ? ROLE_ORDER.length : priority;
  });

  // Возвращаем наименьший (лучший) приоритет
  return Math.min(...priorities);
};

export default async function Team() {
  const tTeamStats = await getTranslations("TeamStats");
  const stats = await prisma?.refTable.findFirst({ where: { name: "stats" } });

  // Получаем всех сотрудников только для сортировки и получения уникальных ролей
  const allVisibleMembers = await prisma?.employee.findMany({
    where: { isVisible: true },
    orderBy: { id: "asc" },
  });

  // Сортируем на сервере, чтобы первая порция данных была в правильном порядке
  allVisibleMembers.sort((a, b) => {
    const priorityA = getSortPriority(a);
    const priorityB = getSortPriority(b);
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    return a.id - b.id;
  });

  // Берем только первую страницу для начальной загрузки
  const initialTeamMembers = allVisibleMembers.slice(0, 8);
  const totalMembers = allVisibleMembers.length;

  // Собираем уникальные роли для фильтров
  const allRoles = allVisibleMembers.flatMap((member) =>
    member.role ? member.role.split(",").map((r) => r.trim()) : []
  );
  const uniqueRoles = [...new Set(allRoles)];

  const projects = await prisma?.project.count();

  if (stats && stats.content) {
    (stats.content as JsonObject).staffCount = totalMembers; // Используем общее число
    (stats.content as JsonObject).successfulProjects = projects;
  }

  return (
    <div className="pb-20 md:pb-28">
      <PageHero title={tTeamStats("title")} description={tTeamStats("intro")} />
      <TeamStats data={stats} hideTitle />
      <TeamSection
        initialData={initialTeamMembers}
        uniqueRolesForFilter={uniqueRoles}
        hasMoreInitial={totalMembers > 8}
        enableFilters={true}
        title={<TranslatedText namespace={"TeamSection"} keyText={"title"} />}
      />
      <Collaboration />
    </div>
  );
}
