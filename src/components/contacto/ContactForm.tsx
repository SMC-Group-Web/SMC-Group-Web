"use client";

import { useState } from "react";
import { submitLead } from "@/app/(frontend)/contacto/actions";

type SubmitStatus = "idle" | "loading" | "success" | "error";

function validateEmail(value: string): string {
  if (!value) return "El correo es obligatorio";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "Ingresa un correo válido (ej: nombre@empresa.com)";
  return "";
}

function validatePhone(value: string): string {
  if (!value) return "";
  const cleaned = value.replace(/[\s\-()]/g, "");
  if (/^9\d{8}$/.test(cleaned)) return "";
  if (/^\+?51\s?9\d{8}$/.test(cleaned.replace("+", ""))) return "";
  if (/^\+\d{7,15}$/.test(cleaned)) return "";
  return "Celular peruano: 9 dígitos (ej: 987654321) o internacional con + y código de país";
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [description, setDescription] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailTouched) setEmailError(validateEmail(value));
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (phoneTouched) setPhoneError(validatePhone(value));
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    setPhoneError(validatePhone(phone));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    setEmailTouched(true);
    setPhoneTouched(true);
    setEmailError(emailErr);
    setPhoneError(phoneErr);

    if (emailErr || phoneErr) {
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const result = await submitLead({
      name,
      company,
      email,
      phone,
      projectType,
      description,
      urgent,
    });

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Error desconocido");
    }
  };

  if (status === "success") {
    return (
      <div className="flex min-h-105 flex-col items-center justify-center gap-6 p-7 text-center md:p-8">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: "var(--primary)" + "12" }}
        >
          <svg
            className="h-10 w-10"
            style={{ color: "var(--primary)" }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-black uppercase text-[#0f172a]">
            Solicitud enviada correctamente
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Un especialista de SMC GROUP se pondrá en contacto contigo pronto.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setName("");
            setCompany("");
            setEmail("");
            setPhone("");
            setProjectType("");
            setDescription("");
            setUrgent(false);
            setEmailTouched(false);
            setPhoneTouched(false);
            setEmailError("");
            setPhoneError("");
          }}
          className="text-xs font-bold uppercase tracking-widest transition hover:opacity-70"
          style={{ color: "var(--primary)" }}
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="nombre"
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Nombre Completo
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Ej: Juan Pérez"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-(--primary) focus:bg-white focus:shadow-[0_0_0_3px_rgba(47,86,201,0.1)]"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="empresa"
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Empresa
          </label>
          <input
            id="empresa"
            type="text"
            placeholder="Nombre de su organización"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-(--primary) focus:bg-white focus:shadow-[0_0_0_3px_rgba(47,86,201,0.1)]"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="correo"
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Correo Electrónico
          </label>
          <input
            id="correo"
            type="email"
            placeholder="email@empresa.com"
            required
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={handleEmailBlur}
            className={`w-full rounded-xl border bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition-all duration-200 focus:bg-white ${
              emailTouched && emailError
                ? "border-red-300 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                : "border-gray-200 focus:border-(--primary) focus:shadow-[0_0_0_3px_rgba(47,86,201,0.1)]"
            }`}
          />
          {emailTouched && emailError && (
            <p className="text-xs text-red-500">{emailError}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="telefono"
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Teléfono de Contacto
          </label>
          <input
            id="telefono"
            type="tel"
            placeholder="987 654 321"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onBlur={handlePhoneBlur}
            className={`w-full rounded-xl border bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition-all duration-200 focus:bg-white ${
              phoneTouched && phoneError
                ? "border-red-300 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                : "border-gray-200 focus:border-(--primary) focus:shadow-[0_0_0_3px_rgba(47,86,201,0.1)]"
            }`}
          />
          {phoneTouched && phoneError && (
            <p className="text-xs text-red-500">{phoneError}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="tipo-proyecto"
          className="text-xs font-bold uppercase tracking-wider text-slate-500"
        >
          Tipo de Proyecto
        </label>
        <select
          id="tipo-proyecto"
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-[#f7f9fc] px-4 py-3 text-sm text-slate-500 outline-none transition-all duration-200 focus:border-(--primary) focus:bg-white focus:shadow-[0_0_0_3px_rgba(47,86,201,0.1)]"
        >
          <option value="">Selecciona una opción</option>
          <option>Ingeniería estructural</option>
          <option>Construcción industrial</option>
          <option>Fabricación metalmecánica</option>
          <option>Montaje industrial</option>
          <option>Mantenimiento</option>
          <option>Otro</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="descripcion"
          className="text-xs font-bold uppercase tracking-wider text-slate-500"
        >
          Descripción del Requerimiento
        </label>
        <textarea
          id="descripcion"
          placeholder="Cuéntenos sobre su proyecto, dimensiones, materiales o plazos estimados..."
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-none rounded-xl border border-gray-200 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-(--primary) focus:bg-white focus:shadow-[0_0_0_3px_rgba(47,86,201,0.1)]"
        />
      </div>

      <label
        htmlFor="urgente"
        className="flex cursor-pointer items-center gap-3"
      >
        <input
          id="urgente"
          type="checkbox"
          checked={urgent}
          onChange={(e) => setUrgent(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 accent-(--primary)"
        />
        <span className="text-sm text-slate-500">
          Este proyecto es de carácter{" "}
          <span className="font-bold" style={{ color: "var(--primary)" }}>
            urgente
          </span>
        </span>
      </label>

      {status === "error" && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMsg || "Ocurrió un error. Intenta de nuevo."}
        </p>
      )}

      <p className="text-xs text-slate-400">
        Al enviar, usted acepta que nos comuniquemos para atender su consulta.
      </p>

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-black uppercase tracking-widest transition-all duration-300 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        style={{ background: "var(--primary)", color: "white" }}
      >
        {status === "loading" ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Enviando...
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
            Enviar Solicitud de Cotización
          </>
        )}
      </button>
    </form>
  );
}
