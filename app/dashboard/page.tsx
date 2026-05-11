import Link from "next/link";

const ROLES = [
  ["admin", "Администратор"],
  ["director", "Руководитель"],
  ["vet", "Ветврач"],
  ["osem", "Осеменатор"],
  ["brigadir", "Бригадир"],
  ["telyatnica", "Телятница"],
  ["view", "Только просмотр"]
];

export default function DashboardIndexPage() {
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
        <Link className="btn" href="/login">Назад ко входу</Link>
      </header>

      <section className="center-wrap">
        <div className="card wide-card">
          <h2>Выберите тестовую роль</h2>
          <p>Пока авторизация тестовая. Выберите роль, чтобы проверить доступные разделы.</p>
          <div className="role-login-grid">
            {ROLES.map(([role, title]) => (
              <Link className="role-login-card" href={`/dashboard/${role}`} key={role}>
                <strong>{title}</strong>
                <span>Открыть кабинет</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
