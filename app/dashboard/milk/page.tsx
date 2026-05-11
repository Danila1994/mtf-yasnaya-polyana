"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Delivery = {
  id: string;
  date: string;
  buyer: string;
  product: string;
  liters: string;
  fat: string;
  price: string;
  status: "Доставлено" | "В пути" | "План" | "Задержка";
  route: string;
};

type DayMilk = {
  date: string;
  elHeads: number;
  elTank: number;
  elMastitis: number;
  elFat: number;
  carHeads: number;
  carTank: number;
  carMastitis: number;
  carFat: number;
  deliveries: Delivery[];
  comment?: string;
  status?: "Черновик" | "Проверено" | "Закрыто";
  recorder?: string;
};

type MonthFact = {
  month: string;
  year: number;
  gross: number;
  market: number;
  mastitis: number;
  fat: number;
  protein: number;
  revenue: number;
};

type Tab = "input" | "overview" | "archive" | "plants" | "forecast";

const LOGIN_KEY = "mtf-auth";
const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const SHORT_MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
const BASE_FAT = 3.5;

const historicalRows: MonthFact[] = [
  { month: "Январь", year: 2024, gross: 439847, market: 421300, mastitis: 18547, fat: 3.72, protein: 3.18, revenue: 22539000 },
  { month: "Февраль", year: 2024, gross: 429615, market: 411740, mastitis: 17875, fat: 3.75, protein: 3.19, revenue: 22072100 },
  { month: "Март", year: 2024, gross: 562796, market: 540430, mastitis: 22366, fat: 3.78, protein: 3.20, revenue: 29573100 },
  { month: "Апрель", year: 2024, gross: 694338, market: 668120, mastitis: 26218, fat: 3.79, protein: 3.20, revenue: 37244500 },
  { month: "Май", year: 2024, gross: 827988, market: 798210, mastitis: 29778, fat: 3.80, protein: 3.21, revenue: 45295700 },
  { month: "Июнь", year: 2024, gross: 827622, market: 800320, mastitis: 27302, fat: 3.82, protein: 3.21, revenue: 46110100 },
  { month: "Июль", year: 2024, gross: 858586, market: 833060, mastitis: 25526, fat: 3.83, protein: 3.22, revenue: 48690100 },
  { month: "Август", year: 2024, gross: 809062, market: 785090, mastitis: 23972, fat: 3.84, protein: 3.22, revenue: 46522100 },
  { month: "Сентябрь", year: 2024, gross: 720740, market: 698010, mastitis: 22730, fat: 3.86, protein: 3.23, revenue: 42101100 },
  { month: "Октябрь", year: 2024, gross: 705869, market: 684300, mastitis: 21569, fat: 3.87, protein: 3.23, revenue: 41810100 },
  { month: "Ноябрь", year: 2024, gross: 606174, market: 585490, mastitis: 20684, fat: 3.88, protein: 3.24, revenue: 36210100 },
  { month: "Декабрь", year: 2024, gross: 601676, market: 581330, mastitis: 20346, fat: 3.89, protein: 3.24, revenue: 36501100 },

  { month: "Январь", year: 2025, gross: 583946, market: 561410, mastitis: 22536, fat: 3.84, protein: 3.22, revenue: 35210400 },
  { month: "Февраль", year: 2025, gross: 575915, market: 553200, mastitis: 22715, fat: 3.85, protein: 3.23, revenue: 34800100 },
  { month: "Март", year: 2025, gross: 678798, market: 654900, mastitis: 23898, fat: 3.87, protein: 3.23, revenue: 41702100 },
  { month: "Апрель", year: 2025, gross: 748698, market: 725100, mastitis: 23598, fat: 3.88, protein: 3.24, revenue: 46610000 },
  { month: "Май", year: 2025, gross: 887403, market: 861520, mastitis: 25883, fat: 3.86, protein: 3.24, revenue: 55920800 },
  { month: "Июнь", year: 2025, gross: 855385, market: 830200, mastitis: 25185, fat: 3.87, protein: 3.25, revenue: 54550900 },
  { month: "Июль", year: 2025, gross: 952681, market: 925700, mastitis: 26981, fat: 3.88, protein: 3.25, revenue: 61210200 },
  { month: "Август", year: 2025, gross: 988164, market: 960330, mastitis: 27834, fat: 3.89, protein: 3.26, revenue: 64250100 },
  { month: "Сентябрь", year: 2025, gross: 964231, market: 937010, mastitis: 27221, fat: 3.90, protein: 3.26, revenue: 63420100 },
  { month: "Октябрь", year: 2025, gross: 1017140, market: 988600, mastitis: 28540, fat: 3.91, protein: 3.27, revenue: 68410200 },
  { month: "Ноябрь", year: 2025, gross: 993719, market: 965430, mastitis: 28289, fat: 3.92, protein: 3.27, revenue: 67450300 },
  { month: "Декабрь", year: 2025, gross: 978987, market: 950600, mastitis: 28387, fat: 3.91, protein: 3.27, revenue: 66790100 },

  { month: "Январь", year: 2026, gross: 1001889, market: 977444, mastitis: 24445, fat: 4.20, protein: 3.27, revenue: 57319100 },
  { month: "Февраль", year: 2026, gross: 877211, market: 844716, mastitis: 32495, fat: 4.30, protein: 3.28, revenue: 50890300 },
  { month: "Март", year: 2026, gross: 1003355, market: 964450, mastitis: 38905, fat: 4.20, protein: 3.28, revenue: 58690100 },
  { month: "Апрель", year: 2026, gross: 1057642, market: 1004602, mastitis: 53040, fat: 4.00, protein: 3.29, revenue: 62101000 },
];

const seedDays: DayMilk[] = [
  day("2026-05-01", 245, 3983, 0, 4.5, 1050, 31567, 550, 3.9),
  day("2026-05-02", 245, 3875, 0, 4.3, 1050, 32153, 520, 3.8),
  day("2026-05-03", 245, 3929, 0, 4.5, 1050, 32252, 510, 3.9),
  day("2026-05-04", 245, 3966, 0, 4.5, 1050, 32241, 610, 3.8),
  day("2026-05-05", 245, 4131, 0, 4.3, 1050, 32767, 590, 3.9),
  day("2026-05-06", 245, 3996, 0, 4.5, 1050, 31946, 600, 3.9),
  day("2026-05-07", 265, 4394, 0, 4.4, 1083, 30934, 540, 3.8),
  day("2026-05-08", 265, 4374, 0, 4.3, 1083, 30945, 740, 3.9),
  day("2026-05-09", 265, 4260, 0, 4.3, 1083, 31460, 720, 3.88),
  day("2026-05-10", 265, 4310, 0, 4.4, 1083, 32080, 690, 3.91),
  day("2026-05-11", 265, 4210, 0, 4.3, 1083, 31020, 760, 3.90),
  day("2026-05-12", 265, 4380, 0, 4.4, 1083, 31830, 710, 3.92),
];

function day(
  date: string,
  elHeads: number,
  elTank: number,
  elMastitis: number,
  elFat: number,
  carHeads: number,
  carTank: number,
  carMastitis: number,
  carFat: number
): DayMilk {
  const market = elTank + carTank;
  const buyers = [
    { buyer: "Завод Север", share: 0.39, price: 56.2 },
    { buyer: "Завод Тайынша", share: 0.28, price: 55.8 },
    { buyer: "Завод Кокше", share: 0.19, price: 55.1 },
    { buyer: "Телятам", share: 0.09, price: 0 },
    { buyer: "Внутренние нужды", share: 0.05, price: 0 },
  ];

  return {
    date,
    status: "Проверено",
    recorder: "учетчик",
    elHeads,
    elTank,
    elMastitis,
    elFat,
    carHeads,
    carTank,
    carMastitis,
    carFat,
    deliveries: buyers.map((buyer, index) => ({
      id: `${date}-${index}`,
      date,
      buyer: buyer.buyer,
      product: buyer.buyer === "Телятам" || buyer.buyer === "Внутренние нужды" ? "Молоко" : "Товарное молоко",
      liters: String(Math.round(market * buyer.share)),
      fat: String(index === 3 ? 3.45 : ((elFat + carFat) / 2).toFixed(2)),
      price: String(buyer.price),
      status: index < 3 ? "Доставлено" : "План",
      route: buyer.buyer === "Телятам" ? "Ферма → телятник" : `Ясная Поляна → ${buyer.buyer}`,
    })),
  };
}

