"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SummaryData = {
  date: string;
  forageHeads: string;
  milkingCows: string;
  dryCows: string;
  freshCows: string;
  grossMilk: string;
  marketMilk: string;
  rejectedMilk: string;
  calvings: string;
  newTreatments: string;
  activeTreatments: string;
  closedTreatments: string;
  cowDeaths: string;
  calfDeaths: string;
  cowInseminations: string;
  heiferInseminations: string;
  vetComment: string;
  silageTons: string;
  haylageTons: string;
  hayTons: string;
  strawTons: string;
  compoundFeedKg: string;
  zcmKg: string;
  prestarterKg: string;
  additivesKg: string;
  feedComment: string;
};

const today = new Date().toISOString().slice(0, 10);

const initialData: SummaryData = {
  date: today,
  forageHeads: "1600",
  milkingCows: "1400",
  dryCows: "200",
  freshCows: "0",
  grossMilk: "43400",
  marketMilk: "0",
  rejectedMilk: "0",
  calvings: "0",
  newTreatments: "0",
  activeTreatments: "0",
  closedTreatments: "0",
  cowDeaths: "0",
  calfDeaths: "0",
  cowInseminations: "0",
  heiferInseminations: "0",
  vetComment: "",
  silageTons: "0",
  haylageTons: "0",
  hayTons: "0",
  strawTons: "0",
  compoundFeedKg: "0",
  zcmKg: "0",
  prestarterKg: "0",
  additivesKg: "0",
  feedComment: ""
};

const storageKey = "mtf-daily-summary-v4";

function numberValue(value: string) {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);
}

