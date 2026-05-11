"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ReproTab = "current" | "longterm" | "history";

type ReproMonth = {
  id: string;
  month: string;
  year: number;
  lactating: number;
  dry: number;
  pregnant: number;
  open: number;
  eligible: number;
  inseminated: number;
  pregnancies: number;
  pregnancyLoss: number;
  abortions: number;
  calvings: number;
  heifers16Plus: number;
  heifersInseminated: number;
  heifersPregnant: number;
  cows70PlusNotBred: number;
  cows3PlusOpen: number;
  open150Plus: number;
  open200Plus: number;
  avgDimOpen: number;
  serviceRate: number;
  conceptionRate: number;
  pregnancyRate: number;
};

type CowRisk = {
  id: string;
  group: string;
  dim: number;
  services: number;
  status: "Не осеменена" | "Осеменена" | "Стельная" | "Проверить" | "Брак по воспроизводству";
  daysPregnant: number;
  action: string;
  risk: "Низкий" | "Средний" | "Высокий";
};

type CalvingPlan = {
  month: string;
  expectedCalvings: number;
  heiferCalvings: number;
  cowCalvings: number;
  expectedFreshMilk: number;
  risk: "Низкий" | "Средний" | "Высокий";
};

const AUTH_KEY = "mtf-auth";
const REPRO_HISTORY_KEY = "mtf-v64-reproduction-history";

const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const SHORT_MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

const seedHistory: ReproMonth[] = [
  m("Январь", 2026, 1400, 205, 612, 788, 510, 126, 44, 5, 3, 92, 118, 54, 31, 358, 168, 286, 174, 124, 32, 35, 11),
  m("Февраль", 2026, 1392, 210, 628, 764, 520, 138, 51, 4, 2, 96, 123, 62, 38, 342, 160, 270, 162, 119, 34, 37, 13),
  m("Март", 2026, 1388, 214, 646, 742, 532, 151, 58, 4, 2, 101, 126, 69, 45, 321, 151, 248, 151, 113, 36, 38, 14),
  m("Апрель", 2026, 1398, 218, 671, 727, 540, 166, 64, 3, 2, 108, 130, 76, 52, 298, 143, 226, 138, 109, 38, 39, 15),
  m("Май", 2026, 1404, 221, 694, 710, 548, 179, 72, 3, 1, 114, 136, 84, 59, 274, 132, 204, 121, 104, 40, 40, 16),
];

const seedCows: CowRisk[] = [
  { id: "1842", group: "Высокопродуктивная", dim: 82, services: 0, status: "Не осеменена", daysPregnant: 0, action: "Поставить в план осеменения / синхронизация", risk: "Средний" },
  { id: "2197", group: "Раздой", dim: 96, services: 0, status: "Не осеменена", daysPregnant: 0, action: "Проверить охоту и включить в работу", risk: "Средний" },
  { id: "1450", group: "Дойные", dim: 167, services: 4, status: "Проверить", daysPregnant: 0, action: "Ректальное УЗИ / решение по схеме", risk: "Высокий" },
  { id: "2311", group: "Дойные", dim: 212, services: 5, status: "Брак по воспроизводству", daysPregnant: 0, action: "Решение: лечение / выбраковка / Angus", risk: "Высокий" },
  { id: "1984", group: "Дойные", dim: 74, services: 1, status: "Осеменена", daysPregnant: 18, action: "Контроль стельности по сроку", risk: "Низкий" },
  { id: "2605", group: "Дойные", dim: 188, services: 3, status: "Проверить", daysPregnant: 0, action: "Повторная диагностика и решение по семени", risk: "Высокий" },
];

