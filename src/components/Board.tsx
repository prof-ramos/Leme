"use client";

import { useEffect, useRef, useState } from "react";
import { createTaskAction, deleteTaskAction } from "@/server/actions";
import type { Task } from "@/server/schema";

const COLUMNS = [
  { id: "todo", label: "A fazer" },
  { id: "doing", label: "Fazendo" },
  { id: "done", label: "Feito" },
] as const;

const PRIORITY_LABEL = {
  baixa: "baixa",
  media: "média",
  alta: "alta",
} as const;

type BoardProps = {
  tasks: Task[];
};

export function Board({ tasks }: BoardProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "c" && event.key !== "C") return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      event.preventDefault();
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setError(null);
      inputRef.current?.focus();
    }
  }, [open]);

  async function onCreate(formData: FormData) {
    const result = await createTaskAction(formData);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setOpen(false);
  }

  return (
    <div className="min-h-dvh bg-[var(--ink)] text-[var(--paper)]">
      <header className="border-b border-[var(--line)] px-5 py-5 md:px-8">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.28em] text-[var(--sage)] uppercase">Leme</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--paper)] md:text-5xl">
              Quadro
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="border border-[var(--sage)] px-4 py-2 text-[11px] tracking-[0.18em] text-[var(--sage)] uppercase"
          >
            Nova tarefa
            <span className="ml-2 text-[var(--mist)]">C</span>
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-5 py-6 md:grid-cols-3 md:px-8">
        {COLUMNS.map((column) => {
          const items = tasks.filter((task) => task.column === column.id);
          return (
            <section key={column.id} className="min-h-72 border border-[var(--line)] bg-[var(--panel)]">
              <div className="flex items-baseline justify-between border-b border-[var(--line)] px-4 py-3">
                <h2 className="text-[12px] tracking-[0.2em] text-[var(--silver)] uppercase">{column.label}</h2>
                <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--sage)]">{items.length}</span>
              </div>
              <ul className="flex flex-col gap-3 p-3">
                {items.map((task) => (
                  <li key={task.id} className="border border-[var(--line)] bg-[var(--ink)]">
                    <div className="h-0.5 bg-[var(--sage)]" />
                    <div className="p-3">
                      <div className="mb-2 flex items-center justify-between gap-2 text-[10px] tracking-[0.16em] text-[var(--mist)] uppercase">
                        <span>{PRIORITY_LABEL[task.priority]}</span>
                        <span>{task.color}</span>
                      </div>
                      <p className="text-sm leading-snug text-[var(--paper)]">{task.title}</p>
                      <button
                        type="button"
                        onClick={() => deleteTaskAction(task.id)}
                        className="mt-3 text-[10px] tracking-[0.16em] text-[var(--silver)] uppercase hover:text-[var(--paper)]"
                      >
                        Apagar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </main>

      {open ? (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/70 p-4 md:items-center">
          <form
            action={onCreate}
            className="w-full max-w-md border border-[var(--line)] bg-[var(--panel)] p-5"
          >
            <p className="text-[11px] tracking-[0.22em] text-[var(--sage)] uppercase">Nova tarefa</p>
            <label className="mt-4 block text-[11px] tracking-[0.16em] text-[var(--silver)] uppercase">
              Título
              <input
                ref={inputRef}
                name="title"
                className="mt-2 w-full border border-[var(--line)] bg-[var(--ink)] px-3 py-2 text-base text-[var(--paper)] outline-none focus:border-[var(--sage)]"
                placeholder="O que precisa ser feito"
                autoComplete="off"
              />
            </label>
            {error ? <p className="mt-3 text-sm text-[var(--sage)]">{error}</p> : null}
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-[11px] tracking-[0.16em] text-[var(--silver)] uppercase"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[var(--sage)] px-4 py-2 text-[11px] tracking-[0.16em] text-[var(--ink)] uppercase"
              >
                Criar
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
