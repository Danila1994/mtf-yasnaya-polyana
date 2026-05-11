export default function LoginPage() {
  return (
    <main className="page">
      <section className="shell centered">
        <div className="loginCard">
          <div className="logo loginLogo">ЯП</div>
          <p className="small">ТОО МТФ «Ясная Поляна»</p>
          <h2 className="loginTitle">Вход в систему</h2>
          <form className="loginForm">
            <label>
              Логин
              <input placeholder="Введите логин" disabled />
            </label>
            <label>
              Пароль
              <input placeholder="Введите пароль" type="password" disabled />
            </label>
            <button disabled>Войти</button>
          </form>
          <p className="hint">Это макет. Авторизацию подключим на следующем этапе.</p>
        </div>
      </section>
    </main>
  );
}