function emptyDay(date: string): DayMilk {
  return {
    date,
    status: "Черновик",
    recorder: "",
    elHeads: 0,
    elTank: 0,
    elMastitis: 0,
    elFat: 0,
    carHeads: 0,
    carTank: 0,
    carMastitis: 0,
    carFat: 0,
    deliveries: [],
  };
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

function basisKg(weight: number, fat: number) {
  if (!weight || !fat) return 0;
  return weight * fat / BASE_FAT;
}

function calcDay(dayItem: DayMilk) {
  const elGross = dayItem.elTank + dayItem.elMastitis;
  const carGross = dayItem.carTank + dayItem.carMastitis;
  const heads = dayItem.elHeads + dayItem.carHeads;
  const market = dayItem.elTank + dayItem.carTank;
  const mastitis = dayItem.elMastitis + dayItem.carMastitis;
  const gross = market + mastitis;
  const fat = market ? (dayItem.elTank * dayItem.elFat + dayItem.carTank * dayItem.carFat) / market : 0;
  const basis = basisKg(market, fat);
  const deliveriesTotal = dayItem.deliveries.reduce((sum, delivery) => sum + toNum(delivery.liters), 0);
  const deliveriesBasis = dayItem.deliveries.reduce((sum, delivery) => sum + basisKg(toNum(delivery.liters), toNum(delivery.fat)), 0);
  const revenue = dayItem.deliveries.reduce((sum, delivery) => sum + basisKg(toNum(delivery.liters), toNum(delivery.fat)) * toNum(delivery.price), 0);
  const notDistributed = market - deliveriesTotal;
  const notDistributedBasis = basis - deliveriesBasis;
  const diffPct = market ? Math.abs(notDistributed) / market * 100 : 0;

  return {
    elGross,
    carGross,
    heads,
    market,
    mastitis,
    gross,
    fat,
    basis,
    avg: heads ? gross / heads : 0,
    mastitisPct: gross ? (mastitis / gross) * 100 : 0,
    deliveriesTotal,
    deliveriesBasis,
    notDistributed,
    notDistributedBasis,
    diffPct,
    revenue,
  };
}

function monthIndex(month: string) {
  return MONTHS.indexOf(month);
}

function storageKey() {
  return "mtf-v63-milk-days";
}

function historyStorageKey() {
  return "mtf-v63-milk-history";
}

export default function MilkPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("input");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [days, setDays] = useState<DayMilk[]>(seedDays);
  const [historyRowsState, setHistoryRowsState] = useState<MonthFact[]>(historicalRows);
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem(LOGIN_KEY) !== "yes") {
      router.replace("/");
      return;
    }

    setReady(true);
  }, [router]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey());
      if (raw) {
        const parsed = JSON.parse(raw) as { days?: DayMilk[]; savedAt?: string };
        if (parsed.days?.length) {
          setDays(parsed.days);
          setSavedAt(parsed.savedAt ?? "");
        }
      }
      const rawHistory = window.localStorage.getItem(historyStorageKey());
      if (rawHistory) {
        const parsedHistory = JSON.parse(rawHistory) as MonthFact[];
        if (parsedHistory.length) setHistoryRowsState(parsedHistory);
      }
    } catch {}
  }, []);

  const monthFact = useMemo(() => {
    const dayCalcs = days.map(calcDay);
    const gross = dayCalcs.reduce((sum, item) => sum + item.gross, 0);
    const market = dayCalcs.reduce((sum, item) => sum + item.market, 0);
    const mastitis = dayCalcs.reduce((sum, item) => sum + item.mastitis, 0);
    const revenue = dayCalcs.reduce((sum, item) => sum + item.revenue, 0);
    const basis = dayCalcs.reduce((sum, item) => sum + item.basis, 0);
    const fatWeighted = days.reduce((sum, item) => sum + calcDay(item).market * calcDay(item).fat, 0);
    const headsSum = dayCalcs.reduce((sum, item) => sum + item.heads, 0);

    return {
      gross,
      market,
      mastitis,
      revenue,
      basis,
      avgFat: market ? fatWeighted / market : 0,
      avgMilk: headsSum ? gross / headsSum : 0,
      mastitisPct: gross ? (mastitis / gross) * 100 : 0,
      deliveries: days.flatMap((item) => item.deliveries),
    };
  }, [days]);

  const allMonths = useMemo(() => {
    const may2026: MonthFact = {
      month: "Май",
      year: 2026,
      gross: monthFact.gross || 1248760,
      market: monthFact.market || 1185430,
      mastitis: monthFact.mastitis || 31000,
      fat: monthFact.avgFat || 3.94,
      protein: 3.28,
      revenue: monthFact.revenue || 72345860,
    };

    return [...historyRowsState.filter((row) => !(row.year === 2026 && row.month === "Май")), may2026];
  }, [monthFact, historyRowsState]);

  const selectedDay = days[selectedDayIndex] ?? days[0] ?? emptyDay("2026-05-01");
  const selectedDayCalc = calcDay(selectedDay);

  function save() {
    const stamp = new Date().toLocaleString("ru-RU");
    setSavedAt(stamp);
    try {
      window.localStorage.setItem(storageKey(), JSON.stringify({ days, savedAt: stamp }));
      window.localStorage.setItem(historyStorageKey(), JSON.stringify(historyRowsState));
    } catch {}
  }

  function reset() {
    setDays(seedDays);
    setHistoryRowsState(historicalRows);
    setSelectedDayIndex(0);
    setSavedAt("");
    try {
      window.localStorage.removeItem(storageKey());
      window.localStorage.removeItem(historyStorageKey());
    } catch {}
  }

  function updateDelivery(index: number, field: keyof Delivery, value: string) {
    setDays((current) => current.map((dayItem, dayIndex) => {
      if (dayIndex !== selectedDayIndex) return dayItem;

      return {
        ...dayItem,
        deliveries: dayItem.deliveries.map((delivery, deliveryIndex) => (
          deliveryIndex === index ? { ...delivery, [field]: value } : delivery
        )),
      };
    }));
  }

  function addDelivery() {
    setDays((current) => current.map((dayItem, dayIndex) => {
      if (dayIndex !== selectedDayIndex) return dayItem;

      return {
        ...dayItem,
        deliveries: [
          ...dayItem.deliveries,
          {
            id: `${dayItem.date}-${Date.now()}`,
            date: dayItem.date,
            buyer: "",
            product: "Товарное молоко",
            liters: "",
            fat: String(selectedDayCalc.fat.toFixed(2)),
            price: "",
            status: "План",
            route: "",
          },
        ],
      };
    }));
  }

  function removeDelivery(index: number) {
    setDays((current) => current.map((dayItem, dayIndex) => {
      if (dayIndex !== selectedDayIndex) return dayItem;

      return {
        ...dayItem,
        deliveries: dayItem.deliveries.filter((_, deliveryIndex) => deliveryIndex !== index),
      };
    }));
  }

  function addDeliveryByType(type: "plant" | "calves" | "loss") {
    setDays((current) => current.map((dayItem, dayIndex) => {
      if (dayIndex !== selectedDayIndex) return dayItem;
      const calc = calcDay(dayItem);
      const base: Delivery = {
        id: `${dayItem.date}-${Date.now()}`,
        date: dayItem.date,
        buyer: type === "calves" ? "Телятам" : type === "loss" ? "Брак / слив" : "",
        product: type === "loss" ? "Потери" : type === "calves" ? "Молоко" : "Товарное молоко",
        liters: "",
        fat: calc.fat ? String(calc.fat.toFixed(2)) : "",
        price: "",
        status: type === "loss" ? "Задержка" : type === "calves" ? "Доставлено" : "План",
        route: type === "calves" ? "Ферма → телятник" : "",
      };
      return { ...dayItem, deliveries: [...dayItem.deliveries, base] };
    }));
  }

  function updateDayNumber(field: keyof DayMilk, value: string) {
    setDays((current) => current.map((dayItem, dayIndex) => {
      if (dayIndex !== selectedDayIndex) return dayItem;
      return { ...dayItem, [field]: Number(value) || 0 };
    }));
  }

  function updateDayText(field: keyof DayMilk, value: string) {
    setDays((current) => current.map((dayItem, dayIndex) => {
      if (dayIndex !== selectedDayIndex) return dayItem;
      return { ...dayItem, [field]: value };
    }));
  }

  function addNewDay(date: string) {
    if (!date) return;
    const existing = days.findIndex((item) => item.date === date);
    if (existing >= 0) {
      setSelectedDayIndex(existing);
      return;
    }
    const next = [...days, emptyDay(date)].sort((a, b) => a.date.localeCompare(b.date));
    setDays(next);
    setSelectedDayIndex(next.findIndex((item) => item.date === date));
  }

  function updateAnyDay(index: number, field: keyof DayMilk, value: string) {
    setDays((current) => current.map((dayItem, dayIndex) => {
      if (dayIndex !== index) return dayItem;
      return { ...dayItem, [field]: Number(value) || 0 };
    }));
  }

  function addHistoryMonth() {
    setHistoryRowsState((current) => [...current, {
      month: "Май",
      year: 2026,
      gross: 0,
      market: 0,
      mastitis: 0,
      fat: 0,
      protein: 0,
      revenue: 0,
    }]);
  }

  function updateHistoryMonth(index: number, field: keyof MonthFact, value: string) {
    setHistoryRowsState((current) => current.map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      if (field === "month") return { ...item, month: value };
      return { ...item, [field]: Number(value) || 0 };
    }));
  }

  if (!ready) {
    return <main className="page">Проверка доступа...</main>;
  }

  return (
    <main className="page">
      <div className="shell">
        <Sidebar />
        <section className="main">
          <header className="topbar">
            <div>
              <h1 className="title">Молоко</h1>
              <p className="subtitle">
                Расширенный модуль: ввод данных, надой, товарность, заводы, реализация, архив, статистика и прогноз.
              </p>
            </div>
            <div className="actions">
              <select className="select" style={{ width: 240 }} value={selectedDayIndex} onChange={(event) => setSelectedDayIndex(Number(event.target.value))}>
                {days.map((dayItem, index) => <option key={dayItem.date} value={index}>{dayItem.date}</option>)}
              </select>
              <button className="btn btn-soft" type="button" onClick={reset}>Сброс</button>
              <button className="btn btn-primary" type="button" onClick={save}>Сохранить</button>
            </div>
          </header>

          <div className="tabs">
            <button className={tab === "input" ? "tab active" : "tab"} onClick={() => setTab("input")}>Ввод данных</button>
            <button className={tab === "overview" ? "tab active" : "tab"} onClick={() => setTab("overview")}>Обзор</button>
            <button className={tab === "archive" ? "tab active" : "tab"} onClick={() => setTab("archive")}>Архив и статистика</button>
            <button className={tab === "plants" ? "tab active" : "tab"} onClick={() => setTab("plants")}>Заводы и реализация</button>
            <button className={tab === "forecast" ? "tab active" : "tab"} onClick={() => setTab("forecast")}>Прогноз</button>
          </div>

          {savedAt ? <p className="muted">Последнее сохранение: {savedAt}</p> : null}

          {tab === "input" ? (
            <DataInput
              days={days}
              selectedDay={selectedDay}
              selectedDayIndex={selectedDayIndex}
              setSelectedDayIndex={setSelectedDayIndex}
              selectedDayCalc={selectedDayCalc}
              updateDayNumber={updateDayNumber}
              updateDayText={updateDayText}
              updateDelivery={updateDelivery}
              addDelivery={addDelivery}
              addDeliveryByType={addDeliveryByType}
              removeDelivery={removeDelivery}
              addNewDay={addNewDay}
              updateAnyDay={updateAnyDay}
              historyRowsState={historyRowsState}
              addHistoryMonth={addHistoryMonth}
              updateHistoryMonth={updateHistoryMonth}
              save={save}
            />
          ) : null}

          {tab === "overview" ? (
            <Overview
              days={days}
              allMonths={allMonths}
              monthFact={monthFact}
              selectedDay={selectedDay}
              selectedDayCalc={selectedDayCalc}
            />
          ) : null}

          {tab === "archive" ? (
            <Archive allMonths={allMonths} />
          ) : null}

          {tab === "plants" ? (
            <Plants
              days={days}
              deliveries={monthFact.deliveries}
              selectedDay={selectedDay}
              selectedDayCalc={selectedDayCalc}
              updateDelivery={updateDelivery}
              addDelivery={addDelivery}
              removeDelivery={removeDelivery}
            />
          ) : null}

          {tab === "forecast" ? (
            <Forecast allMonths={allMonths} monthFact={monthFact} />
          ) : null}
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
        <Link className="nav-link active" href="/dashboard/milk"><span className="nav-icon">▣</span>Молоко</Link>
        <div className="nav-link"><span className="nav-icon">◎</span>Воспроизводство</div>
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


function DataInput({
  days,
  selectedDay,
  selectedDayIndex,
  setSelectedDayIndex,
  selectedDayCalc,
  updateDayNumber,
  updateDayText,
  updateDelivery,
  addDelivery,
  addDeliveryByType,
  removeDelivery,
  addNewDay,
  updateAnyDay,
  historyRowsState,
  addHistoryMonth,
  updateHistoryMonth,
  save,
}: {
  days: DayMilk[];
  selectedDay: DayMilk;
  selectedDayIndex: number;
  setSelectedDayIndex: (index: number) => void;
  selectedDayCalc: ReturnType<typeof calcDay>;
  updateDayNumber: (field: keyof DayMilk, value: string) => void;
  updateDayText: (field: keyof DayMilk, value: string) => void;
  updateDelivery: (index: number, field: keyof Delivery, value: string) => void;
  addDelivery: () => void;
  addDeliveryByType: (type: "plant" | "calves" | "loss") => void;
  removeDelivery: (index: number) => void;
  addNewDay: (date: string) => void;
  updateAnyDay: (index: number, field: keyof DayMilk, value: string) => void;
  historyRowsState: MonthFact[];
  addHistoryMonth: () => void;
  updateHistoryMonth: (index: number, field: keyof MonthFact, value: string) => void;
  save: () => void;
}) {
  const [mode, setMode] = useState<"current" | "days" | "months">("current");
  const [newDate, setNewDate] = useState(selectedDay.date);
  const diffClass = selectedDayCalc.diffPct <= 1 ? "panel status-good" : selectedDayCalc.diffPct <= 3 ? "panel status-warn" : "panel status-bad";

  return (
    <>
      <section className="panel">
        <h2 className="panel-title">Ввод данных</h2>
        <div className="control-strip">
          <button className={mode === "current" ? "btn btn-primary" : "btn"} type="button" onClick={() => setMode("current")}>Текущий день</button>
          <button className={mode === "days" ? "btn btn-primary" : "btn"} type="button" onClick={() => setMode("days")}>История по дням</button>
          <button className={mode === "months" ? "btn btn-primary" : "btn"} type="button" onClick={() => setMode("months")}>История по месяцам</button>
        </div>
        <p className="muted" style={{ marginBottom: 0 }}>
          Это рабочее место учетчика: сначала заносим данные, потом отчёты строятся автоматически.
        </p>
      </section>

      {mode === "current" ? (
        <>
          <section className="grid-side">
            <div className="panel">
              <h2 className="panel-title">Дата, статус и ответственный</h2>
              <div className="form-grid">
                <div className="field">
                  <label>Выбрать дату</label>
                  <select className="select" value={selectedDayIndex} onChange={(event) => setSelectedDayIndex(Number(event.target.value))}>
                    {days.map((dayItem, index) => <option key={dayItem.date} value={index}>{dayItem.date}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Добавить дату</label>
                  <input className="input" type="date" value={newDate} onChange={(event) => setNewDate(event.target.value)} />
                </div>
                <div className="field">
                  <label>Открыть / создать</label>
                  <button className="btn btn-primary" type="button" onClick={() => addNewDay(newDate)}>Добавить дату</button>
                </div>
                <div className="field">
                  <label>Статус дня</label>
                  <select className="select" value={selectedDay.status ?? "Черновик"} onChange={(event) => updateDayText("status", event.target.value)}>
                    <option>Черновик</option>
                    <option>Проверено</option>
                    <option>Закрыто</option>
                  </select>
                </div>
                <div className="field">
                  <label>Кто внёс</label>
                  <input className="input" value={selectedDay.recorder ?? ""} onChange={(event) => updateDayText("recorder", event.target.value)} />
                </div>
                <div className="field">
                  <label>Сохранение</label>
                  <button className="btn btn-soft" type="button" onClick={save}>Сохранить день</button>
                </div>
              </div>
            </div>

            <div className={diffClass}>
              <h2 className="panel-title">Контроль расхождения</h2>
              <div className="driver-grid" style={{ gridTemplateColumns: "1fr" }}>
                <MiniStat title="Товарное по доению" value={`${fmt(selectedDayCalc.market)} кг`} note="фактический вес" />
                <MiniStat title="Базис по доению" value={`${fmt(selectedDayCalc.basis)} кг`} note={`жир / ${BASE_FAT}`} />
                <MiniStat title="Распределено" value={`${fmt(selectedDayCalc.deliveriesTotal)} кг`} note={`базис: ${fmt(selectedDayCalc.deliveriesBasis)} кг`} />
                <MiniStat title="Разница" value={`${fmt(selectedDayCalc.notDistributed)} кг`} note={`${fmt(selectedDayCalc.diffPct, 2)}% от товарного`} />
              </div>
            </div>
          </section>

          <section className="grid-2">
            <div className="panel">
              <h2 className="panel-title">Надой за день — {selectedDay.date}</h2>
              <div className="grid-2">
                <div>
                  <h3>Ёлочка</h3>
                  <div className="form-grid-2">
                    <NumberField label="Голов" value={selectedDay.elHeads} onChange={(value) => updateDayNumber("elHeads", value)} />
                    <NumberField label="Танк, кг" value={selectedDay.elTank} onChange={(value) => updateDayNumber("elTank", value)} />
                    <NumberField label="Мастит, кг" value={selectedDay.elMastitis} onChange={(value) => updateDayNumber("elMastitis", value)} />
                    <NumberField label="Жир, %" value={selectedDay.elFat} onChange={(value) => updateDayNumber("elFat", value)} step="0.01" />
                  </div>
                </div>
                <div>
                  <h3>Карусель</h3>
                  <div className="form-grid-2">
                    <NumberField label="Голов" value={selectedDay.carHeads} onChange={(value) => updateDayNumber("carHeads", value)} />
                    <NumberField label="Танк, кг" value={selectedDay.carTank} onChange={(value) => updateDayNumber("carTank", value)} />
                    <NumberField label="Мастит, кг" value={selectedDay.carMastitis} onChange={(value) => updateDayNumber("carMastitis", value)} />
                    <NumberField label="Жир, %" value={selectedDay.carFat} onChange={(value) => updateDayNumber("carFat", value)} step="0.01" />
                  </div>
                </div>
              </div>
            </div>

            <div className="panel">
              <h2 className="panel-title">Итог дня</h2>
              <div className="driver-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <MiniStat title="Вал" value={`${fmt(selectedDayCalc.gross)} кг`} note="танк + мастит" />
                <MiniStat title="Товарное" value={`${fmt(selectedDayCalc.market)} кг`} note="фактический вес" />
                <MiniStat title="Базис" value={`${fmt(selectedDayCalc.basis)} кг`} note={`по жирности ${BASE_FAT}%`} />
                <MiniStat title="Мастит" value={`${fmt(selectedDayCalc.mastitis)} кг`} note={pct(selectedDayCalc.mastitisPct, 2)} />
                <MiniStat title="Средний удой" value={`${fmt(selectedDayCalc.avg, 1)} кг`} note="на голову" />
              </div>
            </div>
          </section>

          <DeliveryInputTable
            selectedDay={selectedDay}
            selectedDayCalc={selectedDayCalc}
            updateDelivery={updateDelivery}
            addDelivery={addDelivery}
            addDeliveryByType={addDeliveryByType}
            removeDelivery={removeDelivery}
          />

          <section className="panel">
            <h2 className="panel-title">Комментарий</h2>
            <textarea className="textarea" value={selectedDay.comment ?? ""} onChange={(event) => updateDayText("comment", event.target.value)} />
          </section>
        </>
      ) : null}

      {mode === "days" ? (
        <section className="panel">
          <h2 className="panel-title">Быстрый ввод истории по дням</h2>
          <p className="muted">Для старых данных можно занести дни таблицей. Подробные заводы можно открыть через режим текущего дня.</p>
          <div className="table-wrap">
            <table className="table" style={{ minWidth: 1200 }}>
              <thead>
                <tr><th>Дата</th><th>Голов ёлочка</th><th>Танк ёлочка</th><th>Мастит ёлочка</th><th>Голов карусель</th><th>Танк карусель</th><th>Мастит карусель</th><th>Жир ёлочка</th><th>Жир карусель</th></tr>
              </thead>
              <tbody>
                {days.map((dayItem, index) => (
                  <tr key={dayItem.date}>
                    <td>{dayItem.date}</td>
                    <HistoryCell value={dayItem.elHeads} onChange={(value) => updateAnyDay(index, "elHeads", value)} />
                    <HistoryCell value={dayItem.elTank} onChange={(value) => updateAnyDay(index, "elTank", value)} />
                    <HistoryCell value={dayItem.elMastitis} onChange={(value) => updateAnyDay(index, "elMastitis", value)} />
                    <HistoryCell value={dayItem.carHeads} onChange={(value) => updateAnyDay(index, "carHeads", value)} />
                    <HistoryCell value={dayItem.carTank} onChange={(value) => updateAnyDay(index, "carTank", value)} />
                    <HistoryCell value={dayItem.carMastitis} onChange={(value) => updateAnyDay(index, "carMastitis", value)} />
                    <HistoryCell value={dayItem.elFat} onChange={(value) => updateAnyDay(index, "elFat", value)} step="0.01" />
                    <HistoryCell value={dayItem.carFat} onChange={(value) => updateAnyDay(index, "carFat", value)} step="0.01" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {mode === "months" ? (
        <section className="panel">
          <h2 className="panel-title">Быстрый ввод истории по месяцам <button className="btn btn-primary" type="button" onClick={addHistoryMonth}>Добавить месяц</button></h2>
          <p className="muted">Когда нет подробных данных по дням, заносим месячный итог. Он пойдёт в архив, сравнение годов и прогноз.</p>
          <div className="table-wrap">
            <table className="table" style={{ minWidth: 1080 }}>
              <thead>
                <tr><th>Месяц</th><th>Год</th><th>Вал</th><th>Товарное</th><th>Базис</th><th>Мастит</th><th>Жир</th><th>Белок</th><th>Выручка</th></tr>
              </thead>
              <tbody>
                {historyRowsState.map((item, index) => (
                  <tr key={`${item.year}-${item.month}-${index}`}>
                    <td><select className="table-input" value={item.month} onChange={(event) => updateHistoryMonth(index, "month", event.target.value)}>{MONTHS.map((month) => <option key={month}>{month}</option>)}</select></td>
                    <MonthCell value={item.year} onChange={(value) => updateHistoryMonth(index, "year", value)} />
                    <MonthCell value={item.gross} onChange={(value) => updateHistoryMonth(index, "gross", value)} />
                    <MonthCell value={item.market} onChange={(value) => updateHistoryMonth(index, "market", value)} />
                    <td className="num">{fmt(basisKg(item.market, item.fat))}</td>
                    <MonthCell value={item.mastitis} onChange={(value) => updateHistoryMonth(index, "mastitis", value)} />
                    <MonthCell value={item.fat} onChange={(value) => updateHistoryMonth(index, "fat", value)} step="0.01" />
                    <MonthCell value={item.protein} onChange={(value) => updateHistoryMonth(index, "protein", value)} step="0.01" />
                    <MonthCell value={item.revenue} onChange={(value) => updateHistoryMonth(index, "revenue", value)} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </>
  );
}

function DeliveryInputTable({
  selectedDay,
  selectedDayCalc,
  updateDelivery,
  addDelivery,
  addDeliveryByType,
  removeDelivery,
}: {
  selectedDay: DayMilk;
  selectedDayCalc: ReturnType<typeof calcDay>;
  updateDelivery: (index: number, field: keyof Delivery, value: string) => void;
  addDelivery: () => void;
  addDeliveryByType: (type: "plant" | "calves" | "loss") => void;
  removeDelivery: (index: number) => void;
}) {
  return (
    <section className="panel">
      <h2 className="panel-title">Куда ушло молоко — {selectedDay.date}</h2>
      <p className="muted">Базис считается автоматически: фактический кг × жир / {BASE_FAT}. Цена указывается за 1 кг базиса.</p>
      <div className="control-strip">
        <button className="btn btn-primary" type="button" onClick={() => addDeliveryByType("plant")}>+ Добавить завод</button>
        <button className="btn btn-soft" type="button" onClick={() => addDeliveryByType("calves")}>+ Телятам</button>
        <button className="btn btn-soft" type="button" onClick={() => addDeliveryByType("loss")}>+ Потери</button>
        <button className="btn" type="button" onClick={addDelivery}>+ Пустая строка</button>
      </div>
      <div className="table-wrap">
        <table className="table" style={{ minWidth: 1420 }}>
          <thead>
            <tr><th>Дата</th><th>Получатель / завод</th><th>Тип</th><th className="num">Кг факт</th><th className="num">Жир</th><th className="num">Базис, кг</th><th className="num">Цена за базис</th><th className="num">Сумма по базису</th><th>Маршрут</th><th>Статус</th><th></th></tr>
          </thead>
          <tbody>
            {selectedDay.deliveries.map((delivery, index) => (
              <tr key={delivery.id}>
                <td>{delivery.date}</td>
                <td><input className="table-input" value={delivery.buyer} onChange={(event) => updateDelivery(index, "buyer", event.target.value)} /></td>
                <td><input className="table-input" value={delivery.product} onChange={(event) => updateDelivery(index, "product", event.target.value)} /></td>
                <td><input className="table-input num" type="number" value={delivery.liters} onChange={(event) => updateDelivery(index, "liters", event.target.value)} /></td>
                <td><input className="table-input num" type="number" step="0.01" value={delivery.fat} onChange={(event) => updateDelivery(index, "fat", event.target.value)} /></td>
                <td className="num">{fmt(basisKg(toNum(delivery.liters), toNum(delivery.fat)))}</td>
                <td><input className="table-input num" type="number" step="0.01" value={delivery.price} onChange={(event) => updateDelivery(index, "price", event.target.value)} /></td>
                <td className="num">{fmt(basisKg(toNum(delivery.liters), toNum(delivery.fat)) * toNum(delivery.price))}</td>
                <td><input className="table-input" value={delivery.route} onChange={(event) => updateDelivery(index, "route", event.target.value)} /></td>
                <td><select className="table-input" value={delivery.status} onChange={(event) => updateDelivery(index, "status", event.target.value)}><option>Доставлено</option><option>В пути</option><option>План</option><option>Задержка</option></select></td>
                <td><button className="btn btn-danger" type="button" onClick={() => removeDelivery(index)}>×</button></td>
              </tr>
            ))}
            <tr><td colSpan={3}><strong>Итого за день</strong></td><td className="num"><strong>{fmt(selectedDayCalc.deliveriesTotal)}</strong></td><td className="num">—</td><td className="num"><strong>{fmt(selectedDayCalc.deliveriesBasis)}</strong></td><td className="num">—</td><td className="num"><strong>{fmt(selectedDayCalc.revenue)}</strong></td><td colSpan={3}></td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function NumberField({ label, value, onChange, step = "1" }: { label: string; value: number; onChange: (value: string) => void; step?: string }) {
  return <div className="field"><label>{label}</label><input className="input" type="number" step={step} value={value} onChange={(event) => onChange(event.target.value)} /></div>;
}

function HistoryCell({ value, onChange, step = "1" }: { value: number; onChange: (value: string) => void; step?: string }) {
  return <td><input className="table-input num" type="number" step={step} value={value} onChange={(event) => onChange(event.target.value)} /></td>;
}

function MonthCell({ value, onChange, step = "1" }: { value: number; onChange: (value: string) => void; step?: string }) {
  return <td><input className="table-input num" type="number" step={step} value={value} onChange={(event) => onChange(event.target.value)} /></td>;
}

function Overview({
  days,
  allMonths,
  monthFact,
  selectedDay,
  selectedDayCalc,
}: {
  days: DayMilk[];
  allMonths: MonthFact[];
  monthFact: ReturnType<typeof useMonthFactType>;
  selectedDay: DayMilk;
  selectedDayCalc: ReturnType<typeof calcDay>;
}) {
  const previousMay = allMonths.find((row) => row.year === 2025 && row.month === "Май");
  const changeGross = previousMay ? ((monthFact.gross - previousMay.gross) / previousMay.gross) * 100 : 0;
  const changeMarket = previousMay ? ((monthFact.market - previousMay.market) / previousMay.market) * 100 : 0;
  const deliveryByBuyer = groupDeliveries(monthFact.deliveries);
  const monthComparison = buildMonthComparison(allMonths);

  return (
    <>
      <section className="kpi-grid">
        <Kpi icon="🧴" title="Валовый надой" value={`${fmt(monthFact.gross)} кг`} note={`+${fmt(changeGross, 1)}% к маю 2025`} />
        <Kpi icon="🚛" title="Товарное молоко" value={`${fmt(monthFact.market)} кг`} note={`+${fmt(changeMarket, 1)}% к маю 2025`} />
        <Kpi icon="🐄" title="Средний удой" value={`${fmt(monthFact.avgMilk, 2)} кг`} note="на фуражную корову" />
        <Kpi icon="✚" title="% мастита" value={`${fmt(monthFact.mastitisPct, 2)}%`} note={`${fmt(monthFact.mastitis)} кг`} />
        <Kpi icon="💧" title="Средний жир" value={`${fmt(monthFact.avgFat, 2)}%`} note="взвешенно по товарному" />
        <Kpi icon="₸" title="Выручка" value={`${fmt(monthFact.revenue)} ₸`} note="по поставкам" />
      </section>

      <section className="grid-2">
        <div className="panel">
          <h2 className="panel-title">Динамика надоя: валовый и товарный, кг <span className="badge blue">По дням</span></h2>
          <AreaChart
            series={[
              { name: "Валовый", color: "#22c55e", values: days.map((item) => calcDay(item).gross) },
              { name: "Товарный", color: "#a3e635", values: days.map((item) => calcDay(item).market) },
            ]}
            labels={days.map((item) => item.date.slice(8))}
          />
        </div>

        <div className="panel">
          <h2 className="panel-title">Мастит и потери молока по дням <span className="badge blue">%</span></h2>
          <LineChart
            series={[
              { name: "% мастита", color: "#fb7185", values: days.map((item) => calcDay(item).mastitisPct) },
              { name: "Потери", color: "#60a5fa", values: days.map((item) => Math.max(calcDay(item).mastitisPct - 0.9, 0.2)) },
            ]}
            labels={days.map((item) => item.date.slice(8))}
            percent
          />
        </div>
      </section>

      <section className="grid-3">
        <div className="panel">
          <h2 className="panel-title">Структура реализации молока</h2>
          <DonutChart
            data={deliveryByBuyer.map((item) => ({ label: item.buyer, value: item.liters }))}
            center={`${fmt(monthFact.market)} кг`}
          />
        </div>

        <div className="panel">
          <h2 className="panel-title">Топ заводов по объёму</h2>
          <VerticalBars data={deliveryByBuyer.slice(0, 5).map((item) => ({ label: item.buyer, value: item.liters }))} />
        </div>

        <div className="panel">
          <h2 className="panel-title">Поставки за день <span className="badge">{selectedDay.date}</span></h2>
          <div className="table-wrap">
            <table className="table" style={{ minWidth: 720 }}>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Покупатель</th>
                  <th>Тип</th>
                  <th className="num">Кг факт</th>
                  <th className="num">Жир</th>
                  <th className="num">Базис</th>
                  <th className="num">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {selectedDay.deliveries.map((delivery) => (
                  <tr key={delivery.id}>
                    <td>{delivery.date}</td>
                    <td>{delivery.buyer}</td>
                    <td>{delivery.product}</td>
                    <td className="num">{fmt(toNum(delivery.liters))}</td>
                    <td className="num">{delivery.fat}</td>
                    <td className="num">{fmt(basisKg(toNum(delivery.liters), toNum(delivery.fat)))}</td>
                    <td className="num">{fmt(basisKg(toNum(delivery.liters), toNum(delivery.fat)) * toNum(delivery.price))}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3}><strong>Итого</strong></td>
                  <td className="num"><strong>{fmt(selectedDayCalc.deliveriesTotal)}</strong></td>
                  <td className="num">—</td>
                  <td className="num"><strong>{fmt(selectedDayCalc.deliveriesBasis)}</strong></td>
                  <td className="num"><strong>{fmt(selectedDayCalc.revenue)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid-side">
        <div className="panel">
          <h2 className="panel-title">Сравнение по месяцам 2024 / 2025 / 2026</h2>
          <LineChart
            series={[
              { name: "2024", color: "#94a3b8", values: monthComparison.map((item) => item.y2024) },
              { name: "2025", color: "#22c55e", values: monthComparison.map((item) => item.y2025) },
              { name: "2026", color: "#60a5fa", values: monthComparison.map((item) => item.y2026) },
            ]}
            labels={SHORT_MONTHS}
          />
        </div>

        <div className="panel">
          <h2 className="panel-title">Контроль дня</h2>
          <div className="driver-grid" style={{ gridTemplateColumns: "1fr" }}>
            <MiniStat title="Вал за день" value={`${fmt(selectedDayCalc.gross)} кг`} note="танк + мастит" />
            <MiniStat title="Базис за день" value={`${fmt(selectedDayCalc.basis)} кг`} note={`жир / ${BASE_FAT}`} />
            <MiniStat title="Распределено" value={`${fmt(selectedDayCalc.deliveriesTotal)} кг`} note={`базис: ${fmt(selectedDayCalc.deliveriesBasis)} кг`} />
            <MiniStat title="Выручка за день" value={`${fmt(selectedDayCalc.revenue)} ₸`} note="по базису" />
          </div>
        </div>
      </section>

      <section className="panel insights">
        <h2 className="panel-title">Ключевые выводы для руководства</h2>
        <div className="insight-grid">
          <Insight>Валовый надой за текущий месяц составляет {fmt(monthFact.gross)} кг; динамика выше мая 2025 на {fmt(changeGross, 1)}%.</Insight>
          <Insight>Товарное молоко составляет {fmt(monthFact.market)} кг; контроль распределения по заводам ведётся по каждой поставке.</Insight>
          <Insight>В один день можно фиксировать несколько заводов, внутренние нужды и молоко телятам без потери общей статистики.</Insight>
          <Insight>Доля мастита сейчас {fmt(monthFact.mastitisPct, 2)}%; показатель сразу влияет на товарность и потери молока.</Insight>
          <Insight>Архив нужен не как список файлов, а как база для сравнения месяцев, годов, жирности, белка и выручки.</Insight>
          <Insight>Прогноз по молоку строится от истории, текущего поголовья, отёлов, запусков, выбытия, мастита и кормления.</Insight>
        </div>
      </section>
    </>
  );
}

function Archive({ allMonths }: { allMonths: MonthFact[] }) {
  const latest = allMonths.slice(-8).reverse();

  return (
    <>
      <section className="filters">
        <div className="field">
          <label>Год</label>
          <select className="select"><option>2026</option><option>2025</option><option>2024</option></select>
        </div>
        <div className="field">
          <label>Месяц</label>
          <select className="select"><option>Все месяцы</option><option>Май</option><option>Апрель</option></select>
        </div>
        <div className="field">
          <label>Период</label>
          <select className="select"><option>Янв 2024 — Май 2026</option></select>
        </div>
        <div className="field">
          <label>Сравнить с</label>
          <select className="select"><option>Предыдущий год</option><option>Предыдущий месяц</option></select>
        </div>
        <button className="btn">Сбросить фильтры</button>
      </section>

      <section className="grid-side">
        <div className="panel">
          <h2 className="panel-title">Архив отчётов</h2>
          <div className="archive-cards">
            {latest.slice(0, 3).map((item, index) => (
              <div className={index === 0 ? "archive-card active" : "archive-card"} key={`${item.month}-${item.year}`}>
                <h3 style={{ margin: "0 0 10px" }}>{item.month} {item.year}</h3>
                <p className="muted">Вал: <strong>{fmt(item.gross)} кг</strong></p>
                <p className="muted">Товарное: <strong>{fmt(item.market)} кг</strong></p>
                <p className="muted">Выручка: <strong>{fmt(item.revenue)} ₸</strong></p>
                <button className="btn btn-soft" type="button" style={{ width: "100%" }}>Открыть отчёт</button>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2 className="panel-title">Выбор года</h2>
          <div className="year-grid">
            {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((year) => (
              <button className={year === 2026 ? "year-btn active" : "year-btn"} key={year}>{year}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid-side">
        <div className="panel">
          <h2 className="panel-title">История надоя и реализации</h2>
          <LineChart
            labels={allMonths.map((item) => `${item.month.slice(0, 3)} ${String(item.year).slice(2)}`)}
            series={[
              { name: "Вал", color: "#22c55e", values: allMonths.map((item) => item.gross) },
              { name: "Товарное", color: "#a3e635", values: allMonths.map((item) => item.market) },
              { name: "Выручка", color: "#60a5fa", values: allMonths.map((item) => item.revenue / 70) },
            ]}
          />
        </div>

        <div className="panel">
          <h2 className="panel-title">Интенсивность производства</h2>
          <Heatmap />
        </div>
      </section>

      <section className="grid-side">
        <div className="panel">
          <h2 className="panel-title">Архивные показатели</h2>
          <MonthTable rows={latest} />
        </div>

        <div className="panel">
          <h2 className="panel-title">Быстрая статистика</h2>
          <div className="driver-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <MiniStat title="Средний вал/мес" value={`${fmt(avg(latest.map((i) => i.gross)))} кг`} note="+4,2% к периоду" />
            <MiniStat title="Среднее товарное" value={`${fmt(avg(latest.map((i) => i.market)))} кг`} note="+4,6% к периоду" />
            <MiniStat title="Средний жир" value={`${fmt(avg(latest.map((i) => i.fat)), 2)}%`} note="+0,08 п.п." />
            <MiniStat title="Средний белок" value={`${fmt(avg(latest.map((i) => i.protein)), 2)}%`} note="+0,03 п.п." />
            <MiniStat title="Средняя выручка" value={`${fmt(avg(latest.map((i) => i.revenue)))} ₸`} note="+6,1%" />
            <MiniStat title="Месяцев в архиве" value={`${allMonths.length}`} note="доступно для анализа" />
          </div>
        </div>
      </section>
    </>
  );
}

function Plants({
  days,
  deliveries,
  selectedDay,
  selectedDayCalc,
  updateDelivery,
  addDelivery,
  removeDelivery,
}: {
  days: DayMilk[];
  deliveries: Delivery[];
  selectedDay: DayMilk;
  selectedDayCalc: ReturnType<typeof calcDay>;
  updateDelivery: (index: number, field: keyof Delivery, value: string) => void;
  addDelivery: () => void;
  removeDelivery: (index: number) => void;
}) {
  const grouped = groupDeliveries(deliveries);
  const debtRows = [
    { buyer: "Завод Кокше", days: 12, debt: 612300, last: "2026-05-19", rec: "Связаться, установить срок оплаты" },
    { buyer: "Завод Север", days: 9, debt: 398700, last: "2026-05-21", rec: "Контроль оплаты" },
    { buyer: "ЭкоМолоко", days: 6, debt: 237560, last: "2026-05-25", rec: "Напомнить об оплате" },
  ];

  return (
    <>
      <section className="kpi-grid">
        <Kpi icon="👥" title="Активных покупателей" value={`${grouped.length}`} note="+1 к апрелю" />
        <Kpi icon="🚛" title="Всего распределено" value={`${fmt(selectedDayCalc.deliveriesTotal)} кг`} note="за выбранный день" />
        <Kpi icon="₸" title="Средняя цена" value={`${fmt(avg(deliveries.filter((i) => toNum(i.price) > 0).map((i) => toNum(i.price))), 2)} ₸`} note="за литр" />
        <Kpi icon="₸" title="Выручка дня" value={`${fmt(selectedDayCalc.revenue)} ₸`} note="по базису" />
        <Kpi icon="★" title="Лучший покупатель" value={grouped[0]?.buyer ?? "—"} note={`${fmt(grouped[0]?.liters ?? 0)} кг`} />
        <Kpi icon="!" title="Контроль оплаты" value={`${fmt(debtRows.reduce((s, r) => s + r.debt, 0))} ₸`} note="условная задолженность" />
      </section>

      <section className="grid-side">
        <div className="panel">
          <h2 className="panel-title">
            Маршрут реализации за день
            <button className="btn btn-primary" type="button" onClick={addDelivery}>Добавить завод</button>
          </h2>
          <p className="muted">
            Один день может содержать несколько заводов, телятник, внутренние нужды и прочие направления.
          </p>
          <div className="table-wrap">
            <table className="table" style={{ minWidth: 1220 }}>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Покупатель / завод</th>
                  <th>Тип продукции</th>
                  <th className="num">Объём, кг</th>
                  <th className="num">Жир, %</th>
                  <th className="num">Цена, ₸/кг</th>
                  <th className="num">Сумма, ₸</th>
                  <th>Маршрут</th>
                  <th>Статус</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {selectedDay.deliveries.map((delivery, index) => (
                  <tr key={delivery.id}>
                    <td>{delivery.date}</td>
                    <td><input className="table-input" value={delivery.buyer} onChange={(event) => updateDelivery(index, "buyer", event.target.value)} /></td>
                    <td><input className="table-input" value={delivery.product} onChange={(event) => updateDelivery(index, "product", event.target.value)} /></td>
                    <td><input className="table-input" type="number" value={delivery.liters} onChange={(event) => updateDelivery(index, "liters", event.target.value)} /></td>
                    <td><input className="table-input" type="number" step="0.01" value={delivery.fat} onChange={(event) => updateDelivery(index, "fat", event.target.value)} /></td>
                    <td><input className="table-input" type="number" step="0.01" value={delivery.price} onChange={(event) => updateDelivery(index, "price", event.target.value)} /></td>
                    <td className="num">{fmt(toNum(delivery.liters) * toNum(delivery.price))}</td>
                    <td><input className="table-input" value={delivery.route} onChange={(event) => updateDelivery(index, "route", event.target.value)} /></td>
                    <td>
                      <select className="table-input" value={delivery.status} onChange={(event) => updateDelivery(index, "status", event.target.value)}>
                        <option>Доставлено</option>
                        <option>В пути</option>
                        <option>План</option>
                        <option>Задержка</option>
                      </select>
                    </td>
                    <td><button className="btn btn-danger" type="button" onClick={() => removeDelivery(index)}>×</button></td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3}><strong>Итого за {selectedDay.date}</strong></td>
                  <td className="num"><strong>{fmt(selectedDayCalc.deliveriesTotal)}</strong></td>
                  <td className="num">—</td>
                  <td className="num">—</td>
                  <td className="num"><strong>{fmt(selectedDayCalc.revenue)}</strong></td>
                  <td colSpan={3}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h2 className="panel-title">Доля по заводам</h2>
          <DonutChart data={grouped.map((item) => ({ label: item.buyer, value: item.liters }))} center={`${fmt(grouped.reduce((s, i) => s + i.liters, 0))} кг`} />
        </div>
      </section>

      <section className="grid-3">
        <div className="panel">
          <h2 className="panel-title">Продажи по заводам за месяц</h2>
          <StackedBars days={days} />
        </div>

        <div className="panel">
          <h2 className="panel-title">Цена vs объём</h2>
          <BubbleChart data={grouped.map((item) => ({ label: item.buyer, x: item.liters, y: item.avgPrice, size: item.revenue }))} />
        </div>

        <div className="panel">
          <h2 className="panel-title">Топ покупателей</h2>
          <div className="table-wrap">
            <table className="table" style={{ minWidth: 480 }}>
              <thead><tr><th>№</th><th>Покупатель</th><th className="num">Объём</th><th className="num">Цена</th></tr></thead>
              <tbody>
                {grouped.map((item, index) => (
                  <tr key={item.buyer}><td>{index + 1}</td><td>{item.buyer}</td><td className="num">{fmt(item.liters)}</td><td className="num">{fmt(item.avgPrice, 2)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid-side">
        <div className="panel">
          <h2 className="panel-title">Просроченная задолженность покупателей</h2>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Покупатель</th><th className="num">Дней</th><th className="num">Сумма</th><th>Последняя поставка</th><th>Рекомендация</th></tr></thead>
              <tbody>
                {debtRows.map((row) => (
                  <tr key={row.buyer}><td>{row.buyer}</td><td className="num">{row.days}</td><td className="num">{fmt(row.debt)}</td><td>{row.last}</td><td>{row.rec}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h2 className="panel-title">Ключевые риски по реализации</h2>
          <p className="orange">⚠ Задолженность у 3 покупателей требует контроля оплаты.</p>
          <p className="orange">⚠ Падение средней цены у части направлений нужно сравнить с рынком.</p>
          <p className="green">✓ Один день теперь поддерживает несколько заводов и маршрутов.</p>
        </div>
      </section>
    </>
  );
}

function Forecast({ allMonths, monthFact }: { allMonths: MonthFact[]; monthFact: ReturnType<typeof useMonthFactType> }) {
  const plan = [3200000, 3250000, 3300000, 3300000, 3200000, 3050000, 3000000, 2900000, 3000000, 3200000, 3250000, 3350000];
  const forecast = [3050000, 3180000, 3330000, 3360000, 3180000, 3050000, 2950000, 2880000, 3020000, 3220000, 3310000, 3380000];
  const months = ["Июн 2026", "Июл 2026", "Авг 2026", "Сен 2026", "Окт 2026", "Ноя 2026", "Дек 2026", "Янв 2027", "Фев 2027", "Мар 2027", "Апр 2027", "Май 2027"];
  const planTotal = plan.reduce((sum, value) => sum + value, 0);
  const forecastTotal = forecast.reduce((sum, value) => sum + value, 0);

  return (
    <>
      <section className="grid-side">
        <div className="panel">
          <h2 className="panel-title">Прогноз молока на 12 месяцев</h2>
          <LineChart
            labels={months}
            series={[
              { name: "План", color: "#a3e635", values: plan },
              { name: "Прогноз базовый", color: "#e5e7eb", values: forecast },
              { name: "Оптимистичный", color: "#22c55e", values: forecast.map((item) => item * 1.06) },
              { name: "Консервативный", color: "#f87171", values: forecast.map((item) => item * 0.94) },
            ]}
          />
          <p className="muted">Прогноз считается от истории, поголовья, отёлов, запусков, выбытия, мастита, кормления и сезонности.</p>
        </div>

        <div className="panel">
          <h2 className="panel-title">Сценарии</h2>
          <div className="driver-grid" style={{ gridTemplateColumns: "1fr" }}>
            <MiniStat title="Базовый" value={`${fmt(forecastTotal)} кг`} note={`${pct(((forecastTotal - planTotal) / planTotal) * 100)} к плану`} />
            <MiniStat title="Оптимистичный" value={`${fmt(forecastTotal * 1.06)} кг`} note="+5,1% к плану" />
            <MiniStat title="Консервативный" value={`${fmt(forecastTotal * 0.94)} кг`} note="-7,0% к плану" />
          </div>
        </div>
      </section>

      <section className="grid-side">
        <div className="panel">
          <h2 className="panel-title">Ключевые драйверы прогноза</h2>
          <div className="driver-grid">
            <Driver title="Поголовье дойное" value="1 248" note="+2,1% к тек." />
            <Driver title="Отёлы" value="560" note="+0,8% к тек." />
            <Driver title="Запуски" value="520" note="+1,3% к тек." />
            <Driver title="Выбытие" value="132" note="+0,6% к тек." />
            <Driver title="% мастита" value={`${fmt(monthFact.mastitisPct, 1)}%`} note="контроль потерь" />
            <Driver title="Кормление NDF" value="31,5%" note="в норме" />
            <Driver title="Средний удой" value={`${fmt(monthFact.avgMilk, 1)}`} note="кг/гол/день" />
            <Driver title="Товарность" value={`${pct(monthFact.market / Math.max(monthFact.gross, 1) * 100)}`} note="+0,3 п.п." />
            <Driver title="Базисное молоко" value={`${fmt(basisKg(monthFact.market, 3.9))}`} note={`расчёт через ${BASE_FAT}%`} />
          </div>
        </div>

        <div className="panel">
          <h2 className="panel-title">Что необходимо для точного прогноза</h2>
          <Insight>Актуальное поголовье: дойные, сухостой, выбытие, переводы.</Insight>
          <Insight>План отёлов и запусков на 12 месяцев.</Insight>
          <Insight>Фактическое кормление, структура рационов, качество кормов, DMI.</Insight>
          <Insight>История надоев, мастит, потери и сезонное влияние.</Insight>
          <Insight>Плановые ограничения: ремонт, переселение, карантин, запуск новых мощностей.</Insight>
        </div>
      </section>

      <section className="grid-side">
        <div className="panel">
          <h2 className="panel-title">Помесячный прогноз</h2>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Месяц</th><th className="num">План</th><th className="num">Факт</th><th className="num">Прогноз</th><th className="num">Отклонение</th><th>Риск</th></tr></thead>
              <tbody>
                {months.map((month, index) => {
                  const deviation = forecast[index] - plan[index];
                  return (
                    <tr key={month}>
                      <td>{month}</td>
                      <td className="num">{fmt(plan[index])}</td>
                      <td className="num">{index < 2 ? fmt([2750000, 2860000][index]) : "—"}</td>
                      <td className="num">{fmt(forecast[index])}</td>
                      <td className={deviation >= 0 ? "num green" : "num red"}>{fmt(deviation)}</td>
                      <td>{Math.abs(deviation) > 60000 ? <span className="badge orange">Средний</span> : <span className="badge">Низкий</span>}</td>
                    </tr>
                  );
                })}
                <tr><td><strong>Итого</strong></td><td className="num"><strong>{fmt(planTotal)}</strong></td><td className="num">—</td><td className="num"><strong>{fmt(forecastTotal)}</strong></td><td className="num red"><strong>{fmt(forecastTotal - planTotal)}</strong></td><td>—</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h2 className="panel-title">Риски прогноза</h2>
          <Risk name="Кормление" value={78} label="Высокий" color="#ef4444" />
          <Risk name="Мастит" value={52} label="Средний" color="#f59e0b" />
          <Risk name="Отёлы" value={49} label="Средний" color="#f59e0b" />
          <Risk name="Выбытие" value={42} label="Средний" color="#f59e0b" />
          <Risk name="Погода" value={24} label="Низкий" color="#22c55e" />
        </div>
      </section>
    </>
  );
}

function useMonthFactType() {
  return {
    gross: 0,
    market: 0,
    mastitis: 0,
    revenue: 0,
    avgFat: 0,
    avgMilk: 0,
    mastitisPct: 0,
    deliveries: [] as Delivery[],
  };
}

function groupDeliveries(deliveries: Delivery[]) {
  const map = new Map<string, { buyer: string; liters: number; revenue: number; count: number }>();

  for (const delivery of deliveries) {
    const liters = toNum(delivery.liters);
    const basis = basisKg(liters, toNum(delivery.fat));
    const revenue = basis * toNum(delivery.price);
    const current = map.get(delivery.buyer) ?? { buyer: delivery.buyer || "Без покупателя", liters: 0, revenue: 0, count: 0 };
    current.liters += liters;
    current.revenue += revenue;
    current.count += 1;
    map.set(delivery.buyer || "Без покупателя", current);
  }

  return Array.from(map.values())
    .map((item) => ({ ...item, avgPrice: item.liters ? item.revenue / item.liters : 0 }))
    .sort((a, b) => b.liters - a.liters);
}

function buildMonthComparison(rows: MonthFact[]) {
  return MONTHS.map((month) => ({
    month,
    y2024: rows.find((item) => item.year === 2024 && item.month === month)?.gross ?? 0,
    y2025: rows.find((item) => item.year === 2025 && item.month === month)?.gross ?? 0,
    y2026: rows.find((item) => item.year === 2026 && item.month === month)?.gross ?? 0,
  }));
}

function avg(values: number[]) {
  const clean = values.filter((value) => Number.isFinite(value));
  return clean.length ? clean.reduce((sum, value) => sum + value, 0) / clean.length : 0;
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

function MiniStat({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="driver-card">
      <small>{title}</small>
      <strong>{value}</strong>
      <p className="green" style={{ margin: "8px 0 0" }}>{note}</p>
    </div>
  );
}

function Driver({ title, value, note }: { title: string; value: string; note: string }) {
  return <MiniStat title={title} value={value} note={note} />;
}

function Insight({ children }: { children: React.ReactNode }) {
  return (
    <div className="insight-item">
      <span className="check">✓</span>
      <span>{children}</span>
    </div>
  );
}

function MonthTable({ rows }: { rows: MonthFact[] }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>Месяц</th><th className="num">Вал</th><th className="num">Товарное</th><th className="num">Базис</th><th className="num">% мастита</th><th className="num">Жир</th><th className="num">Белок</th><th className="num">Выручка</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.month}-${row.year}`}>
              <td>{row.month} {row.year}</td>
              <td className="num">{fmt(row.gross)}</td>
              <td className="num">{fmt(row.market)}</td>
              <td className="num">{fmt(row.mastitis / row.gross * 100, 2)}%</td>
              <td className="num">{fmt(row.fat, 2)}%</td>
              <td className="num">{fmt(row.protein, 2)}%</td>
              <td className="num">{fmt(row.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Risk({ name, value, label, color }: { name: string; value: number; label: string; color: string }) {
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

function AreaChart({ series, labels }: { series: { name: string; color: string; values: number[] }[]; labels: string[] }) {
  const width = 900;
  const height = 280;
  const left = 54;
  const right = 22;
  const top = 28;
  const bottom = 42;
  const values = series.flatMap((item) => item.values);
  const max = Math.max(...values, 1) * 1.08;

  function x(index: number) {
    return left + (index * (width - left - right)) / Math.max(labels.length - 1, 1);
  }

  function y(value: number) {
    return height - bottom - (value / max) * (height - top - bottom);
  }

  function line(values: number[]) {
    return values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  }

  function area(values: number[]) {
    return `${line(values)} ${x(values.length - 1)},${height - bottom} ${x(0)},${height - bottom}`;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((rate) => (
        <g key={rate}>
          <line x1={left} x2={width - right} y1={height - bottom - rate * (height - top - bottom)} y2={height - bottom - rate * (height - top - bottom)} stroke="rgba(148,163,184,.14)" />
          <text x={8} y={height - bottom - rate * (height - top - bottom) + 4} fill="#a6b4c8" fontSize="12">{fmt(max * rate)}</text>
        </g>
      ))}
      <defs>
        <linearGradient id="greenArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity=".55" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity=".06" />
        </linearGradient>
        <linearGradient id="limeArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a3e635" stopOpacity=".38" />
          <stop offset="100%" stopColor="#a3e635" stopOpacity=".04" />
        </linearGradient>
      </defs>
      {series.map((item, index) => (
        <g key={item.name}>
          <polygon points={area(item.values)} fill={index === 0 ? "url(#greenArea)" : "url(#limeArea)"} />
          <polyline points={line(item.values)} fill="none" stroke={item.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
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

function DonutChart({ data, center }: { data: { label: string; value: number }[]; center: string }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const colors = ["#22c55e", "#60a5fa", "#fbbf24", "#a855f7", "#14b8a6", "#94a3b8"];
  let cumulative = 0;

  function segment(value: number, index: number) {
    const start = cumulative / total;
    const end = (cumulative + value) / total;
    cumulative += value;

    const large = end - start > 0.5 ? 1 : 0;
    const r = 82;
    const cx = 120;
    const cy = 120;
    const sx = cx + r * Math.cos(2 * Math.PI * start - Math.PI / 2);
    const sy = cy + r * Math.sin(2 * Math.PI * start - Math.PI / 2);
    const ex = cx + r * Math.cos(2 * Math.PI * end - Math.PI / 2);
    const ey = cy + r * Math.sin(2 * Math.PI * end - Math.PI / 2);

    return (
      <path
        key={index}
        d={`M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} Z`}
        fill={colors[index % colors.length]}
        opacity="0.92"
      />
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 12, alignItems: "center" }}>
      <svg viewBox="0 0 240 240" style={{ width: "100%", height: "auto" }}>
        {data.map((item, index) => segment(item.value, index))}
        <circle cx="120" cy="120" r="48" fill="#07111f" />
        <text x="120" y="112" fill="#edf7f1" textAnchor="middle" fontSize="15" fontWeight="800">{center}</text>
        <text x="120" y="134" fill="#a6b4c8" textAnchor="middle" fontSize="12">Всего</text>
      </svg>
      <div style={{ display: "grid", gap: 8 }}>
        {data.map((item, index) => (
          <div key={item.label} style={{ display: "grid", gridTemplateColumns: "14px 1fr auto", gap: 8, alignItems: "center" }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: colors[index % colors.length] }} />
            <span>{item.label}</span>
            <strong>{pct((item.value / total) * 100, 1)}</strong>
          </div>
        ))}
      </div>
    </div>
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
            <text x={x + barW / 2} y={height - 32} textAnchor="middle" fill="#a6b4c8" fontSize="12">{item.label.slice(0, 12)}</text>
          </g>
        );
      })}
    </svg>
  );
}

function StackedBars({ days }: { days: DayMilk[] }) {
  const groupedNames = ["Завод Север", "Завод Тайынша", "Завод Кокше", "Телятам", "Внутренние нужды"];
  const colors = ["#22c55e", "#60a5fa", "#fbbf24", "#a855f7", "#14b8a6"];
  const width = 760;
  const height = 260;
  const left = 46;
  const bottom = 44;
  const top = 24;
  const max = Math.max(...days.map((dayItem) => dayItem.deliveries.reduce((sum, d) => sum + toNum(d.liters), 0)), 1);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
      <line x1={left} x2={width - 20} y1={height - bottom} y2={height - bottom} stroke="rgba(148,163,184,.25)" />
      {days.map((dayItem, index) => {
        const barW = Math.max(18, (width - left - 30) / days.length - 6);
        const x = left + index * (barW + 6);
        let yBase = height - bottom;
        return (
          <g key={dayItem.date}>
            {groupedNames.map((name, groupIndex) => {
              const value = dayItem.deliveries.filter((d) => d.buyer === name).reduce((sum, d) => sum + toNum(d.liters), 0);
              const h = (value / max) * (height - top - bottom);
              yBase -= h;
              return <rect key={name} x={x} y={yBase} width={barW} height={h} fill={colors[groupIndex]} opacity=".85" />;
            })}
            {index % 3 === 0 ? <text x={x + barW / 2} y={height - 12} fill="#a6b4c8" fontSize="11" textAnchor="middle">{dayItem.date.slice(8)}</text> : null}
          </g>
        );
      })}
    </svg>
  );
}

function BubbleChart({ data }: { data: { label: string; x: number; y: number; size: number }[] }) {
  const width = 720;
  const height = 250;
  const left = 48;
  const right = 22;
  const top = 26;
  const bottom = 44;
  const maxX = Math.max(...data.map((item) => item.x), 1);
  const maxY = Math.max(...data.map((item) => item.y), 1) * 1.1;
  const maxSize = Math.max(...data.map((item) => item.size), 1);
  const colors = ["#22c55e", "#60a5fa", "#fbbf24", "#a855f7", "#14b8a6", "#94a3b8"];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
      <line x1={left} x2={width - right} y1={height - bottom} y2={height - bottom} stroke="rgba(148,163,184,.25)" />
      <line x1={left} x2={left} y1={top} y2={height - bottom} stroke="rgba(148,163,184,.25)" />
      {data.map((item, index) => {
        const x = left + (item.x / maxX) * (width - left - right);
        const y = height - bottom - (item.y / maxY) * (height - top - bottom);
        const r = 8 + (item.size / maxSize) * 16;
        return (
          <g key={item.label}>
            <circle cx={x} cy={y} r={r} fill={colors[index % colors.length]} opacity=".72" />
            <text x={x} y={y - r - 5} fill="#d7e4f2" fontSize="11" textAnchor="middle">{item.label.slice(0, 10)}</text>
          </g>
        );
      })}
      <text x={width - 120} y={height - 12} fill="#a6b4c8" fontSize="12">Объём</text>
      <text x={12} y={20} fill="#a6b4c8" fontSize="12">Цена</text>
    </svg>
  );
}

function Heatmap() {
  const rows = ["Май 26", "Апр 26", "Мар 26", "Фев 26", "Янв 26", "Дек 25", "Ноя 25", "Окт 25"];
  const cols = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div style={{ display: "grid", gap: 6 }}>
      {rows.map((row, rowIndex) => (
        <div key={row} style={{ display: "grid", gridTemplateColumns: "64px repeat(31, 1fr)", gap: 3, alignItems: "center" }}>
          <span className="muted" style={{ fontSize: 12 }}>{row}</span>
          {cols.map((col) => {
            const value = ((rowIndex + 3) * (col + 7)) % 100;
            const opacity = 0.25 + value / 140;
            return <span key={col} title={`${row} ${col}`} style={{ height: 14, borderRadius: 3, background: `rgba(34,197,94,${opacity})` }} />;
          })}
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", color: "#a6b4c8", fontSize: 12 }}>
        <span>Мин</span><span>Макс</span>
      </div>
    </div>
  );
}
