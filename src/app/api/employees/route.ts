import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ROLE_ORDER: string[] = [
    "Management",
    "DevOps",
    "Fullstack",
    "Backend",
    "Frontend",
    "UI/UX",
    "Gamedev",
];

export const dynamic = 'force-dynamic';

const queryIntWithDefault = (defaultValue: number, min: number, max: number) =>
  z.preprocess(
    (value) => value ?? undefined,
    z.coerce.number().int().min(min).max(max).default(defaultValue)
  );

const EmployeeQuerySchema = z.object({
  page: queryIntWithDefault(1, 1, 10000),
  role: z.enum([
    "Management", "DevOps", "Fullstack", "Backend", "Frontend", "UI/UX", "Gamedev",
  ]).optional(),
});

/**
 * Получает числовой приоритет для сотрудника на основе его ролей.
 * Если у сотрудника несколько ролей, берется наивысший приоритет (минимальное значение).
 * Меньшее значение означает более высокий приоритет.
 * @param employee - Объект сотрудника из Prisma.
 * @returns Числовой приоритет.
 */
const getSortPriority = (employee: { role: string | null }): number => {
    if (!employee.role) {
        return ROLE_ORDER.length; // Сотрудники без роли получают наименьший приоритет
    }

    // Разбиваем все роли и находим минимальный (лучший) приоритет
    const roles = employee.role.split(',').map(r => r.trim());
    const priorities = roles.map(role => {
        const priority = ROLE_ORDER.indexOf(role);
        return priority === -1 ? ROLE_ORDER.length : priority;
    });

    // Возвращаем наименьший (лучший) приоритет
    return Math.min(...priorities);
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const parsed = EmployeeQuerySchema.safeParse({
        page: searchParams.get('page'),
        role: searchParams.get('role') ?? undefined,
    });

    if (!parsed.success) {
        return NextResponse.json(
            { message: "Invalid query params", errors: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const { page, role } = parsed.data;
    const pageSize = 8;

    try {
        // Формируем условия для запроса в базу данных
        const whereClause: { isVisible: true; role?: { contains: string, mode?: 'insensitive' } } = {
            isVisible: true,
        };

        // role прошёл через z.enum — только допустимые значения из ROLE_ORDER
        if (role) {
            whereClause.role = {
                contains: role,
                mode: 'insensitive'
            };
        }

        // Получаем общее количество сотрудников, подходящих под фильтр
        // Это нужно, чтобы клиент знал, есть ли еще страницы для загрузки.
        const totalCount = await prisma.employee.count({ where: whereClause });

        // Получаем подходящих сотрудников для последующей сортировки в коде
        // получаем всех отфильтрованных сотрудников, а потом сортируем их на сервере.
        const employees = await prisma.employee.findMany({
            where: whereClause,
            orderBy: {
                id: 'asc', // Базовая сортировка для стабильности
            },
        });

        // Выполняем сортировку на сервере
        employees.sort((a, b) => {
            const priorityA = getSortPriority(a);
            const priorityB = getSortPriority(b);

            // Сначала сортируем по приоритету роли
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            // Если приоритеты ролей одинаковы, используем ID для стабильного порядка
            return a.id - b.id;
        });

        // Нарезаем нужную страницу из отсортированного массива
        const paginatedEmployees = employees.slice((page - 1) * pageSize, page * pageSize);

        // Отправляем клиенту готовые данные и мета-информацию для пагинации
        return NextResponse.json({
            data: paginatedEmployees,
            total: totalCount,
            hasMore: page * pageSize < totalCount, // Флаг, сообщающий клиенту, есть ли еще данные
        });

    } catch (error: unknown) {
        console.error('Failed to fetch employees:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
