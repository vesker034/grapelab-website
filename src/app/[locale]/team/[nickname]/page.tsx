import { prisma } from "@/lib/prisma";
import { normalizeImagePath } from "@/lib/pathutils";
import SlidingButton from "@/components/SlidingButton";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBrandName } from "@/config";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: { locale: string; nickname: string };
}): Promise<Metadata> {
  const locale = params.locale;
  const brandName = getBrandName(locale);
  const nickname = decodeURIComponent(params.nickname);

  const employee = await prisma.employee.findFirst({
    where: {
      nickname,
      isVisible: true,
    },
    select: {
      nickname: true,
    },
  });

  if (!employee) {
    return { title: brandName };
  }

  let pageTitle = employee.nickname;

  try {
    const [tFirstName, tLastName] = await Promise.all([
      getTranslations("employees_firstName"),
      getTranslations("employees_lastName"),
    ]);

    const firstName = tFirstName(employee.nickname).trim();
    const lastName = tLastName(employee.nickname).trim();

    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName.length > 0) {
      pageTitle = fullName;
    }
  } catch {
    // fallback to nickname
  }

  return {
    title: {
      absolute: `${pageTitle} | ${brandName}`,
    },
  };
}

function splitList(value?: string | null): string[] {
  if (!value) return [];

  return value
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function TeamMemberPage({
  params,
}: {
  params: { locale: string; nickname: string };
}) {
  const locale = params.locale;
  const nickname = decodeURIComponent(params.nickname);
  const isRTL = locale === "ar";

  const employee = await prisma.employee.findFirst({
    where: {
      nickname,
      isVisible: true,
    },
    include: {
      projects: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!employee) {
    notFound();
  }

  const [tFirstName, tLastName, tDescription, tTeam, tMemberPage] =
    await Promise.all([
      getTranslations("employees_firstName"),
      getTranslations("employees_lastName"),
      getTranslations("employees_siteDescription"),
      getTranslations("TeamSection"),
      getTranslations("TeamMemberPage"),
    ]);
  let tProjectName: Awaited<ReturnType<typeof getTranslations>> | null = null;
  try {
    tProjectName = await getTranslations("CasesSection_title");
  } catch {
    tProjectName = null;
  }

  const fullName = `${tFirstName(employee.nickname)} ${tLastName(
    employee.nickname
  )}`;
  const description = tDescription(employee.nickname);
  const roles =
    employee.role
      ?.split(",")
      .map((role) => role.trim())
      .filter(Boolean) ?? [];
  const roleLabels = roles.map((role) => (tTeam.has(role) ? tTeam(role) : role));
  const tags = splitList(employee.tags);
  const projects = employee.projects
    .map(({ project }) => project)
    .filter((project) => project.isVisible);

  return (
    <main className="container mx-auto px-4 py-12">
      <SlidingButton href="/team#team-section" revertArrow className="mb-8 ml-0">
        {tMemberPage("backToTeam")}
      </SlidingButton>

      <section className="mb-10 rounded-[8px] bg-gradient-to-b from-[#58427C] to-[#77C3DD] p-[1.5px] shadow-md">
        <div className="grid gap-8 rounded-[8px] bg-card-inner p-6 md:grid-cols-[280px_1fr] md:p-10">
          <div className="flex flex-col items-center gap-5">
            <div className="h-[220px] w-[220px] overflow-hidden rounded-full bg-gray-200 shadow-md">
              <Image
                src={normalizeImagePath(
                  employee.imagePath ?? undefined,
                  "/api/uploads/employees/defaultAvatar.png"
                )}
                alt={`${fullName} photo`}
                width={220}
                height={220}
                className="h-full w-full object-cover object-top"
                priority
              />
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold text-headings-draft">
                @{employee.nickname}
              </p>
              {employee.email && (
                <a
                  href={`mailto:${employee.email}`}
                  className="mt-2 block text-sm text-primary hover:underline"
                >
                  {employee.email}
                </a>
              )}
            </div>
          </div>

          <div className="relative flex flex-col items-start justify-center">
            <Image
              src="/grapelogo.svg"
              alt="GrapeLab"
              width={96}
              height={96}
              className={`logo-float-animation icon-dark-mode absolute top-1 hidden h-16 w-16 object-contain lg:block xl:h-20 xl:w-20 ${
                isRTL ? "left-0" : "right-0"
              }`}
            />

            <h1 className="-ml-[3px] text-3xl font-semibold text-primary md:text-5xl">
              {fullName}
            </h1>

            {roles.length > 0 && (
              <p className="mt-4 text-lg font-semibold text-headings-draft">
                {roleLabels.join(", ")}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <SlidingButton href="#member-projects" className="!ml-0">
                {tMemberPage("viewProjects")}
              </SlidingButton>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          <div className="rounded-[8px] bg-gradient-to-b from-[#58427C] to-[#77C3DD] p-[1.5px] shadow-md transition-transform duration-300 hover:scale-[1.01]">
            <div className="flex h-full flex-col rounded-[8px] bg-card-inner p-6 md:p-8">
              <h2 className="mb-4 text-xl font-semibold text-primary">
                {tMemberPage("aboutSpecialist")}
              </h2>
              <p className="text-base leading-7 text-textPrimary">
                {description}
              </p>
            </div>
          </div>

          {roles.length > 0 && (
            <div className="rounded-[8px] bg-gradient-to-b from-[#58427C] to-[#77C3DD] p-[1.5px] shadow-md transition-transform duration-300 hover:scale-[1.01]">
              <div className="flex h-full flex-col rounded-[8px] bg-card-inner p-6 md:p-8">
                <h2 className="mb-4 text-xl font-semibold text-primary">
                  {tMemberPage("roles")}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <span
                      key={role}
                      className="rounded-full bg-site px-3 py-1 text-sm font-semibold text-headings-draft"
                    >
                      {tTeam.has(role) ? tTeam(role) : role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tags.length > 0 && (
            <div className="rounded-[8px] bg-gradient-to-b from-[#58427C] to-[#77C3DD] p-[1.5px] shadow-md transition-transform duration-300 hover:scale-[1.01]">
              <div className="flex h-full flex-col rounded-[8px] bg-card-inner p-6 md:p-8">
                <h2 className="mb-4 text-xl font-semibold text-primary">
                  {tMemberPage("skills")}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-site px-3 py-1 text-sm font-medium text-headings-draft"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          id="member-projects"
          className="rounded-[8px] bg-gradient-to-b from-[#58427C] to-[#77C3DD] p-[1.5px] shadow-md"
        >
          <div className="rounded-[8px] bg-card-inner p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-primary">
                  {tMemberPage("projectsParticipation")}
                </h2>
              </div>
            </div>

            {projects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/portfolio/${project.id}`}
                    className="group rounded-[8px] bg-gradient-to-b from-[#58427C] to-[#77C3DD] p-[1.5px] transition hover:shadow-lg"
                  >
                    <div className="flex h-full flex-col gap-3 rounded-[8px] bg-card-inner p-4 md:gap-4 md:p-5">
                      <div className="min-w-0 md:flex md:items-center md:gap-4">
                        {project.imagePath && (
                          <div className="hidden h-14 w-14 shrink-0 items-center justify-center md:flex">
                            <Image
                              src={normalizeImagePath(project.imagePath)}
                              alt={project.rawName ?? `Project ${project.id}`}
                              width={56}
                              height={56}
                              className="icon-dark-mode object-contain"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-snug text-primary break-words md:text-base md:leading-normal md:break-normal">
                            {project.rawName
                              ? tProjectName?.has(project.rawName)
                                ? tProjectName(project.rawName)
                                : project.rawName
                              : `Проект #${project.id}`}
                          </p>
                        </div>
                      </div>
                      <span className="mt-auto text-xs font-semibold text-primary group-hover:underline md:text-sm">
                        {tMemberPage("details")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-[8px] bg-site p-6 text-sm leading-6 text-muted">
                {tMemberPage("noProjects")}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
