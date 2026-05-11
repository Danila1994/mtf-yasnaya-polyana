"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("mtf-auth") !== "yes") {
      router.replace("/");
      return;
    }

    setReady(true);
  }, [router]);

  function logout() {
    window.localStorage.removeItem("mtf-auth");
    router.replace("/");
  }

  if (!ready) {
    return <main className="page">Проверка доступа...</main>;
  }

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand-row">
          <div className="brand-mark">ЯП</div>
          <div>
            <div className="eyebrow">Рабочий кабинет</div>
            <h1 className="title">МТФ Ясная Поляна</h1>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn" onClick={logout} type="button">
            Выйти
          </button>
        </div>
      </header>

      <div className="container">
        <section className="hero">
          <h2>Начальный экран</h2>
          <p>
            Здесь оставлен только основной рабочий раздел. Без лишних ссылок и лишних страниц:
            сначала заходим в молоко, затем выбираем сводку или расширенный отчёт.
          </p>
        </section>

        <section className="module-grid">
          <Link className="module-card" href="/dashboard/milk">
            <div className="module-icon">М</div>
            <strong>Молоко</strong>
            <span>
              Сводка за день, расширенная таблица, сравнение по месяцам и годам,
              графики, мастит, жирность и куда продали молоко.
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}
