const rows = [
  ["Дойные коровы", "1400"],
  ["Фуражные головы", "1600"],
  ["Валовый надой", "43 400 л"],
  ["Средний надой", "31,0 л"],
  ["Осеменений", "22"],
  ["Новых лечений", "8"],
  ["Отёлов", "4"],
];

export default function DemoReportPage() {
  return (
    <main className="page">
      <section className="shell centered">
        <div className="reportCard">
          <p className="small">Демо-отчет</p>
          <h2 className="loginTitle">Оперативная сводка</h2>
          <div className="reportTable">
            {rows.map(([name, value]) => (
              <div className="reportRow" key={name}>
                <span>{name}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <a className="button secondary backButton" href="/">Назад на главную</a>
        </div>
      </section>
    </main>
  );
}
