"use client";

import { useState, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SlidingButton from "@/components/SlidingButton";
import { Employee } from "@prisma/client";
import { normalizeImagePath } from "@/lib/pathutils";
import { useTranslations } from "@/lib/localize";
import clsx from "clsx";

/**
 * @interface TeamSectionProps
 * @description Определяет свойства (props), которые компонент ожидает получить от родителя.
 */
interface TeamSectionProps {
  // Начальный массив сотрудников, отрендеренный на сервере для быстрой первой загрузки.
  initialData?: Employee[];
  // Массив уникальных ролей для создания кнопок-фильтров.
  uniqueRolesForFilter?: string[];
  // Флаг, указывающий, есть ли еще страницы с сотрудниками после первой.
  hasMoreInitial?: boolean;
  enableFilters?: boolean;
  title: ReactNode;
  className?: string;
}

/**
 * @component TeamSection
 * @description "Умный" клиентский компонент для отображения команды с фильтрацией и динамической подгрузкой.
 */
export default function TeamSection({
  initialData = [],
  uniqueRolesForFilter = [],
  hasMoreInitial = false,
  enableFilters = false,
  title,
  className,
}: TeamSectionProps) {
    // Инициализируем хук для локализации (перевода) строк.
    const t = useTranslations("TeamSection");
    const tFirstName = useTranslations("employees_firstName");
    const tLastName = useTranslations("employees_lastName");
    const tDescription = useTranslations("employees_siteDescription");

    // --- УПРАВЛЕНИЕ СОСТОЯНИЕМ КОМПОНЕНТА ---

    // Хранит массив сотрудников, которые в данный момент отображаются на странице.
    // Начальное значение берется из props, переданных сервером.
    const [employees, setEmployees] = useState<Employee[]>(initialData);

    // Хранит номер текущей страницы для пагинации. Начинается с 1.
    const [page, setPage] = useState(1);

    // Хранит ключ текущего активного фильтра (например, 'Backend' или 'allCategories').
    const [selectedFilter, setSelectedFilter] = useState<string>('allCategories');

    // Флаг (true/false), который определяет, есть ли еще данные для загрузки на сервере.
    // Используется для отображения или скрытия кнопки "Показать еще".
    const [hasMore, setHasMore] = useState(hasMoreInitial);

    // Флаг (true/false), который активен во время запроса данных с сервера.
    // Используется для отображения индикатора загрузки и блокировки повторных запросов.
    const [isLoading, setIsLoading] = useState(false);

    // --- ЛОГИКА КОМПОНЕНТА ---

    // Создаем полный массив фильтров, добавляя "Все категории" к уникальным ролям из props.
    // Используем непереведенные ключи ролей для логики.
    const filters = ['allCategories', ...uniqueRolesForFilter];
    const translateRole = (role: string) => (t.has(role) ? t(role) : role);

    /**
     * @function fetchEmployees
     * @description Асинхронная функция для запроса данных о сотрудниках c API.
     * @param {number} newPage - Номер страницы, которую нужно загрузить.
     * @param {string} filter - Активный фильтр (ключ роли), который нужно применить.
     */
    const fetchEmployees = async (newPage: number, filter: string) => {
        // Устанавливаем флаг загрузки в true, чтобы показать пользователю индикатор.
        setIsLoading(true);

        // Формируем строку запроса для API. Если фильтр не 'allCategories', добавляем параметр 'role'.
        const roleQuery = filter !== 'allCategories' ? `&role=${filter}` : '';

        try {
            // Выполняем GET-запрос к нашему API-маршруту.
            const response = await fetch(`/api/employees?page=${newPage}${roleQuery}`);
            // Парсим JSON-ответ от сервера.
            const { data, hasMore: newHasMore } = await response.json();

            // Обновляем состояние на основе полученных данных.
            if (newPage === 1) {
                // Если это первая страница (например, после смены фильтра), полностью заменяем массив сотрудников.
                setEmployees(data);
            } else {
                // Если это следующая страница, добавляем новых сотрудников к существующему списку.
                setEmployees(prevEmployees => [...prevEmployees, ...data]);
            }

            // Обновляем флаг наличия следующих страниц.
            setHasMore(newHasMore);
            // Обновляем номер текущей страницы.
            setPage(newPage);

        } catch (error) {
            // В случае ошибки выводим ее в консоль.
            console.error("Failed to fetch employees:", error);
            // Здесь можно добавить логику для отображения ошибки пользователю.
        } finally {
            // Этот блок выполняется всегда, и после успеха, и после ошибки.
            // Сбрасываем флаг загрузки, чтобы скрыть индикатор и разблокировать кнопки.
            setIsLoading(false);
        }
    };

    /**
     * @function handleFilterChange
     * @description Обработчик клика по кнопке фильтра.
     * @param {string} filterKey - Ключ роли, по которой нужно фильтровать.
     */
    const handleFilterChange = (filterKey: string) => {
        // Обновляем состояние активного фильтра.
        setSelectedFilter(filterKey);
        // Немедленно очищаем список сотрудников для лучшего визуального отклика.
        setEmployees([]);
        // Запускаем загрузку данных для первой страницы нового фильтра.
        fetchEmployees(1, filterKey);
    };

    /**
     * @function handleShowMore
     * @description Обработчик клика по кнопке "Показать еще".
     */
    const handleShowMore = () => {
        // Запускаем загрузку только если сейчас не идет другая загрузка и есть что загружать.
        if (!isLoading && hasMore) {
            fetchEmployees(page + 1, selectedFilter);
        }
    };

    return (
      <section id='team-section' className='container mx-auto px-4 py-12'>
        <div className={clsx(className ? className : "mx-auto max-w-[1200px]")}>
          <h2 className='text-3xl font-semibold mb-12 text-primary'>
            {title}
          </h2>

          {/* Блок с кнопками-фильтрами */}
          {enableFilters && (
            <div className='flex flex-wrap gap-3 mb-10'>
              {filters.map((roleKey: string) => {
                // Получаем переведенное название роли для отображения.
                const label = translateRole(roleKey);
                // Определяем, активна ли текущая кнопка.
                const isActive = selectedFilter === roleKey;
                return (
                  <div
                    key={roleKey}
                    className='rounded-full p-[2px] bg-gradient-to-b from-[#58427C] to-[#77C3DD]'
                  >
                    <button
                      // При клике вызываем обработчик смены фильтра.
                      onClick={() => handleFilterChange(roleKey)}
                      // Динамически меняем классы для стилизации активного/неактивного состояния.
                      className={`px-5 py-2 text-sm rounded-full font-medium transition duration-200 ${
                        isActive
                          ? 'bg-[#58427C] text-white'
                          : 'bg-card-inner text-headings-draft hover:opacity-80'
                      }`}
                    >
                      {label}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Сетка для отображения карточек сотрудников */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {employees.map((member, index) => (
              <motion.div
                // Используем member.id как уникальный и стабильный ключ для React.
                key={member.id}
                className='w-full flex justify-center'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                // Задержка анимации рассчитывается так, чтобы она повторялась для каждой новой "порции" карточек.
                transition={{ duration: 0.5, delay: (index % 8) * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href={`/team/${encodeURIComponent(member.nickname)}`}
                  className='w-full max-w-[368px] h-[398px] bg-gradient-to-b from-[#58427C] to-[#77C3DD] p-[1.5px] rounded-xl shadow-md hover:shadow-xl transition-shadow'
                >
                  <div className='w-full h-full bg-card-inner rounded-xl p-6 flex flex-col justify-start'>
                    <div className='flex items-center gap-4 mb-4'>
                      <div className='w-[100px] h-[100px] rounded-full overflow-hidden shrink-0'>
                        <Image
                          src={normalizeImagePath(
                            member?.imagePath as string | undefined,
                            '/api/uploads/employees/defaultAvatar.png'
                          )}
                          alt={`${tFirstName(member.nickname)} ${tLastName(member.nickname)} photo`}
                          width={100}
                          height={100}
                          className='h-full w-full object-cover object-top'
                        />
                      </div>
                      <div>
                        <h3 className='text-lg font-bold text-primary'>
                          {tFirstName(member.nickname)}{' '}
                          {tLastName(member.nickname)}
                        </h3>
                        <p className='text-sm text-headings-draft font-semibold'>
                          {member.role
                            ?.split(',')
                            .map((r) => translateRole(r.trim()))
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className='text-sm text-muted mb-4 leading-relaxed'>
                      {tDescription(member.nickname)}
                    </div>
                    <div className='mt-auto pt-2 text-xs text-headings-draft font-medium flex flex-wrap gap-2'>
                      {member.nickname ? <span>@{member.nickname}</span> : ''}
                      {member.tags?.split(' ').map((tag, i) => (
                        <span key={i}>{tag}</span>
                      )) ?? null}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Условный рендеринг индикатора загрузки */}
          {isLoading && (
            <p className='text-center mt-12 font-semibold text-headings-draft'>
              Загрузка...
            </p>
          )}

          {/* Условный рендеринг кнопки "Показать еще" */}
          {/* Кнопка показывается только если есть еще данные (hasMore) и не идет загрузка (isLoading). */}
          {hasMore && !isLoading && (
            <div className='flex justify-center mt-12'>
              <SlidingButton
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  handleShowMore();
                }}
              >
                {t('button_more')}
              </SlidingButton>
            </div>
          )}
        </div>
      </section>
    );
}
