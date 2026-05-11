import Link from "next/link";

const rows = [
  ["Отёлов", "5", "86"],
  ["Осеменений", "24", "410"],
  ["Новых лечений", "11", "42"],
  ["Закрытых лечений", "8", "38"],
  ["Падёж телят", "0", "7"],
  ["Расход ЗЦМ", "135 кг", "3 780 кг"],
  ["Остаток силоса", "820 т", "—"]
];

export default function DemoPage() {
  return (
    <main className="page">
      <header className="header">
        <Link className="brand" href="/">
          <div className="logo">ЯП</div>
          <div>
            <small>Демо-отчет</small>
            <strong>МТФ «Ясная Поляна»</strong>
          </div>
        </Link>
        <Link className="btn primary" href="/login">Войти</Link>
      </header>

      <section style={{ paddingTop: 42 }}>
        <div className="badge">Оперативная сводка</div>
        <h1>Демо-отчет руководства</h1>
        <p className="lead">Пока данные примерные. После подключения базы этот экран будет строиться автоматически по фактическим журналам.</p>

        <div className="card" style={{ marginTop: 24 }}>
          <table className="table">
            <thead>
              <tr><th>Показатель</th><th>Сегодня</th><th>За месяц</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