export default function DailySummaryPage() {
  const [data, setData] = useState<SummaryData>(initialData);
  const [savedAt, setSavedAt] = useState<string>("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { data?: SummaryData; savedAt?: string };
        if (parsed.data) setData({ ...initialData, ...parsed.data });
        if (parsed.savedAt) setSavedAt(parsed.savedAt);
      }
    } catch {
      // localStorage may be unavailable in some browser modes. The form still works on screen.
    }
  }, []);

  const calculated = useMemo(() => {
    const forageHeads = numberValue(data.forageHeads);
    const milkingCows = numberValue(data.milkingCows);
    const dryCows = numberValue(data.dryCows);
    const grossMilk = numberValue(data.grossMilk);
    const marketMilk = numberValue(data.marketMilk);
    const rejectedMilk = numberValue(data.rejectedMilk);
    const cowInseminations = numberValue(data.cowInseminations);
    const heiferInseminations = numberValue(data.heiferInseminations);

    const juicyRoughageTons =
      numberValue(data.silageTons) +
      numberValue(data.haylageTons) +
      numberValue(data.hayTons) +
      numberValue(data.strawTons);

    const concentratesKg =
      numberValue(data.compoundFeedKg) +
      numberValue(data.prestarterKg) +
      numberValue(data.additivesKg);

    return {
      averageMilk: milkingCows > 0 ? grossMilk / milkingCows : 0,
      dryShare: forageHeads > 0 ? (dryCows / forageHeads) * 100 : 0,
      marketShare: grossMilk > 0 ? (marketMilk / grossMilk) * 100 : 0,
      rejectedShare: grossMilk > 0 ? (rejectedMilk / grossMilk) * 100 : 0,
      inseminationsTotal: cowInseminations + heiferInseminations,
      newVetEvents: numberValue(data.newTreatments) + numberValue(data.calvings) + numberValue(data.cowDeaths) + numberValue(data.calfDeaths),
      juicyRoughageTons,
      concentratesKg,
      zcmPerCalfDeathCheck: numberValue(data.zcmKg)
    };
  }, [data]);

  function updateField(field: keyof SummaryData, value: string) {
    setData((current) => ({ ...current, [field]: value }));
  }

  function saveSummary() {
    const date = new Date().toLocaleString("ru-RU");
    setSavedAt(date);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ data, savedAt: date }));
    } catch {
      // no-op
    }
  }

  function resetSummary() {
    setData(initialData);
    setSavedAt("");
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // no-op
    }
  }

  return (
    <main className="page">
      <header className="header">
        <Link className="brand" href="/">
          <div className="logo">ЯП</div>
          <div>
            <small>Ежедневная сводка</small>
            <strong>МТФ «Ясная Поляна»</strong>
          </div>
        </Link>
        <div className="header-actions">
          <Link className="btn" href="/dashboard/admin">Кабинет</Link>
          <Link className="btn danger" href="/login">Выйти</Link>
        </div>
      </header>

      <section className="summary-hero">
        <div>
          <div className="badge">Рабочая форма v4</div>
          <h1>Ежедневная сводка МТФ</h1>
          <p className="lead">
            Сводка разделена на 3 рабочих блока: молоко и поголовье, ветеринария и осеменение, зоотехния и расход кормов за день.
          </p>
        </div>
        <div className="card compact-card">
          <label className="field-label">Дата отчёта</label>
          <input className="input" type="date" value={data.date} onChange={(event) => updateField("date", event.target.value)} />
          <div className="actions tight-actions">
            <button className="btn primary" type="button" onClick={saveSummary}>Сохранить</button>
            <button className="btn" type="button" onClick={resetSummary}>Очистить</button>
          </div>
          {savedAt ? <div className="notice">Последнее сохранение на этом устройстве: {savedAt}</div> : null}
        </div>
      </section>

      <section className="summary-kpi-grid">
        <KpiCard title="Средний надой" value={`${formatNumber(calculated.averageMilk, 1)} л`} text="валовый надой / дойные коровы" />
        <KpiCard title="Валовый надой" value={`${formatNumber(numberValue(data.grossMilk))} л`} text="молоко за сутки" />
        <KpiCard title="Сухостой" value={`${formatNumber(calculated.dryShare, 1)}%`} text="от фуражного поголовья" />
        <KpiCard title="Осеменений" value={formatNumber(calculated.inseminationsTotal)} text="коровы + тёлки" />
        <KpiCard title="Вет-событий" value={formatNumber(calculated.newVetEvents)} text="отёлы, лечения, падёж" />
        <KpiCard title="Корма, т" value={formatNumber(calculated.juicyRoughageTons, 2)} text="силос + сенаж + сено + солома" />
      </section>

      <section className="summary-sections">
        <div className="summary-section milk-section">
          <div className="section-title">
            <span>01</span>
            <div>
              <h2>Сводка по молоку / количеству голов</h2>
              <p>Ключевой блок для ежедневной производственной картины.</p>
            </div>
          </div>

          <div className="form-grid">
            <NumberField label="Фуражных голов" value={data.forageHeads} onChange={(value) => updateField("forageHeads", value)} />
            <NumberField label="Дойных коров" value={data.milkingCows} onChange={(value) => updateField("milkingCows", value)} />
            <NumberField label="Сухостойных коров" value={data.dryCows} onChange={(value) => updateField("dryCows", value)} />
            <NumberField label="Новотельных в контроле" value={data.freshCows} onChange={(value) => updateField("freshCows", value)} />
            <NumberField label="Валовый надой, л" value={data.grossMilk} onChange={(value) => updateField("grossMilk", value)} />
            <NumberField label="Товарное молоко, л" value={data.marketMilk} onChange={(value) => updateField("marketMilk", value)} />
            <NumberField label="Отбраковано / удержано, л" value={data.rejectedMilk} onChange={(value) => updateField("rejectedMilk", value)} />
          </div>

          <div className="mini-summary-grid">
            <MiniSummary label="Средний надой" value={`${formatNumber(calculated.averageMilk, 1)} л`} />
            <MiniSummary label="Сухостой от фуража" value={`${formatNumber(calculated.dryShare, 1)}%`} />
            <MiniSummary label="Товарность" value={`${formatNumber(calculated.marketShare, 1)}%`} />
            <MiniSummary label="Удержано от вала" value={`${formatNumber(calculated.rejectedShare, 1)}%`} />
          </div>
        </div>

        <div className="summary-section vet-section">
          <div className="section-title">
            <span>02</span>
            <div>
              <h2>Сводка по ветеринарии / осеменению</h2>
              <p>Отдельно фиксируем здоровье, отёлы, падёж и работу осеменаторов.</p>
            </div>
          </div>

          <div className="form-grid">
            <NumberField label="Отёлов за день" value={data.calvings} onChange={(value) => updateField("calvings", value)} />
            <NumberField label="Новых лечений" value={data.newTreatments} onChange={(value) => updateField("newTreatments", value)} />
            <NumberField label="Активных лечений" value={data.activeTreatments} onChange={(value) => updateField("activeTreatments", value)} />
            <NumberField label="Закрытых лечений" value={data.closedTreatments} onChange={(value) => updateField("closedTreatments", value)} />
            <NumberField label="Падёж коров" value={data.cowDeaths} onChange={(value) => updateField("cowDeaths", value)} />
            <NumberField label="Падёж телят" value={data.calfDeaths} onChange={(value) => updateField("calfDeaths", value)} />
            <NumberField label="Осеменений коров" value={data.cowInseminations} onChange={(value) => updateField("cowInseminations", value)} />
            <NumberField label="Осеменений тёлок" value={data.heiferInseminations} onChange={(value) => updateField("heiferInseminations", value)} />
          </div>

          <label className="field-label">Комментарий ветеринарии / воспроизводства</label>
          <textarea className="textarea" value={data.vetComment} onChange={(event) => updateField("vetComment", event.target.value)} placeholder="Например: массовых проблем нет, 2 мастита в новотельной группе, осеменение выполнено по плану..." />

          <div className="mini-summary-grid">
            <MiniSummary label="Всего осеменений" value={formatNumber(calculated.inseminationsTotal)} />
            <MiniSummary label="Новых вет-событий" value={formatNumber(calculated.newVetEvents)} />
            <MiniSummary label="Активных лечений" value={formatNumber(numberValue(data.activeTreatments))} />
            <MiniSummary label="Закрытых лечений" value={formatNumber(numberValue(data.closedTreatments))} />
          </div>
        </div>

        <div className="summary-section feed-section">
          <div className="section-title">
            <span>03</span>
            <div>
              <h2>Зоотехния / расход кормов в день</h2>
              <p>Ежедневный расход основных кормов и добавок. Остатки подключим отдельным модулем.</p>
            </div>
          </div>

          <div className="form-grid">
            <NumberField label="Силос, т" value={data.silageTons} onChange={(value) => updateField("silageTons", value)} step="0.01" />
            <NumberField label="Сенаж, т" value={data.haylageTons} onChange={(value) => updateField("haylageTons", value)} step="0.01" />
            <NumberField label="Сено, т" value={data.hayTons} onChange={(value) => updateField("hayTons", value)} step="0.01" />
            <NumberField label="Солома, т" value={data.strawTons} onChange={(value) => updateField("strawTons", value)} step="0.01" />
            <NumberField label="Комбикорм, кг" value={data.compoundFeedKg} onChange={(value) => updateField("compoundFeedKg", value)} />
            <NumberField label="ЗЦМ, кг" value={data.zcmKg} onChange={(value) => updateField("zcmKg", value)} />
            <NumberField label="Престартер, кг" value={data.prestarterKg} onChange={(value) => updateField("prestarterKg", value)} />
            <NumberField label="Добавки / премиксы, кг" value={data.additivesKg} onChange={(value) => updateField("additivesKg", value)} />
          </div>

          <label className="field-label">Комментарий зоотехника / кормоцеха</label>
          <textarea className="textarea" value={data.feedComment} onChange={(event) => updateField("feedComment", event.target.value)} placeholder="Например: расход по плану, силос траншея №2, сенаж люцерна, перебоев по кормам нет..." />

          <div className="mini-summary-grid">
            <MiniSummary label="Сочные/грубые корма" value={`${formatNumber(calculated.juicyRoughageTons, 2)} т`} />
            <MiniSummary label="Концентраты и добавки" value={`${formatNumber(calculated.concentratesKg)} кг`} />
            <MiniSummary label="ЗЦМ" value={`${formatNumber(numberValue(data.zcmKg))} кг`} />
            <MiniSummary label="Комбикорм" value={`${formatNumber(numberValue(data.compoundFeedKg))} кг`} />
          </div>
        </div>
      </section>

      <section className="card report-preview">
        <div className="section-title small-title">
          <span>Итог</span>
          <div>
            <h2>Сводка для руководства</h2>
            <p>Так будет выглядеть короткий ежедневный отчёт после заполнения трёх блоков.</p>
          </div>
        </div>

        <table className="table">
          <tbody>
            <tr><td>Дата</td><td>{data.date}</td></tr>
            <tr><td>Молоко / поголовье</td><td>{formatNumber(numberValue(data.grossMilk))} л вал, {formatNumber(calculated.averageMilk, 1)} л/дойную, {formatNumber(numberValue(data.milkingCows))} дойных</td></tr>
            <tr><td>Ветеринария / осеменение</td><td>{formatNumber(numberValue(data.newTreatments))} новых лечений, {formatNumber(numberValue(data.calvings))} отёлов, {formatNumber(calculated.inseminationsTotal)} осеменений</td></tr>
            <tr><td>Корма</td><td>{formatNumber(calculated.juicyRoughageTons, 2)} т сочных/грубых, {formatNumber(calculated.concentratesKg)} кг концентратов и добавок</td></tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}

function NumberField({ label, value, onChange, step = "1" }: { label: string; value: string; onChange: (value: string) => void; step?: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input className="input" type="number" inputMode="decimal" step={step} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function KpiCard({ title, value, text }: { title: string; value: string; text: string }) {
  return (
    <div className="kpi summary-kpi">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{text}</small>
    </div>
  );
}

function MiniSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-summary">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