const seedCalvingPlan: CalvingPlan[] = [
  { month: "Июнь 2026", expectedCalvings: 118, heiferCalvings: 24, cowCalvings: 94, expectedFreshMilk: 106200, risk: "Низкий" },
  { month: "Июль 2026", expectedCalvings: 124, heiferCalvings: 27, cowCalvings: 97, expectedFreshMilk: 111600, risk: "Низкий" },
  { month: "Август 2026", expectedCalvings: 132, heiferCalvings: 31, cowCalvings: 101, expectedFreshMilk: 118800, risk: "Низкий" },
  { month: "Сентябрь 2026", expectedCalvings: 116, heiferCalvings: 22, cowCalvings: 94, expectedFreshMilk: 104400, risk: "Средний" },
  { month: "Октябрь 2026", expectedCalvings: 102, heiferCalvings: 19, cowCalvings: 83, expectedFreshMilk: 91800, risk: "Средний" },
  { month: "Ноябрь 2026", expectedCalvings: 96, heiferCalvings: 18, cowCalvings: 78, expectedFreshMilk: 86400, risk: "Средний" },
  { month: "Декабрь 2026", expectedCalvings: 88, heiferCalvings: 16, cowCalvings: 72, expectedFreshMilk: 79200, risk: "Высокий" },
  { month: "Январь 2027", expectedCalvings: 92, heiferCalvings: 17, cowCalvings: 75, expectedFreshMilk: 82800, risk: "Средний" },
  { month: "Февраль 2027", expectedCalvings: 104, heiferCalvings: 21, cowCalvings: 83, expectedFreshMilk: 93600, risk: "Средний" },
  { month: "Март 2027", expectedCalvings: 112, heiferCalvings: 23, cowCalvings: 89, expectedFreshMilk: 100800, risk: "Низкий" },
  { month: "Апрель 2027", expectedCalvings: 120, heiferCalvings: 26, cowCalvings: 94, expectedFreshMilk: 108000, risk: "Низкий" },
  { month: "Май 2027", expectedCalvings: 128, heiferCalvings: 28, cowCalvings: 100, expectedFreshMilk: 115200, risk: "Низкий" },
];

function m(
  month: string,
  year: number,
  lactating: number,
  dry: number,
  pregnant: number,
  open: number,
  eligible: number,
  inseminated: number,
  pregnancies: number,
  pregnancyLoss: number,
  abortions: number,
  calvings: number,
  heifers16Plus: number,
  heifersInseminated: number,
  heifersPregnant: number,
  cows70PlusNotBred: number,
  cows3PlusOpen: number,
  open150Plus: number,
  open200Plus: number,
  avgDimOpen: number,
  serviceRate: number,
  conceptionRate: number,
  pregnancyRate: number
): ReproMonth {
  return {
    id: `${year}-${month}`,
    month,
    year,
    lactating,
    dry,
    pregnant,
    open,
    eligible,
    inseminated,
    pregnancies,
    pregnancyLoss,
    abortions,
    calvings,
    heifers16Plus,
    heifersInseminated,
    heifersPregnant,
    cows70PlusNotBred,
    cows3PlusOpen,
    open150Plus,
    open200Plus,
    avgDimOpen,
    serviceRate,
    conceptionRate,
    pregnancyRate,
  };
}

