"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LOGIN = "Danila";
const PASSWORD = "000000";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem("mtf-auth") === "yes") {
      router.replace("/dashboard");
    }
  }, [router]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (login.trim() === LOGIN && password === PASSWORD) {
      window.localStorage.setItem("mtf-auth", "yes");
      router.replace("/dashboard");
      return;
    }

    setError("Неверный логин или пароль.");
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="logo-mark">ЯП</div>
        <h1 className="login-title">МТФ Ясная Поляна</h1>
        <p className="login-subtitle">
          Рабочая система отчётности и аналитики фермы.
        </p>

        <div className="form-stack">
          <div className="field">
            <label htmlFor="login">Логин</label>
            <input
              id="login"
              className="input"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error ? <div className="error">{error}</div> : null}

          <button className="btn btn-primary" type="submit">
            Войти
          </button>
        </div>
      </form>
    </main>
  );
}
