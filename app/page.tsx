import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page">
      <header className="header">
        <div className="brand">
          <div className="logo">ЯП</div>
          <div>
            <small>ТОО</small>
            <strong>МТФ «Ясная Поляна»</strong>
          </div>
        </div>
        <div className="status"><span className="dot" /> Прототип работает</div>
      </header>

      <section className="hero">
        <div>
          <div className="badge">Облачная система отчетности МТФ</div>
          <h1>Единая отчетность фермы в защищенном кабинете</h1>
          <p className="lead">
            Сотрудники вносят данные с телефона, руководство видит отчеты, администратор контролирует доступы и историю изменений.
          </p>
          <div className="actions">
            <Link className="btn primary" href="/login">Войти в систему</Link>
            <Link className="btn" href="/demo">Посмотреть демо-отчет</Link>
          </div>
          <div className="kpis">
            <div className="kpi"><strong>24/7</strong><span>доступ с телефона и ПК</span></div>
            <div className="kpi"><strong>Роли</strong><span>просмотр или редактирование</span></div>
            <div className="kpi"><strong>Лог</strong><span>кто и что изменил</span></div>
          </div>
        </div>

        <div className="card">
          <p style={{ marginTop: 0, color: "var(--muted-2)" }}>Главное меню</p>
          <h3>Рабочие разделы</h3>
          <MenuItem icon="📋" title="Ежедневная сводка" text="Молоко/головы, ветеринария/осеменение, зоотехния/корма" />
          <MenuItem icon="🛡️" title="Журнал лечения" text="Диагнозы, статусы, исходы, контроль случаев" />
          <MenuItem icon="🐄" title="Осеменение и отёлы" text="Ввод данных по воспроизводству и приплоду" />
          <MenuItem icon="📊" title="Отчеты руководства" text="День, неделя, месяц, экспорт в Excel" />
          <div className="notice">Статус: вход по ролям работает. Следующий этап — подключение базы данных и настоящих пользователей.</div>
        </div>
      </section>
    </main>
  );
}

function MenuItem({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="menu-card">
      <div className="icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}
