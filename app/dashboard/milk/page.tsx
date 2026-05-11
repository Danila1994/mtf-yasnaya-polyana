"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type MilkRow = {
  date: string;
  elHeads: string;
  elTank: string;
  elMastitis: string;
  elFat: string;
  carHeads: string;
  carTank: string;
  carMastitis: string;
  carFat: string;
  buyer: string;
  soldPlant: string;
  soldCalves: string;
  soldInternal: string;
  soldOther: string;
  price: string;
  comment: string;
};

type MonthFact2026 = {
  gross: number;
  mastitis: number;
  market: number;
  fat: number;
};

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const YEARS = [2024, 2025, 2026];

const history2024 = [
  439847, 429615, 562796, 694338, 827988, 827622,
  858586, 809062, 720740, 705869, 606174, 601676,
];

const history2025 = [
  583946, 575915, 678798, 748698, 887403, 855385,
  952681, 988164, 964231, 1017140, 993719, 978987,
];

const history2026Base: Record<number, MonthFact2026> = {
  0: { gross: 1001889, mastitis: 24445, market: 977444, fat: 4.2 },
  1: { gross: 877211, mastitis: 32495, market: 844716, fat: 4.3 },
  2: { gross: 1003355, mastitis: 38905, market: 964450, fat: 4.2 },
  3: { gross: 1057642, mastitis: 53040, market: 1004602, fat: 4.0 },
};

const maySeed: MilkRow[] = [
  makeRow("2026-05-01", 245, 3983, 0, 4.5, 1050, 31567, 550, 3.9),
  makeRow("2026-05-02", 245, 3875, 0, 4.3, 1050, 32153, 520, 3.8),
  makeRow("2026-05-03", 245, 3929, 0, 4.5, 1050, 32252, 510, 3.9),
  makeRow("2026-05-04", 245, 3966, 0, 4.5, 1050, 32241, 610, 3.8),
  makeRow("2026-05-05", 245, 4131, 0, 4.3, 1050, 32767, 590, 3.9),
  makeRow("2026-05-06", 245, 3996, 0, 4.5, 1050, 31946, 600, 3.9),
  makeRow("2026-05-07", 265, 4394, 0, 4.4, 1083, 30934, 540, 3.8),
  makeRow("2026-05-08", 265, 4374, 0, 4.3, 1083, 30945, 740, 3.9),
];

function makeRow(
  date: string,
  elHeads: number,
  elTank: number,
  elMastitis: number,
  elFat: number,
  carHeads: number,
  carTank: number,
  carMastitis: number,
  carFat: number
): MilkRow {
  const market = elTank + carTank;

  return {
    date,
    elHeads: String(elHeads),
    elTank: String(elTank),
    elMastitis: String(elMastitis),
    elFat: String(elFat),
    carHeads: String(carHeads),
    carTank: String(carTank),
    carMastitis: String(carMastitis),
    carFat: String(carFat),
    buyer: "Молокозавод",
    soldPlant: String(market),
    soldCalves: "0",
    soldInternal: "0",
    soldOther: "0",
    price: "",
    comment: "",
  };
}

function emptyRow(date: string): MilkRow {
  return {
    date,
    elHeads: "",
    elTank: "",
    elMastitis: "0",
    elFat: "",
    carHeads: "",
    carTank: "",
    carMastitis: "",
    carFat: "",
    buyer: "",
    soldPlant: "",
    soldCalves: "",
    soldInternal: "",
    soldOther: "",
    price: "",
    comment: "",
  };
}

