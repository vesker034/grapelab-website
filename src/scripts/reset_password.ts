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
      if (char === "\r" || char === "\n" || char === "\u0004") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener("data", handler);
        process.stdout.write("\n");
        resolve(input);
      } else if (char === "\u0003") {
        process.stdout.write("\n");
        process.exit();
      } else if (char === "\u007f" || char === "\b") {
        if (input.length > 0) {
          input = input.slice(0, -1);
          redraw();
        }
      } else {
        if (char.charCodeAt(0) < 32) return;
        input += char;
        redraw();
      }
    }

    process.stdin.on("data", handler);
  });
}

async function askEmail(): Promise<string> {
  while (true) {
    const email = await prompt("Email пользователя: ");
    if (email && email.includes("@")) return email;
    console.error("Ошибка: некорректный email. Попробуйте снова.\n");
  }
}

async function askNewPassword(): Promise<string> {
  while (true) {
    const newPassword = await promptSilent("Новый пароль: ");
    if (!newPassword || newPassword.length < 6) {
      console.error(
        "Ошибка: пароль должен быть не менее 6 символов. Попробуйте снова.\n"
      );
      continue;
    }
    const passwordConfirm = await promptSilent("Подтвердите новый пароль: ");
    if (newPassword !== passwordConfirm) {
      console.error("Ошибка: пароли не совпадают. Попробуйте снова.\n");
      continue;
    }
    return newPassword;
  }
}

async function main() {
  console.log("=== Сброс пароля администратора ===\n");

  const email = await askEmail();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`Ошибка: пользователь с email "${email}" не найден.`);
    process.exit(1);
  }

  console.log(`\nНайден пользователь: ${user.fullname} (ID: ${user.id})\n`);

  const newPassword = await askNewPassword();
  const pwdhash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { pwdhash },
  });

  console.log(
    `\nПароль успешно сброшен для пользователя "${user.fullname}" (${email}).`
  );
}

main()
  .catch((e) => {
    console.error("Непредвиденная ошибка:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });