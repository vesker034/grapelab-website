import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as readline from "readline";

const prisma = new PrismaClient();

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function promptSilent(question: string): Promise<string> {
  return new Promise((resolve) => {
    // Убеждаемся что stdin в нужном состоянии
    if (process.stdin.isPaused()) {
      process.stdin.resume();
    }

    process.stdout.write(question);

    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf8");

    let input = "";

    const redraw = () => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(question + "*".repeat(input.length));
    };

    function handler(char: string) {
      // Enter
      if (char === "\r" || char === "\n" || char === "\u0004") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener("data", handler);
        process.stdout.write("\n");
        resolve(input);
      }
      // Ctrl+C
      else if (char === "\u0003") {
        process.stdout.write("\n");
        process.exit();
      }
      // Backspace: \u007f (macOS/Linux) или \b (Windows)
      else if (char === "\u007f" || char === "\b") {
        if (input.length > 0) {
          input = input.slice(0, -1);
          redraw();
        }
      }
      // Обычный символ
      else {
        // Игнорируем escape-последовательности (стрелки и т.п.)
        if (char.charCodeAt(0) < 32) return;
        input += char;
        redraw();
      }
    }

    process.stdin.on("data", handler);
  });
}

async function askFullname(): Promise<string> {
  while (true) {
    const fullname = await prompt("Полное имя: ");
    if (fullname) return fullname;
    console.error("Ошибка: имя не может быть пустым. Попробуйте снова.\n");
  }
}

async function askEmail(): Promise<string> {
  while (true) {
    const email = await prompt("Email: ");
    if (email && email.includes("@")) return email;
    console.error("Ошибка: некорректный email. Попробуйте снова.\n");
  }
}

async function askPassword(): Promise<string> {
  while (true) {
    const password = await promptSilent("Пароль: ");
    if (!password || password.length < 6) {
      console.error(
        "Ошибка: пароль должен быть не менее 6 символов. Попробуйте снова.\n"
      );
      continue;
    }
    const passwordConfirm = await promptSilent("Подтвердите пароль: ");
    if (password !== passwordConfirm) {
      console.error("Ошибка: пароли не совпадают. Попробуйте снова.\n");
      continue;
    }
    return password;
  }
}

async function main() {
  console.log("=== Создание администратора ===\n");

  const fullname = await askFullname();
  const email = await askEmail();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.error(`Ошибка: пользователь с email "${email}" уже существует.`);
    process.exit(1);
  }

  const password = await askPassword();
  const pwdhash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullname,
      email,
      pwdhash,
      isStaff: true,
    },
  });

  console.log(`\nАдминистратор создан успешно!`);
  console.log(`   ID:       ${user.id}`);
  console.log(`   Имя:      ${user.fullname}`);
  console.log(`   Email:    ${user.email}`);
  console.log(`   isStaff:  ${user.isStaff}`);
}

main()
  .catch((e) => {
    console.error("Непредвиденная ошибка:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });