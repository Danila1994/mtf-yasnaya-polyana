"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CurrentUser = {
  login: string;
  name: string;
  role: string;
};

type Module = {
  title: string;
  text: string;
  roles: string[];
};

const ROLE_NAMES: Record<string, string> = {
  admin: "Администратор",
  director: "Руководитель",
  vet: "Ветврач",
  osem: "Осеменатор",
  brigadir: "Бригадир",
  telyatnica: "Телятница",
  view: "Только просмотр"
};

const MODULES: Module[] = [
  { title: "Пользователи и роли", text: "Добавление сотрудников, выдача прав доступа", roles: ["admin"] },
  { title: "Ежедневный отчет МТФ", text: "Надой, поголовье, падёж, комментарии за день", roles: ["admin", "director", "brigadir", "view"] },
  { title: "Журнал лечения", text: "Диагнозы, статусы, исходы, контроль случаев", roles: ["admin", "director", "vet", "view"] },
  { title: "Осеменение", text: "Ввод осеменений, семя, быки, исполнитель", roles: ["admin", "director", "osem", "view"] },
  { title: "Отёлы и телята", text: "Отёлы, приплод, молозиво, первичный контроль", roles: ["admin", "director", "vet", "telyatnica", "view"] },
  { title: "Корма и остатки", text: "Приход, расход, остатки кормов и добавок", roles: ["admin", "director", "brigadir", "view"] },
  { title: "Отчеты руководства", text: "День, неделя, месяц, фильтры и экспорт", roles: ["admin", "director", "view"] },
  { title: "История изменений", text: "Кто, когда и что изменил", roles: ["admin", "director"] }
];

const RESTRICTIONS: Record<string, string[]> = {
  admin: ["Полный доступ", "Редактирование справочников", "Контроль пользователей", "Просмотр истории изменений"],
  director: ["Просмотр отчетов", "Просмотр журналов", "Без изменения рабочих записей"],
  vet: ["Ввод лечения", "Ввод отёлов и падежа", "Просмотр своих разделов"],
  osem: ["Ввод осеменений", "Просмотр своих записей", "Без доступа к ветжурналу"],
  brigadir: ["Ежедневный отчет", "Корма и остатки", "Комментарии за смену"],
  telyatnica: ["Отёлы и телята", "Выпойка и первичный контроль", "Без доступа к управлению"],
  view: ["Только просмотр", "Без редактирования", "Без доступа к настройкам"]
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("mtf_user");
    if (!raw) {
      router.push("/login");
      return;
    }
    try {
      setUser(JSON.parse(raw));
      setLoaded(true);
    } catch {
      localStorage.removeItem("mtf_user");
      router.push("/login");
    }
  }, [router]);

  const visibleModules = useMemo(() => {
    if (!user) return [];
    return MODULES.filter((module) => module.roles.includes(user.role));
  }, [user]);

  function logout() {
    localStorage.removeItem("mtf_user");
    router.push("/login");
  }

  if (!loaded || !user) {
    return (
      <main className="page">
        <div className="center-wrap"><div className="card">Проверяем вход...</div></div>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <Link className="brand" href="/">
          <div className="logo">ЯП</div>
          <div>
            <small>Кабинет пользователя</small>
            <strong>МТФ «Ясная Поляна»</strong>
          </div>
        </Link>
        <button className="btn danger" onClick={logout}>Выйти</button>
      </header>

      <section className="dashboard-grid">
        <aside className="card">
          <p style={{ marginTop: 0, color: "var(--muted-2)" }}>Текущий пользователь</p>
          <h2>{user.name}</h2>
          <div className="role-pill">Роль: {ROLE_NAMES[user.role] ?? user.role}</div>
          <p>Сейчас проверяем, какие разделы видит пользователь в зависимости от роли.</p>

          <h3 style={{ marginTop: 20 }}>Ограничения роли</h3>
          <ul>
            {(RESTRICTIONS[user.role] ?? []).map((item) => <li key={item}>{item}</li>)}
          </ul>

          <div className="notice">Это тестовая логика. На следующем этапе роли будут храниться в базе данных.</div>
        </aside>

        <section className="card">
          <p style={{ marginTop: 0, color: "var(--muted-2)" }}>Доступные разделы</p>
          <h2>Рабочий кабинет</h2>
          <div className="module-grid">
            {visibleModules.map((module) => (
              <div className="module" key={module.title}>
                <strong>{module.title}</strong>
                <span>{module.text}</span>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: 24 }}>Последние действия</h3>
          <table className="table">
            <thead>
              <tr><th>Время</th><th>Действие</th><th>Статус</th></tr>
            </thead>
            <tbody>
              <tr><td>Сегодня</td><td>Вход в систему</td><td>тест</td></tr>
              <tr><td>Сегодня</td><td>Проверка роли</td><td>работает</td></tr>
              <tr><td>Следующий этап</td><td>Подключение базы</td><td>план</td></tr>
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}
