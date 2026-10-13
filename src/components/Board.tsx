"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createTaskAction, deleteTaskAction } from "@/server/actions";
import type { Task } from "@/server/schema";

const COLUMNS = [
  { id: "todo", label: "A fazer", empty: "Comece por uma tarefa. Use Nova tarefa para escrever o que precisa ser feito." },
  { id: "doing", label: "Fazendo", empty: "Nenhuma tarefa em andamento." },
  { id: "done", label: "Feito", empty: "Nenhuma tarefa concluída." },
] as const;

const PRIORITY_LABEL = { baixa: "baixa", media: "média", alta: "alta" } as const;

function TaskItem({ task }: { task: Task }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);

  function remove() {
    if (submitting.current) return;
    submitting.current = true;
    setError(null);
    startTransition(async () => {
      try {
        const result = await deleteTaskAction(task.id);
        if (!result.ok) setError(result.error);
      } catch {
        setError("Não foi possível apagar a tarefa. Tente novamente.");
      } finally {
        submitting.current = false;
      }
    });
  }

  return (
    <li className="task-item" data-color={task.color} aria-busy={pending}>
      {task.priority !== "media" ? <p className="task-priority">Prioridade {PRIORITY_LABEL[task.priority]}</p> : null}
      <p className="task-title">{task.title}</p>
      <button type="button" onClick={remove} disabled={pending} className="quiet-button" aria-label={`${pending ? "Apagando" : "Apagar"} tarefa: ${task.title}`}>
        {pending ? "Apagando…" : "Apagar"}
      </button>
      {error ? <p role="alert" className="task-error">{error}</p> : null}
    </li>
  );
}

export function Board({ tasks }: { tasks: Task[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [invalidTitle, setInvalidTitle] = useState(false);
  const submitting = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat || (event.key !== "c" && event.key !== "C")) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])")) return;
      event.preventDefault();
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) {
      setError(null);
      setInvalidTitle(false);
      dialog.querySelector("form")?.reset();
      dialog.showModal();
      inputRef.current?.focus();
    }
  }, [open]);

  function close() {
    if (!submitting.current) dialogRef.current?.close();
  }

  function onCreate(formData: FormData) {
    if (submitting.current) return;
    submitting.current = true;
    setError(null);
    setInvalidTitle(false);
    startTransition(async () => {
      try {
        const result = await createTaskAction(formData);
        if (!result.ok) {
          setError(result.error);
          setInvalidTitle(!String(formData.get("title") ?? "").trim());
          inputRef.current?.focus();
        } else {
          dialogRef.current?.close();
        }
      } catch {
        setError("Não foi possível criar a tarefa. Tente novamente.");
      } finally {
        submitting.current = false;
      }
    });
  }

  return (
    <div className="leme-board">
      <header className="board-header">
        <div className="board-heading">
          <div><p className="brand-name">Leme</p><h1>Quadro</h1></div>
          <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="primary-button">
            Nova tarefa <kbd aria-hidden="true">C</kbd>
          </button>
        </div>
      </header>
      <main className="board-columns">
        {COLUMNS.map(column => {
          const items = tasks.filter(task => task.column === column.id);
          return (
            <section key={column.id} className="board-column" aria-labelledby={`column-${column.id}`}>
              <div className="column-heading">
                <h2 id={`column-${column.id}`}>{column.label}</h2>
                <span aria-label={`${items.length} tarefas`}>{items.length}</span>
              </div>
              {items.length ? <ul className="task-list">{items.map(task => <TaskItem key={task.id} task={task} />)}</ul> : <p className="column-empty">{column.empty}</p>}
            </section>
          );
        })}
      </main>
      <dialog ref={dialogRef} className="task-dialog" aria-labelledby="new-task-title" onKeyDown={event => {
        if (event.key !== "Tab") return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLInputElement | HTMLButtonElement>("input, button"))
          .filter(control => !control.disabled && control.tabIndex >= 0);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }} onCancel={event => {
        if (submitting.current) event.preventDefault();
      }} onClose={() => {
        setOpen(false);
        triggerRef.current?.focus();
      }}>
        <form onSubmit={event => {
          event.preventDefault();
          onCreate(new FormData(event.currentTarget));
        }} aria-busy={pending}>
          <h2 id="new-task-title">Nova tarefa</h2>
          <label htmlFor="task-title">Título</label>
          <input ref={inputRef} id="task-title" name="title" placeholder="O que precisa ser feito" autoComplete="off" readOnly={pending} aria-invalid={invalidTitle || undefined} aria-describedby={error ? "task-title-error" : undefined} onChange={() => { setError(null); setInvalidTitle(false); }} />
          {error ? <p id="task-title-error" role="alert" className="task-error">{error}</p> : null}
          <div className="dialog-actions">
            <button type="button" onClick={close} disabled={pending} className="quiet-button">Cancelar</button>
            <button type="submit" disabled={pending} className="primary-button">{pending ? "Criando…" : "Criar"}</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