function fmt(value: number, digits = 0) {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function pct(value: number, digits = 1) {
  return `${fmt(value, digits)}%`;
}

function scoreLatest(latest: ReproMonth) {
  const dim70Rate = latest.lactating ? latest.cows70PlusNotBred / latest.lactating * 100 : 0;
  const services3Rate = latest.lactating ? latest.cows3PlusOpen / latest.lactating * 100 : 0;
  const heiferDelayRate = latest.heifers16Plus ? Math.max(latest.heifers16Plus - latest.heifersInseminated, 0) / latest.heifers16Plus * 100 : 0;

  const dimScore = Math.max(0, 100 - Math.max(dim70Rate - 15, 0) * 4);
  const serviceScore = Math.max(0, 100 - Math.max(services3Rate - 15, 0) * 4);
  const prScore = Math.min(100, latest.pregnancyRate / 22 * 100);
  const heiferScore = Math.max(0, 100 - Math.max(heiferDelayRate - 5, 0) * 3);
  const lossScore = Math.max(0, 100 - Math.max((latest.pregnancyLoss + latest.abortions) - 5, 0) * 6);

  return Math.round(dimScore * 0.25 + serviceScore * 0.20 + prScore * 0.25 + heiferScore * 0.15 + lossScore * 0.15);
}

export default function ReproductionPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<ReproTab>("current");
  const [history, setHistory] = useState<ReproMonth[]>(seedHistory);
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem(AUTH_KEY) !== "yes") {
      router.replace("/");
      return;
    }

    setReady(true);
  }, [router]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(REPRO_HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ReproMonth[];
        if (parsed.length) setHistory(parsed);
      }
    } catch {}
  }, []);

  const latest = history[history.length - 1] ?? seedHistory[seedHistory.length - 1];
  const score = scoreLatest(latest);

  function save() {
    const stamp = new Date().toLocaleString("ru-RU");
    setSavedAt(stamp);
    try {
      window.localStorage.setItem(REPRO_HISTORY_KEY, JSON.stringify(history));
    } catch {}
  }

  function reset() {
    setHistory(seedHistory);
    setSavedAt("");
    try {
      window.localStorage.removeItem(REPRO_HISTORY_KEY);
    } catch {}
  }

  function updateHistory(index: number, field: keyof ReproMonth, value: string) {
    setHistory((current) => current.map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      if (field === "month") return { ...item, month: value };
      if (field === "id") return item;
      return { ...item, [field]: Number(value) || 0 };
    }));
  }

  function addMonth() {
    setHistory((current) => [
      ...current,
      {
        ...latest,
        id: `${Date.now()}`,
        month: "Новый месяц",
        year: latest.year,
      },
    ]);
  }

  if (!ready) return <main className="page">Проверка доступа...</main>;

  return (
    <main className="page">
      <div className="shell">
        <Sidebar />
        <section className="main">
          <header className="topbar">
            <div>
              <h1 className="title">Воспроизводство</h1>
              <p className="subtitle">
                Текущее состояние, долгосрочная перспектива и история данных для прогнозов по отёлам, стаду и будущему молоку.
              </p>
            </div>

            <div className="actions">
              <button className="btn btn-soft" type="button" onClick={reset}>Сброс</button>
              <button className="btn btn-primary" type="button" onClick={save}>Сохранить</button>
            </div>
          </header>

          <div className="tabs">
            <button className={tab === "current" ? "tab active" : "tab"} onClick={() => setTab("current")}>Текущее состояние</button>
            <button className={tab === "longterm" ? "tab active" : "tab"} onClick={() => setTab("longterm")}>Долгосрочная перспектива</button>
            <button className={tab === "history" ? "tab active" : "tab"} onClick={() => setTab("history")}>История данных</button>
          </div>

          {savedAt ? <p className="muted">Последнее сохранение: {savedAt}</p> : null}

          {tab === "current" ? <CurrentTab latest={latest} history={history} score={score} /> : null}
          {tab === "longterm" ? <LongTermTab latest={latest} history={history} /> : null}
          {tab === "history" ? <HistoryTab history={history} updateHistory={updateHistory} addMonth={addMonth} /> : null}
        </section>
      </div>
    </main>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">ЯП</div>
        <div>
          <strong>МТФ</strong>
          <span>Ясная Поляна</span>
        </div>
      </div>

      <nav className="nav">
        <Link className="nav-link" href="/dashboard"><span className="nav-icon">⌂</span>Главная</Link>
        <Link className="nav-link" href="/dashboard/milk"><span className="nav-icon">▣</span>Молоко</Link>
        <Link className="nav-link active" href="/dashboard/reproduction"><span className="nav-icon">◎</span>Воспроизводство</Link>
        <div className="nav-link"><span className="nav-icon">✚</span>Ветеринария</div>
        <div className="nav-link"><span className="nav-icon">⌬</span>Корма</div>
        <div className="nav-link"><span className="nav-icon">₸</span>Финансы</div>
        <div className="nav-link"><span className="nav-icon">▤</span>Архив</div>
        <div className="nav-link"><span className="nav-icon">⚙</span>Настройки</div>
      </nav>

      <div className="user-card">
        <div className="avatar" />
        <div>
          <strong>Данила Г.</strong>
          <span>Руководитель</span>
        </div>
      </div>
    </aside>
  );
}

