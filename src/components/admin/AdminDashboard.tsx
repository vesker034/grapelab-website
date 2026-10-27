"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
type QuickLink = {
  id: string;
  label: string;
  href: string;
  description: string;
};

const ALL_TABLES: QuickLink[] = [
  { id: "Review",          label: "Отзывы",           href: "/admin/Review",          description: "Управление отзывами клиентов" },
  { id: "BlogPost",        label: "Блог",              href: "/admin/BlogPost",        description: "Статьи и публикации" },
  { id: "Project",         label: "Проекты",           href: "/admin/Project",         description: "Портфолио и кейсы" },
  { id: "Partner",         label: "Партнёры",          href: "/admin/Partner",         description: "Партнёрские организации" },
  { id: "DevDirection",    label: "Направления",       href: "/admin/DevDirection",    description: "Направления разработки" },
  { id: "Service",         label: "Услуги",            href: "/admin/Service",         description: "Услуги компании" },
  { id: "ServiceFeature",  label: "Функции услуг",     href: "/admin/ServiceFeature",  description: "Детали и функции услуг" },
  { id: "Employee",        label: "Сотрудники",        href: "/admin/Employee",        description: "Команда компании" },
  { id: "ProjectEmployee", label: "Команды проектов",  href: "/admin/ProjectEmployee", description: "Участники проектов" },
  { id: "User",            label: "Пользователи",      href: "/admin/User",            description: "Администраторы и сотрудники" },
  { id: "RefTable",        label: "Справочники",       href: "/admin/RefTable",        description: "JSON-справочники (contacts и др.)" },
];

const DEFAULT_IDS = ["Review", "BlogPost", "Project", "Employee", "ProjectEmployee"];
const STORAGE_KEY = "admin-dashboard-links";

export default function AdminDashboard() {
  const [activeIds, setActiveIds] = useState<string[]>(DEFAULT_IDS);
  const [editing, setEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setActiveIds(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (ids: string[]) => {
    setActiveIds(ids);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch {}
  };

  const toggle = (id: string) => {
    if (activeIds.includes(id)) {
      save(activeIds.filter((x) => x !== id));
    } else {
      save([...activeIds, id]);
    }
  };

  const activeLinks = ALL_TABLES.filter((t) => activeIds.includes(t.id));

  if (!mounted) return null;

  return (
    <div className="font-sans p-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Image
            src="/favicon.ico"
            alt="GrapeLab"
            width={96}
            height={96}
            className="w-24 h-24 object-contain rounded-lg"
          />
        </div>

        <button
          onClick={() => setEditing(!editing)}
          className={`px-5 py-2 rounded-lg text-sm font-semibold border-2 transition-all duration-200 cursor-pointer
            ${editing
              ? "bg-primary border-primary text-white"
              : "bg-white dark:bg-neutral-800 border-borderLight dark:border-neutral-600 text-primary dark:text-accent"
            }`}
        >
          {editing ? "Готово" : "Настроить"}
        </button>
      </div>

      {/* Edit mode — table selector */}
      {editing && (
        <div className="bg-[#f2f0f5] dark:bg-neutral-800 rounded-xl p-5 mb-8 border border-[#d5c9e8] dark:border-neutral-600">
          <p className="text-xs font-semibold text-textMuted dark:text-neutral-400 mb-3 uppercase tracking-widest">
            Выберите таблицы для отображения
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_TABLES.map((t) => {
              const active = activeIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggle(t.id)}
                  className={`px-4 py-1.5 rounded-full border-2 text-sm font-medium transition-all duration-150 cursor-pointer
                    ${active
                      ? "bg-primary border-primary text-white"
                      : "bg-white dark:bg-neutral-700 border-borderLight dark:border-neutral-500 text-textMuted dark:text-neutral-300"
                    }`}
                >
                  {active ? "− " : "+ "}{t.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick links grid */}
      {activeLinks.length === 0 ? (
        <div className="text-center py-12 text-textMuted dark:text-neutral-400 text-sm">
          Нет выбранных таблиц. Нажмите «Настроить», чтобы добавить.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {activeLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="relative block bg-white dark:bg-neutral-800 border border-[#efefef] dark:border-neutral-700 rounded-xl p-5 pt-6 shadow-sm dark:shadow-none hover:shadow-md dark:hover:border-primary transition-all duration-200 no-underline overflow-hidden"
            >
              {/* Accent bar */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-t-xl" />

              <div className="mt-1">
                <div className="font-bold text-base text-textPrimary dark:text-neutral-100 mb-1.5">
                  {link.label}
                </div>
                <div className="text-xs text-textMuted dark:text-neutral-400 leading-relaxed">
                  {link.description}
                </div>
              </div>

              <div className="mt-4 text-xs font-semibold text-primary dark:text-accent tracking-wide">
                Перейти →
              </div>

              {/* Remove button in edit mode */}
              {editing && (
                <button
                  onClick={(e) => { e.preventDefault(); toggle(link.id); }}
                  className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white border-none cursor-pointer text-xs font-bold flex items-center justify-center leading-none"
                >
                  ×
                </button>
              )}
            </a>
          ))}
        </div>
      )}

      {/* Stats footer */}
      <div className="mt-10 pt-6 border-t border-borderLight dark:border-neutral-700 flex gap-8 flex-wrap">
        <div>
          <div className="text-2xl font-bold text-primary">{activeLinks.length}</div>
          <div className="text-xs text-textMuted dark:text-neutral-400 mt-0.5">быстрых ссылок</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-accent">{ALL_TABLES.length}</div>
          <div className="text-xs text-textMuted dark:text-neutral-400 mt-0.5">таблиц всего</div>
        </div>
      </div>
    </div>
  );
}
