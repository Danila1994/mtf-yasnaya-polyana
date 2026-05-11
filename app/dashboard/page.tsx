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
      <div className="shell">
        <Sidebar active="home" />
        <section className="main">
          <header className="topbar">
            <div>
              <h1 className="title">МТФ Ясная Поляна</h1>
              <p className="subtitle">
                Главный экран. Сейчас рабочим сделан модуль молока. Остальные разделы заложены под расширение.
              </p>
            </div>
            <div className="actions">
              <button className="btn" onClick={logout} type="button">
                Выйти
              </button>
            </div>
          </header>

          <div className="grid-3">
            <Link className="panel" href="/dashboard/milk" style={{ textDecoration: "none" }}>
              <h2 className="panel-title">Молоко</h2>
              <p className="muted">
                Надой, товарное молоко, мастит, жирность, заводы, реализация, архив и прогноз.
              </p>
              <div className="btn btn-primary" style={{ marginTop: 14 }}>
                Открыть модуль
              </div>
            </Link>

            <div className="panel">
              <h2 className="panel-title">Воспроизводство</h2>
              <p className="muted">Раздел заложен под следующий этап. Будут KPI, осеменения, стельность, прогноз отёлов.</p>
            </div>

            <div className="panel">
              <h2 className="panel-title">Ветеринария</h2>
              <p className="muted">Раздел заложен под следующий этап. Будут лечение, мастит, хромота, расходы, журналы.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Sidebar({ active }: { active: "home" | "milk" }) {
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
        <Link className={active === "home" ? "nav-link active" : "nav-link"} href="/dashboard">
          <span className="nav-icon">⌂</span>Главная
        </Link>
        <Link className={active === "milk" ? "nav-link active" : "nav-link"} href="/dashboard/milk">
          <span className="nav-icon">▣</span>Молоко
        </Link>
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