function CurrentTab({ latest, history, score }: { latest: ReproMonth; history: ReproMonth[]; score: number }) {
  const dim70Rate = latest.lactating ? latest.cows70PlusNotBred / latest.lactating * 100 : 0;
  const services3Rate = latest.lactating ? latest.cows3PlusOpen / latest.lactating * 100 : 0;
  const heiferDelay = latest.heifers16Plus ? Math.max(latest.heifers16Plus - latest.heifersInseminated, 0) / latest.heifers16Plus * 100 : 0;
  const dryPct = latest.lactating ? latest.dry / (latest.lactating + latest.dry) * 100 : 0;

  return (
    <>
      <section className="kpi-grid">
        <Kpi icon="◎" title="Оценка воспроизводства" value={`${score}/100`} note={score >= 75 ? "сильный уровень" : score >= 55 ? "средний уровень" : "требует усиления"} />
        <Kpi icon="🐄" title="Дойные коровы" value={`${fmt(latest.lactating)} гол`} note={`сухостой ${pct(dryPct)}`} />
        <Kpi icon="✓" title="Стельные" value={`${fmt(latest.pregnant)} гол`} note={`${pct(latest.pregnant / Math.max(latest.lactating, 1) * 100)} от дойных`} />
        <Kpi icon="!" title="70+ DIM без осеменения" value={`${fmt(latest.cows70PlusNotBred)} гол`} note={pct(dim70Rate)} />
        <Kpi icon="3+" title="3+ осеменений и открытые" value={`${fmt(latest.cows3PlusOpen)} гол`} note={pct(services3Rate)} />
        <Kpi icon="PR" title="Pregnancy Rate" value={pct(latest.pregnancyRate)} note={`SR ${pct(latest.serviceRate)} / CR ${pct(latest.conceptionRate)}`} />
      </section>

      <section className="grid-2">
        <div className="panel">
          <h2 className="panel-title">Динамика KPI по месяцам</h2>
          <LineChart
            labels={history.map((i) => i.month.slice(0, 3))}
            series={[
              { name: "PR", color: "#22c55e", values: history.map((i) => i.pregnancyRate) },
              { name: "CR", color: "#60a5fa", values: history.map((i) => i.conceptionRate) },
              { name: "SR", color: "#fbbf24", values: history.map((i) => i.serviceRate) },
            ]}
            percent
          />
        </div>

        <div className="panel">
          <h2 className="panel-title">Риски текущего месяца</h2>
          <Risk name="70+ DIM без осеменения" value={Math.min(dim70Rate * 4, 100)} label={dim70Rate > 20 ? "Высокий" : dim70Rate > 15 ? "Средний" : "Низкий"} />
          <Risk name="3+ осеменений открытые" value={Math.min(services3Rate * 4, 100)} label={services3Rate > 20 ? "Высокий" : services3Rate > 15 ? "Средний" : "Низкий"} />
          <Risk name="Тёлки 16+ без осеменения" value={Math.min(heiferDelay * 2, 100)} label={heiferDelay > 20 ? "Высокий" : heiferDelay > 8 ? "Средний" : "Низкий"} />
          <Risk name="Потери стельности" value={Math.min((latest.pregnancyLoss + latest.abortions) * 10, 100)} label={(latest.pregnancyLoss + latest.abortions) > 8 ? "Высокий" : "Средний"} />
        </div>
      </section>

      <section className="grid-side">
        <div className="panel">
          <h2 className="panel-title">Коровы для немедленного контроля</h2>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Группа</th>
                  <th className="num">DIM</th>
                  <th className="num">Осем.</th>
                  <th>Статус</th>
                  <th>Риск</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {seedCows.map((cow) => (
                  <tr key={cow.id}>
                    <td>{cow.id}</td>
                    <td>{cow.group}</td>
                    <td className="num">{cow.dim}</td>
                    <td className="num">{cow.services}</td>
                    <td>{cow.status}</td>
                    <td><RiskBadge risk={cow.risk} /></td>
                    <td>{cow.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel insights">
          <h2 className="panel-title">Выводы для руководства</h2>
          <Insight>Основной текущий риск — коровы 70+ DIM без первого осеменения: {fmt(latest.cows70PlusNotBred)} голов.</Insight>
          <Insight>Группа 3+ осеменений и открытые требует отдельного решения: повторная диагностика, схема, Angus или выбраковка.</Insight>
          <Insight>История воспроизводства должна храниться помесячно: без неё прогноз молока будет слабым.</Insight>
          <Insight>Прогноз отёлов напрямую влияет на прогноз валового молока через будущий раздой.</Insight>
        </div>
      </section>
    </>
  );
}

function LongTermTab({ latest, history }: { latest: ReproMonth; history: ReproMonth[] }) {
  const totalCalvings = seedCalvingPlan.reduce((sum, item) => sum + item.expectedCalvings, 0);
  const totalMilk = seedCalvingPlan.reduce((sum, item) => sum + item.expectedFreshMilk, 0);

  return (
    <>
      <section className="kpi-grid">
        <Kpi icon="📅" title="Отёлы 12 мес." value={`${fmt(totalCalvings)} гол`} note="плановая нагрузка" />
        <Kpi icon="🥛" title="Вклад в молоко" value={`${fmt(totalMilk)} кг`} note="условный стартовый вклад" />
        <Kpi icon="🐄" title="Тёлки 16+" value={`${fmt(latest.heifers16Plus)} гол`} note={`${fmt(latest.heifersInseminated)} осеменено`} />
        <Kpi icon="✓" title="Стельные тёлки" value={`${fmt(latest.heifersPregnant)} гол`} note="ремонт стада" />
        <Kpi icon="!" title="Открытые 150+ DIM" value={`${fmt(latest.open150Plus)} гол`} note="риск растяжки лактации" />
        <Kpi icon="!!" title="Открытые 200+ DIM" value={`${fmt(latest.open200Plus)} гол`} note="высокий риск" />
      </section>

      <section className="grid-2">
        <div className="panel">
          <h2 className="panel-title">Прогноз отёлов на 12 месяцев</h2>
          <BarLineChart
            labels={seedCalvingPlan.map((i) => i.month.slice(0, 3))}
            bars={seedCalvingPlan.map((i) => i.expectedCalvings)}
            line={seedCalvingPlan.map((i) => i.expectedFreshMilk / 1000)}
          />
        </div>

        <div className="panel">
          <h2 className="panel-title">Связь с прогнозом молока</h2>
          <p className="muted">
            История воспроизводства нужна для прогноза молока, потому что будущий вал зависит от числа отёлов,
            сроков запуска, потерь стельности, выбытия и качества работы с тёлками.
          </p>
          <Risk name="Недобор отёлов" value={52} label="Средний" />
          <Risk name="Поздние осеменения" value={68} label="Высокий" />
          <Risk name="Потери стельности" value={38} label="Средний" />
          <Risk name="Тёлки 16+ без работы" value={44} label="Средний" />
        </div>
      </section>

      <section className="grid-side">
        <div className="panel">
          <h2 className="panel-title">Помесячная перспектива</h2>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Месяц</th>
                  <th className="num">Отёлы всего</th>
                  <th className="num">Нетели</th>
                  <th className="num">Коровы</th>
                  <th className="num">Вклад в молоко</th>
                  <th>Риск</th>
                </tr>
              </thead>
              <tbody>
                {seedCalvingPlan.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td className="num">{fmt(row.expectedCalvings)}</td>
                    <td className="num">{fmt(row.heiferCalvings)}</td>
                    <td className="num">{fmt(row.cowCalvings)}</td>
                    <td className="num">{fmt(row.expectedFreshMilk)}</td>
                    <td><RiskBadge risk={row.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h2 className="panel-title">Что должно попасть в историю</h2>
          <Insight>Количество eligible cows по месяцам.</Insight>
          <Insight>Осеменения, стельности, потери стельности и аборты.</Insight>
          <Insight>Коровы 70+ DIM без осеменения и 3+ осеменений открытые.</Insight>
          <Insight>Тёлки 16+ месяцев: всего, осеменено, стельно.</Insight>
          <Insight>Факт отёлов и будущий план отёлов.</Insight>
        </div>
      </section>
    </>
  );
}

function HistoryTab({
  history,
  updateHistory,
  addMonth,
}: {
  history: ReproMonth[];
  updateHistory: (index: number, field: keyof ReproMonth, value: string) => void;
  addMonth: () => void;
}) {
  return (
    <>
      <section className="panel">
        <h2 className="panel-title">
          История данных по воспроизводству
          <button className="btn btn-primary" type="button" onClick={addMonth}>Добавить месяц</button>
        </h2>
        <p className="muted">
          Эти данные нужны не только для отчёта по воспроизводству, но и для прогноза молока:
          отёлы → раздой → будущий вал → план товарного молока.
        </p>

        <div className="table-wrap">
          <table className="table" style={{ minWidth: 1800 }}>
            <thead>
              <tr>
                <th>Месяц</th>
                <th className="num">Год</th>
                <th className="num">Дойные</th>
                <th className="num">Сухостой</th>
                <th className="num">Стельные</th>
                <th className="num">Открытые</th>
                <th className="num">Eligible</th>
                <th className="num">Осеменено</th>
                <th className="num">Стельностей</th>
                <th className="num">Потери стельн.</th>
                <th className="num">Аборты</th>
                <th className="num">Отёлы</th>
                <th className="num">Тёлки 16+</th>
                <th className="num">Тёлки осем.</th>
                <th className="num">Тёлки стельн.</th>
                <th className="num">70+ DIM без осем.</th>
                <th className="num">3+ осем. открытые</th>
                <th className="num">Открытые 150+</th>
                <th className="num">Открытые 200+</th>
                <th className="num">Avg DIM open</th>
                <th className="num">SR</th>
                <th className="num">CR</th>
                <th className="num">PR</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, index) => (
                <tr key={row.id}>
                  <td>
                    <select className="table-input" value={row.month} onChange={(event) => updateHistory(index, "month", event.target.value)}>
                      {[...MONTHS, "Новый месяц"].map((month) => <option key={month}>{month}</option>)}
                    </select>
                  </td>
                  <Num value={row.year} onChange={(value) => updateHistory(index, "year", value)} />
                  <Num value={row.lactating} onChange={(value) => updateHistory(index, "lactating", value)} />
                  <Num value={row.dry} onChange={(value) => updateHistory(index, "dry", value)} />
                  <Num value={row.pregnant} onChange={(value) => updateHistory(index, "pregnant", value)} />
                  <Num value={row.open} onChange={(value) => updateHistory(index, "open", value)} />
                  <Num value={row.eligible} onChange={(value) => updateHistory(index, "eligible", value)} />
                  <Num value={row.inseminated} onChange={(value) => updateHistory(index, "inseminated", value)} />
                  <Num value={row.pregnancies} onChange={(value) => updateHistory(index, "pregnancies", value)} />
                  <Num value={row.pregnancyLoss} onChange={(value) => updateHistory(index, "pregnancyLoss", value)} />
                  <Num value={row.abortions} onChange={(value) => updateHistory(index, "abortions", value)} />
                  <Num value={row.calvings} onChange={(value) => updateHistory(index, "calvings", value)} />
                  <Num value={row.heifers16Plus} onChange={(value) => updateHistory(index, "heifers16Plus", value)} />
                  <Num value={row.heifersInseminated} onChange={(value) => updateHistory(index, "heifersInseminated", value)} />
                  <Num value={row.heifersPregnant} onChange={(value) => updateHistory(index, "heifersPregnant", value)} />
                  <Num value={row.cows70PlusNotBred} onChange={(value) => updateHistory(index, "cows70PlusNotBred", value)} />
                  <Num value={row.cows3PlusOpen} onChange={(value) => updateHistory(index, "cows3PlusOpen", value)} />
                  <Num value={row.open150Plus} onChange={(value) => updateHistory(index, "open150Plus", value)} />
                  <Num value={row.open200Plus} onChange={(value) => updateHistory(index, "open200Plus", value)} />
                  <Num value={row.avgDimOpen} onChange={(value) => updateHistory(index, "avgDimOpen", value)} />
                  <Num value={row.serviceRate} onChange={(value) => updateHistory(index, "serviceRate", value)} />
                  <Num value={row.conceptionRate} onChange={(value) => updateHistory(index, "conceptionRate", value)} />
                  <Num value={row.pregnancyRate} onChange={(value) => updateHistory(index, "pregnancyRate", value)} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid-side">
        <div className="panel">
          <h2 className="panel-title">История PR / CR / SR</h2>
          <LineChart
            labels={history.map((i) => i.month.slice(0, 3))}
            series={[
              { name: "PR", color: "#22c55e", values: history.map((i) => i.pregnancyRate) },
              { name: "CR", color: "#60a5fa", values: history.map((i) => i.conceptionRate) },
              { name: "SR", color: "#fbbf24", values: history.map((i) => i.serviceRate) },
            ]}
            percent
          />
        </div>

        <div className="panel">
          <h2 className="panel-title">История отёлов</h2>
          <VerticalBars data={history.map((i) => ({ label: i.month.slice(0, 3), value: i.calvings }))} />
        </div>
      </section>
    </>
  );
}

function Num({ value, onChange }: { value: number; onChange: (value: string) => void }) {
  return (
    <td>
      <input className="table-input num" type="number" value={value} onChange={(event) => onChange(event.target.value)} />
    </td>
  );
}

function Kpi({ icon, title, value, note }: { icon: string; title: string; value: string; note: string }) {
  return (
    <div className="kpi-card">
      <div className="kpi-head"><span className="kpi-icon">{icon}</span>{title}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-note">{note}</div>
    </div>
  );
}

function Insight({ children }: { children: React.ReactNode }) {
  return (
    <div className="insight-item">
      <span className="check">✓</span>
      <span>{children}</span>
    </div>
  );
}

function RiskBadge({ risk }: { risk: "Низкий" | "Средний" | "Высокий" }) {
  if (risk === "Высокий") return <span className="badge red">Высокий</span>;
  if (risk === "Средний") return <span className="badge orange">Средний</span>;
  return <span className="badge">Низкий</span>;
}

function Risk({ name, value, label }: { name: string; value: number; label: "Низкий" | "Средний" | "Высокий" }) {
  const color = label === "Высокий" ? "#ef4444" : label === "Средний" ? "#f59e0b" : "#22c55e";

  return (
    <div className="risk-row">
      <span>{name}</span>
      <div className="risk-bar"><div className="risk-fill" style={{ width: `${value}%`, background: color }} /></div>
      <span className={label === "Высокий" ? "red" : label === "Средний" ? "orange" : "green"}>{label}</span>
    </div>
  );
}

function LineChart({ series, labels, percent = false }: { series: { name: string; color: string; values: number[] }[]; labels: string[]; percent?: boolean }) {
  const width = 900;
  const height = 280;
  const left = 54;
  const right = 22;
  const top = 28;
  const bottom = 42;
  const values = series.flatMap((item) => item.values).filter((value) => value > 0);
  const max = Math.max(...values, 1) * 1.08;
  const min = 0;

  function x(index: number) {
    return left + (index * (width - left - right)) / Math.max(labels.length - 1, 1);
  }

  function y(value: number) {
    return height - bottom - ((value - min) / Math.max(max - min, 1)) * (height - top - bottom);
  }

  function points(values: number[]) {
    return values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  }

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((rate) => max * rate);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={left} x2={width - right} y1={y(tick)} y2={y(tick)} stroke="rgba(148,163,184,.14)" />
          <text x={8} y={y(tick) + 4} fill="#a6b4c8" fontSize="12">{percent ? `${fmt(tick, 1)}%` : fmt(tick)}</text>
        </g>
      ))}
      <line x1={left} x2={width - right} y1={height - bottom} y2={height - bottom} stroke="rgba(148,163,184,.25)" />
      {series.map((item) => (
        <polyline key={item.name} points={points(item.values)} fill="none" stroke={item.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {labels.map((label, index) => (
        index % Math.ceil(labels.length / 8) === 0 ? <text key={label + index} x={x(index)} y={height - 14} fill="#a6b4c8" fontSize="12" textAnchor="middle">{label}</text> : null
      ))}
      <g transform={`translate(${left}, 12)`}>
        {series.map((item, index) => (
          <g key={item.name} transform={`translate(${index * 145}, 0)`}>
            <rect x="0" y="-8" width="18" height="7" rx="4" fill={item.color} />
            <text x="25" y="0" fill="#d7e4f2" fontSize="12">{item.name}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function VerticalBars({ data }: { data: { label: string; value: number }[] }) {
  const width = 720;
  const height = 250;
  const left = 46;
  const bottom = 54;
  const top = 26;
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
      <line x1={left} x2={width - 20} y1={height - bottom} y2={height - bottom} stroke="rgba(148,163,184,.25)" />
      {data.map((item, index) => {
        const barW = 64;
        const gap = 34;
        const x = left + 28 + index * (barW + gap);
        const h = (item.value / max) * (height - top - bottom);
        const y = height - bottom - h;
        return (
          <g key={item.label}>
            <rect x={x} y={y} width={barW} height={h} rx="7" fill="#22c55e" opacity=".86" />
            <text x={x + barW / 2} y={y - 8} textAnchor="middle" fill="#d7e4f2" fontSize="12">{fmt(item.value)}</text>
            <text x={x + barW / 2} y={height - 32} textAnchor="middle" fill="#a6b4c8" fontSize="12">{item.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function BarLineChart({ labels, bars, line }: { labels: string[]; bars: number[]; line: number[] }) {
  const width = 900;
  const height = 300;
  const left = 54;
  const right = 22;
  const top = 30;
  const bottom = 48;
  const maxBar = Math.max(...bars, 1) * 1.15;
  const maxLine = Math.max(...line, 1) * 1.15;

  function x(index: number) {
    return left + (index * (width - left - right)) / Math.max(labels.length - 1, 1);
  }

  function yBar(value: number) {
    return height - bottom - (value / maxBar) * (height - top - bottom);
  }

  function yLine(value: number) {
    return height - bottom - (value / maxLine) * (height - top - bottom);
  }

  const points = line.map((value, index) => `${x(index)},${yLine(value)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
      <line x1={left} x2={width - right} y1={height - bottom} y2={height - bottom} stroke="rgba(148,163,184,.25)" />
      {bars.map((value, index) => {
        const barW = 28;
        const bx = x(index) - barW / 2;
        const by = yBar(value);
        return <rect key={labels[index]} x={bx} y={by} width={barW} height={height - bottom - by} rx="6" fill="#22c55e" opacity=".82" />;
      })}
      <polyline points={points} fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {labels.map((label, index) => (
        index % 1 === 0 ? <text key={label} x={x(index)} y={height - 14} fill="#a6b4c8" fontSize="12" textAnchor="middle">{label}</text> : null
      ))}
      <g transform={`translate(${left}, 14)`}>
        <rect x="0" y="-8" width="18" height="7" rx="4" fill="#22c55e" />
        <text x="25" y="0" fill="#d7e4f2" fontSize="12">Отёлы</text>
        <rect x="95" y="-8" width="18" height="7" rx="4" fill="#60a5fa" />
        <text x="120" y="0" fill="#d7e4f2" fontSize="12">Вклад в молоко</text>
      </g>
    </svg>
  );
}
