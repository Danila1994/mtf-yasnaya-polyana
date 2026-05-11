const menuItems = [
  {
    title: "Ежедневный отчет",
    text: "Надой, поголовье, отёлы, падёж, комментарии",
    icon: "M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 4h6M9 11h6M9 15h4",
  },
  {
    title: "Журнал лечения",
    text: "Диагнозы, статусы, исходы, контроль случаев",
    icon: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Zm-1 11-3-3 1.4-1.4L11 11.2l4.6-4.6L17 8l-6 6Z",
  },
  {
    title: "Осеменение и отёлы",
    text: "Ввод данных по воспроизводству и приплоду",
    icon: "M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm-4 6c-4.4 0-8 2-8 4h16c0-2-3.6-4-8-4Z",
  },
  {
    title: "Отчеты руководства",
    text: "День, неделя, месяц, экспорт в Excel",
    icon: "M4 19h16M7 16V9m5 7V5m5 11v-6",
  },
];

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path d={path} />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="page">
      <section className="shell">
        <header className="topbar">
          <div className="brand">
            <div className="logo">ЯП</div>
            <div>
              <p className="small">ТОО</p>
              <h1>МТФ «Ясная Поляна»</h1>
            </div>
          </div>
          <div className="status">Прототип работает</div>
        </header>

        <div className="heroGrid">
          <section className="heroText">
            <div className="badge">
              <span>☁</span>
              Облачная система отчетности МТФ
            </div>

            <h2>Единая отчетность фермы в одном защищенном кабинете</h2>

            <p className="lead">
              Сотрудники вносят данные с телефона, руководство видит отчеты,
              администратор контролирует доступы и историю изменений.
            </p>

            <div className="actions">
              <a href="/login" className="button primary">Войти в систему</a>
              <a href="/demo" className="button secondary">Посмотреть демо-отчет</a>
            </div>

            <div className="stats">
              <div className="statCard">
                <strong>24/7</strong>
                <span>доступ с телефона и ПК</span>
              </div>
              <div className="statCard">
                <strong>Роли</strong>
                <span>просмотр или редактирование</span>
              </div>
              <div className="statCard">
                <strong>Лог</strong>
                <span>кто и что изменил</span>
              </div>
            </div>
          </section>

          <section className="menuPanel">
            <div className="panelHeader">
              <div>
                <p className="small">Главное меню</p>
                <h3>Рабочие разделы</h3>
              </div>
              <div className="lock">🔒</div>
            </div>

            <div className="menuList">
              {menuItems.map((item) => (
                <div className="menuCard" key={item.title}>
                  <div className="menuIcon"><Icon path={item.icon} /></div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="nextStep">
              Статус: создана стартовая страница. Следующий этап — экран входа и роли пользователей.
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