function buildMonthRows(year: number, monthIndex: number): MilkRow[] {
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const rows = Array.from({ length: days }, (_, index) => {
    const date = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`;
    return emptyRow(date);
  });

  if (year === 2026 && monthIndex === 4) {
    return rows.map((row, index) => maySeed[index] ?? row);
  }

  return rows;
}

function storageKey(year: number, month: number) {
  return `mtf-clean-milk-${year}-${String(month + 1).padStart(2, "0")}`;
}

function toNum(value: string | number | undefined) {
  if (value === undefined || value === null || value === "") return 0;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
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

function calcRow(row: MilkRow) {
  const elHeads = toNum(row.elHeads);
  const elTank = toNum(row.elTank);
  const elMastitis = toNum(row.elMastitis);
  const elFat = toNum(row.elFat);
  const carHeads = toNum(row.carHeads);
  const carTank = toNum(row.carTank);
  const carMastitis = toNum(row.carMastitis);
  const carFat = toNum(row.carFat);

  const elGross = elTank + elMastitis;
  const carGross = carTank + carMastitis;
  const heads = elHeads + carHeads;
  const market = elTank + carTank;
  const mastitis = elMastitis + carMastitis;
  const gross = market + mastitis;

  const soldPlant = toNum(row.soldPlant);
  const soldCalves = toNum(row.soldCalves);
  const soldInternal = toNum(row.soldInternal);
  const soldOther = toNum(row.soldOther);
  const price = toNum(row.price);
  const soldTotal = soldPlant + soldCalves + soldInternal + soldOther;

  return {
    elGross,
    carGross,
    heads,
    market,
    mastitis,
    gross,
    elAvg: elHeads ? elGross / elHeads : 0,
    carAvg: carHeads ? carGross / carHeads : 0,
    avg: heads ? gross / heads : 0,
    fat: market ? (elTank * elFat + carTank * carFat) / market : 0,
    mastitisPct: gross ? (mastitis / gross) * 100 : 0,
    soldPlant,
    soldCalves,
    soldInternal,
    soldOther,
    soldTotal,
    notDistributed: market - soldTotal,
    revenue: soldPlant * price,
  };
}

export default function MilkPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<"summary" | "extended">("summary");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(4);
  const [selectedDay, setSelectedDay] = useState(0);
  const [rows, setRows] = useState<MilkRow[]>(buildMonthRows(2026, 4));
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem("mtf-auth") !== "yes") {
      router.replace("/");
      return;
    }

    setReady(true);
  }, [router]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(selectedYear, selectedMonth));
      if (raw) {
        const parsed = JSON.parse(raw) as { rows?: MilkRow[]; savedAt?: string };
        const nextRows = parsed.rows?.length ? parsed.rows : buildMonthRows(selectedYear, selectedMonth);
        setRows(nextRows);
        setSavedAt(parsed.savedAt ?? "");
      } else {
        setRows(buildMonthRows(selectedYear, selectedMonth));
        setSavedAt("");
      }
    } catch {
      setRows(buildMonthRows(selectedYear, selectedMonth));
      setSavedAt("");
    }

    setSelectedDay(0);
  }, [selectedYear, selectedMonth]);

  const selectedRow = rows[selectedDay] ?? rows[0] ?? emptyRow("2026-05-01");
  const selectedCalc = calcRow(selectedRow);

  const summary = useMemo(() => {
    const calculated = rows.map(calcRow).filter((row) => row.gross > 0 || row.soldTotal > 0);
    const gross = calculated.reduce((sum, row) => sum + row.gross, 0);
    const market = calculated.reduce((sum, row) => sum + row.market, 0);
    const mastitis = calculated.reduce((sum, row) => sum + row.mastitis, 0);
    const heads = calculated.reduce((sum, row) => sum + row.heads, 0);
    const fatWeighted = calculated.reduce((sum, row) => sum + row.market * row.fat, 0);
    const soldPlant = calculated.reduce((sum, row) => sum + row.soldPlant, 0);
    const soldCalves = calculated.reduce((sum, row) => sum + row.soldCalves, 0);
    const soldInternal = calculated.reduce((sum, row) => sum + row.soldInternal, 0);
    const soldOther = calculated.reduce((sum, row) => sum + row.soldOther, 0);
    const soldTotal = soldPlant + soldCalves + soldInternal + soldOther;
    const revenue = calculated.reduce((sum, row) => sum + row.revenue, 0);

    return {
      days: calculated.length,
      gross,
      market,
      mastitis,
      avgMilk: heads ? gross / heads : 0,
      avgFat: market ? fatWeighted / market : 0,
      mastitisPct: gross ? (mastitis / gross) * 100 : 0,
      soldPlant,
      soldCalves,
      soldInternal,
      soldOther,
      soldTotal,
      notDistributed: market - soldTotal,
      revenue,
    };
  }, [rows]);

  const monthComparison = useMemo(() => {
    return MONTHS.map((month, index) => {
      let fact2026 = history2026Base[index] ?? { gross: 0, mastitis: 0, market: 0, fat: 0 };

      if (selectedYear === 2026 && selectedMonth === index && summary.gross > 0) {
        fact2026 = {
          gross: summary.gross,
          mastitis: summary.mastitis,
          market: summary.market,
          fat: summary.avgFat,
        };
      }

      const gross2024 = history2024[index] ?? 0;
      const gross2025 = history2025[index] ?? 0;
      const gross2026 = fact2026.gross;

      return {
        month,
        gross2024,
        gross2025,
        gross2026,
        market2026: fact2026.market,
        mastitis2026: fact2026.mastitis,
        fat2026: fact2026.fat,
        changeTo2024: gross2024 && gross2026 ? ((gross2026 - gross2024) / gross2024) * 100 : 0,
        changeTo2025: gross2025 && gross2026 ? ((gross2026 - gross2025) / gross2025) * 100 : 0,
        mastitisPct2026: gross2026 ? (fact2026.mastitis / gross2026) * 100 : 0,
      };
    });
  }, [selectedMonth, selectedYear, summary]);

  const dailyGrossData = rows
    .map((row) => ({ label: row.date.slice(8), value: calcRow(row).gross }))
    .filter((item) => item.value > 0);

  const salesData = [
    { label: "Молокозавод", value: summary.soldPlant },
    { label: "Телята", value: summary.soldCalves },
    { label: "Внутреннее", value: summary.soldInternal },
    { label: "Прочее", value: summary.soldOther },
  ].filter((item) => item.value > 0);

  const monthLabel = `${MONTHS[selectedMonth]} ${selectedYear}`;

  function updateRow(index: number, field: keyof MilkRow, value: string) {
    setRows((current) => {
      const copy = [...current];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function updateSelected(field: keyof MilkRow, value: string) {
    updateRow(selectedDay, field, value);
  }

  function saveMonth() {
    const stamp = new Date().toLocaleString("ru-RU");
    setSavedAt(stamp);

    try {
      window.localStorage.setItem(
        storageKey(selectedYear, selectedMonth),
        JSON.stringify({ rows, savedAt: stamp })
      );
    } catch {}
  }

  function resetMonth() {
    setRows(buildMonthRows(selectedYear, selectedMonth));
    setSavedAt("");
    try {
      window.localStorage.removeItem(storageKey(selectedYear, selectedMonth));
    } catch {}
  }

  if (!ready) {
    return <main className="page">Проверка доступа...</main>;
  }

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand-row">
          <div className="brand-mark">М</div>
          <div>
            <div className="eyebrow">МТФ Ясная Поляна</div>
            <h1 className="title">Молоко</h1>
          </div>
        </div>

        <div className="header-actions">
          <Link className="btn" href="/dashboard">
            На главный экран
          </Link>
          <button className="btn btn-primary" type="button" onClick={saveMonth}>
            Сохранить
          </button>
        </div>
      </header>

      <div className="container">
        <section className="panel">
          <div className="filters">
            <div className="field">
              <label>Месяц</label>
              <select className="select" value={selectedMonth} onChange={(event) => setSelectedMonth(Number(event.target.value))}>
                {MONTHS.map((month, index) => (
                  <option value={index} key={month}>{month}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Год</label>
              <select className="select" value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))}>
                {YEARS.map((year) => (
                  <option value={year} key={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>День</label>
              <select className="select" value={selectedDay} onChange={(event) => setSelectedDay(Number(event.target.value))}>
                {rows.map((row, index) => (
                  <option value={index} key={row.date}>{row.date}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Состояние</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn btn-primary" type="button" onClick={saveMonth}>Сохранить</button>
                <button className="btn btn-danger" type="button" onClick={resetMonth}>Сбросить месяц</button>
              </div>
            </div>
          </div>

          <p className="muted" style={{ marginBottom: 0 }}>
            {savedAt ? `Последнее сохранение: ${savedAt}` : "Данные сохраняются локально в браузере."}
          </p>
        </section>

        <section className="tabs">
          <button className={tab === "summary" ? "btn btn-primary" : "btn"} onClick={() => setTab("summary")} type="button">
            Сводка
          </button>
          <button className={tab === "extended" ? "btn btn-primary" : "btn"} onClick={() => setTab("extended")} type="button">
            Расширенный отчёт
          </button>
        </section>

        <section className="kpi-grid">
          <Kpi title="Валовый надой" value={`${fmt(summary.gross)} л`} note={`${summary.days} дней с данными`} />
          <Kpi title="Товарное молоко" value={`${fmt(summary.market)} л`} note={summary.gross ? `${pct((summary.market / summary.gross) * 100)} от вала` : "нет данных"} />
          <Kpi title="Мастит" value={`${fmt(summary.mastitis)} л`} note={pct(summary.mastitisPct)} />
          <Kpi title="Средний удой" value={`${fmt(summary.avgMilk, 1)} л`} note="по заполненным дням" />
          <Kpi title="Средняя жирность" value={`${fmt(summary.avgFat, 2)} %`} note="взвешенно по товарному" />
          <Kpi title="Продано на завод" value={`${fmt(summary.soldPlant)} л`} note={summary.revenue ? `${fmt(summary.revenue)} тг` : "выручка появится после цены"} />
        </section>

        {tab === "summary" ? (
          <>
            <section className="panel">
              <h2 className="panel-title">Сводка за день — {selectedRow.date}</h2>

              <div className="data-grid">
                <div className="form-card">
                  <h3>Ёлочка</h3>
                  <div className="form-card-grid">
                    <Input label="Количество голов" value={selectedRow.elHeads} onChange={(value) => updateSelected("elHeads", value)} />
                    <Input label="Танкер, л" value={selectedRow.elTank} onChange={(value) => updateSelected("elTank", value)} />
                    <Input label="Мастит, л" value={selectedRow.elMastitis} onChange={(value) => updateSelected("elMastitis", value)} />
                    <Input label="Жир, %" value={selectedRow.elFat} onChange={(value) => updateSelected("elFat", value)} step="0.1" />
                  </div>
                  <p className="muted">Средний удой: {fmt(selectedCalc.elAvg, 1)} л/гол</p>
                </div>

                <div className="form-card">
                  <h3>Карусель</h3>
                  <div className="form-card-grid">
                    <Input label="Количество голов" value={selectedRow.carHeads} onChange={(value) => updateSelected("carHeads", value)} />
                    <Input label="Танкер, л" value={selectedRow.carTank} onChange={(value) => updateSelected("carTank", value)} />
                    <Input label="Мастит, л" value={selectedRow.carMastitis} onChange={(value) => updateSelected("carMastitis", value)} />
                    <Input label="Жир, %" value={selectedRow.carFat} onChange={(value) => updateSelected("carFat", value)} step="0.1" />
                  </div>
                  <p className="muted">Средний удой: {fmt(selectedCalc.carAvg, 1)} л/гол</p>
                </div>

                <div className="form-card">
                  <h3>Куда продали молоко</h3>
                  <div className="form-card-grid">
                    <TextInput label="Покупатель / направление" value={selectedRow.buyer} onChange={(value) => updateSelected("buyer", value)} />
                    <Input label="Цена за литр, тг" value={selectedRow.price} onChange={(value) => updateSelected("price", value)} step="0.01" />
                    <Input label="На молокозавод, л" value={selectedRow.soldPlant} onChange={(value) => updateSelected("soldPlant", value)} />
                    <Input label="Телятам, л" value={selectedRow.soldCalves} onChange={(value) => updateSelected("soldCalves", value)} />
                    <Input label="Внутреннее, л" value={selectedRow.soldInternal} onChange={(value) => updateSelected("soldInternal", value)} />
                    <Input label="Прочее, л" value={selectedRow.soldOther} onChange={(value) => updateSelected("soldOther", value)} />
                  </div>
                  <p className="muted">
                    Распределено: {fmt(selectedCalc.soldTotal)} л. Разница к товарному:
                    {" "}
                    {fmt(selectedCalc.notDistributed)} л.
                  </p>
                </div>

                <div className="form-card">
                  <h3>Итог дня</h3>
                  <div className="kpi-grid" style={{ marginBottom: 0 }}>
                    <Kpi title="Вал" value={`${fmt(selectedCalc.gross)} л`} note="танк + мастит" />
                    <Kpi title="Товарное" value={`${fmt(selectedCalc.market)} л`} note="Ёлочка + Карусель" />
                    <Kpi title="% мастита" value={pct(selectedCalc.mastitisPct, 2)} note={`${fmt(selectedCalc.mastitis)} л`} />
                    <Kpi title="Выручка" value={`${fmt(selectedCalc.revenue)} тг`} note="по цене за литр" />
                  </div>
                </div>
              </div>
            </section>

            <section className="panel">
              <h2 className="panel-title">Комментарий за день</h2>
              <input
                className="input"
                value={selectedRow.comment}
                onChange={(event) => updateSelected("comment", event.target.value)}
                placeholder="Например: снижение по карусели, перебой с приёмкой, часть молока ушла телятам..."
              />
            </section>

            <section className="panel">
              <h2 className="panel-title">Быстрая статистика по продажам за месяц</h2>
              {salesData.length ? <HorizontalBars data={salesData} /> : <p className="muted">Нет данных по распределению молока.</p>}
            </section>
          </>
        ) : null}

        {tab === "extended" ? (
          <>
            <section className="panel">
              <h2 className="panel-title">Графики — {monthLabel}</h2>
              <div className="chart-grid">
                <div className="chart-box">
                  <h3>Валовый надой по дням</h3>
                  <BarChart data={dailyGrossData} />
                </div>

                <div className="chart-box">
                  <h3>Сравнение валового надоя по месяцам: 2024 / 2025 / 2026</h3>
                  <LineChart
                    data={monthComparison.map((month) => ({
                      label: month.month.slice(0, 3),
                      v2024: month.gross2024,
                      v2025: month.gross2025,
                      v2026: month.gross2026,
                    }))}
                  />
                </div>

                <div className="chart-box">
                  <h3>Куда распределено товарное молоко</h3>
                  {salesData.length ? <HorizontalBars data={salesData} /> : <p className="muted">Нет данных по распределению молока.</p>}
                </div>
              </div>
            </section>

            <section className="panel">
              <h2 className="panel-title">Расширенная таблица за месяц</h2>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th rowSpan={2}>Дата</th>
                      <th colSpan={5}>Ёлочка</th>
                      <th colSpan={5}>Карусель</th>
                      <th colSpan={7}>Итог и продажа</th>
                      <th rowSpan={2}>Комментарий</th>
                    </tr>
                    <tr>
                      <th>Голов</th>
                      <th>Танк</th>
                      <th>Мастит</th>
                      <th>Удой/гол</th>
                      <th>Жир</th>
                      <th>Голов</th>
                      <th>Танк</th>
                      <th>Мастит</th>
                      <th>Удой/гол</th>
                      <th>Жир</th>
                      <th>Товарное</th>
                      <th>Мастит</th>
                      <th>Вал</th>
                      <th>Жир общий</th>
                      <th>Покупатель</th>
                      <th>Завод, л</th>
                      <th>Выручка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => {
                      const calc = calcRow(row);

                      return (
                        <tr key={row.date}>
                          <td>{row.date}</td>
                          <Edit value={row.elHeads} onChange={(value) => updateRow(index, "elHeads", value)} />
                          <Edit value={row.elTank} onChange={(value) => updateRow(index, "elTank", value)} />
                          <Edit value={row.elMastitis} onChange={(value) => updateRow(index, "elMastitis", value)} />
                          <td>{calc.elAvg ? fmt(calc.elAvg, 1) : ""}</td>
                          <Edit value={row.elFat} onChange={(value) => updateRow(index, "elFat", value)} step="0.1" />

                          <Edit value={row.carHeads} onChange={(value) => updateRow(index, "carHeads", value)} />
                          <Edit value={row.carTank} onChange={(value) => updateRow(index, "carTank", value)} />
                          <Edit value={row.carMastitis} onChange={(value) => updateRow(index, "carMastitis", value)} />
                          <td>{calc.carAvg ? fmt(calc.carAvg, 1) : ""}</td>
                          <Edit value={row.carFat} onChange={(value) => updateRow(index, "carFat", value)} step="0.1" />

                          <td>{calc.market ? fmt(calc.market) : ""}</td>
                          <td>{calc.mastitis ? fmt(calc.mastitis) : ""}</td>
                          <td><strong>{calc.gross ? fmt(calc.gross) : ""}</strong></td>
                          <td>{calc.fat ? fmt(calc.fat, 2) : ""}</td>
                          <td>
                            <input className="table-input" style={{ width: 130 }} value={row.buyer} onChange={(event) => updateRow(index, "buyer", event.target.value)} />
                          </td>
                          <Edit value={row.soldPlant} onChange={(value) => updateRow(index, "soldPlant", value)} />
                          <td>{calc.revenue ? fmt(calc.revenue) : ""}</td>
                          <td>
                            <input className="table-input" style={{ width: 190 }} value={row.comment} onChange={(event) => updateRow(index, "comment", event.target.value)} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel">
              <h2 className="panel-title">Сравнение по месяцам</h2>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Месяц</th>
                      <th>Вал 2024</th>
                      <th>Вал 2025</th>
                      <th>Вал 2026</th>
                      <th>2026 к 2024</th>
                      <th>2026 к 2025</th>
                      <th>Товарное 2026</th>
                      <th>Мастит 2026</th>
                      <th>% мастита</th>
                      <th>Жир</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthComparison.map((month) => (
                      <tr key={month.month}>
                        <td>{month.month}</td>
                        <td>{fmt(month.gross2024)}</td>
                        <td>{fmt(month.gross2025)}</td>
                        <td><strong>{month.gross2026 ? fmt(month.gross2026) : ""}</strong></td>
                        <td>{month.changeTo2024 ? pct(month.changeTo2024) : ""}</td>
                        <td>{month.changeTo2025 ? pct(month.changeTo2025) : ""}</td>
                        <td>{month.market2026 ? fmt(month.market2026) : ""}</td>
                        <td>{month.mastitis2026 ? fmt(month.mastitis2026) : ""}</td>
                        <td>{month.mastitisPct2026 ? pct(month.mastitisPct2026, 2) : ""}</td>
                        <td>{month.fat2026 ? fmt(month.fat2026, 2) : ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  step = "1",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  step?: string;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input className="input" type="number" step={step} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input className="input" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function Edit({
  value,
  onChange,
  step = "1",
}: {
  value: string;
  onChange: (value: string) => void;
  step?: string;
}) {
  return (
    <td>
      <input className="table-input" type="number" step={step} value={value} onChange={(event) => onChange(event.target.value)} />
    </td>
  );
}

function Kpi({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="kpi-card">
      <small>{title}</small>
      <strong>{value}</strong>
      <span>{note}</span>
    </div>
  );
}

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  if (!data.length) {
    return <p className="muted">Нет данных для графика.</p>;
  }

  const width = 900;
  const height = 270;
  const left = 44;
  const bottom = 38;
  const top = 24;
  const chartHeight = height - top - bottom;
  const chartWidth = width - left - 22;
  const max = Math.max(...data.map((item) => item.value), 1);
  const gap = 8;
  const barWidth = Math.max(14, chartWidth / data.length - gap);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
      <line x1={left} y1={height - bottom} x2={width - 20} y2={height - bottom} stroke="#334155" />
      {data.map((item, index) => {
        const h = (item.value / max) * chartHeight;
        const x = left + index * (barWidth + gap);
        const y = height - bottom - h;

        return (
          <g key={item.label}>
            <rect x={x} y={y} width={barWidth} height={h} rx="6" fill="#22c55e" opacity="0.9" />
            <text x={x + barWidth / 2} y={height - 12} textAnchor="middle" fill="#9fb0c7" fontSize="12">
              {item.label}
            </text>
          </g>
        );
      })}
      <text x={left} y="16" fill="#cbd5e1" fontSize="13">
        Максимум: {fmt(max)} л
      </text>
    </svg>
  );
}

function LineChart({
  data,
}: {
  data: { label: string; v2024: number; v2025: number; v2026: number }[];
}) {
  const width = 920;
  const height = 320;
  const left = 52;
  const right = 30;
  const top = 28;
  const bottom = 42;

  const values = data.flatMap((item) => [item.v2024, item.v2025, item.v2026]).filter((value) => value > 0);
  const max = Math.max(...values, 1);

  function x(index: number) {
    return left + (index * (width - left - right)) / Math.max(data.length - 1, 1);
  }

  function y(value: number) {
    const chartHeight = height - top - bottom;
    return height - bottom - (value / max) * chartHeight;
  }

  function line(key: "v2024" | "v2025" | "v2026") {
    return data
      .map((item, index) => (item[key] > 0 ? `${x(index)},${y(item[key])}` : ""))
      .filter(Boolean)
      .join(" ");
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
      <line x1={left} y1={height - bottom} x2={width - right} y2={height - bottom} stroke="#334155" />
      <line x1={left} y1={top} x2={left} y2={height - bottom} stroke="#334155" />

      <polyline points={line("v2024")} fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={line("v2025")} fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={line("v2026")} fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

      {data.map((item, index) => (
        <text key={item.label} x={x(index)} y={height - 14} textAnchor="middle" fill="#9fb0c7" fontSize="12">
          {item.label}
        </text>
      ))}

      <text x={left} y="16" fill="#cbd5e1" fontSize="13">
        Максимум: {fmt(max)} л
      </text>

      <g transform="translate(610, 14)">
        <Legend color="#94a3b8" text="2024" />
        <Legend color="#60a5fa" text="2025" x={92} />
        <Legend color="#22c55e" text="2026" x={184} />
      </g>
    </svg>
  );
}

function HorizontalBars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {data.map((item) => (
        <div key={item.label}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
            <span>{item.label}</span>
            <strong>{fmt(item.value)} л</strong>
          </div>
          <div style={{ height: 14, background: "#0b1220", borderRadius: 999, overflow: "hidden", border: "1px solid #334155" }}>
            <div style={{ width: `${(item.value / max) * 100}%`, height: "100%", background: "linear-gradient(90deg, #86efac, #22c55e)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Legend({ color, text, x = 0 }: { color: string; text: string; x?: number }) {
  return (
    <g transform={`translate(${x}, 0)`}>
      <rect x="0" y="0" width="18" height="10" rx="4" fill={color} />
      <text x="25" y="10" fill="#cbd5e1" fontSize="13">
        {text}
      </text>
    </g>
  );
}
