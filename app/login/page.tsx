import Link from "next/link";

const TEST_USERS = [
  { login: "admin", password: "1234", name: "Администратор", role: "admin", text: "Полный доступ ко всем разделам" },
  { login: "director", password: "1234", name: "Руководитель", role: "director", text: "Просмотр отчетов и журналов" },
  { login: "vet", password: "1234", name: "Ветврач", role: "vet", text: "Лечение, отёлы, падёж" },
  { login: "osem", password: "1234", name: "Осеменатор", role: "osem", text: "Осеменения и свои записи" },
  { login: "brigadir", password: "1234", name: "Бригадир", role: "brigadir", text: "Ежедневный отчёт и корма" },
  { login: "telyatnica", password: "1234", name: "Телятница", role: "telyatnica", text: "Телята, выпойка, первичный контроль" },
  { login: "view", password: "1234", name: "Только просмотр", role: "view", text: "Просмотр без редактирования" }
];

export default function LoginPage() {
  return (
    <main className="page">
      <header className="header">
        <Link className="brand" href="/">
          <div className="logo">ЯП</div>
          <div>
            <small>ТОО</small>
            <strong>МТФ «Ясная Поляна»</strong>
          </div>
        </Link>
        <div className="status"><span className="dot" /> Тестовый вход</div>
      </header>

      <section className="center-wrap login-wrap">
        <div className="form-card wide-card">
          <h2>Вход в систему</h2>
          <p>
            Это тестовая версия без настоящей базы и паролей. Чтобы исключить проблемы с вводом на телефоне,
            сейчас вход выполняется кнопками по ролям. На следующем этапе подключим нормальную авторизацию.
          </p>

          <div className="notice">
            Проверка: нажмите «Войти как админ» или любую другую роль. Должен открыться кабинет с разными разделами.
          </div>

          <div className="role-login-grid">
            {TEST_USERS.map((user) => (
              <Link className="role-login-card" href={`/dashboard/${user.role}`} key={user.role}>
                <strong>{user.name}</strong>
                <span>{user.text}</span>
                <small>логин: {user.login} / пароль: {user.password}</small>
              </Link>
            ))}
          </div>

          <div className="actions">
            <Link className="btn" href="/">На главную</Link>
            <Link className="btn" href="/demo">Демо-отчёт</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
