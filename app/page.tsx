"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  animate,
  Variants,
} from "framer-motion";
import {
  Scale, AlertTriangle, Clock, Briefcase, FileText, CheckCircle,
  Video, MapPin, PhoneForwarded, Shield, Award, Users, ChevronRight,
  Phone, Star, Quote, Building, Lock,
} from "lucide-react";

// ─────────────────────────────────────────
// ANIMATION CONSTANTS (Bank / Law-Firm UX)
// ─────────────────────────────────────────
const EASE_POWER: [number, number, number, number] = [0.22, 1, 0.36, 1]; // cubic-bezier("power ease-out")

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_POWER } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.0, ease: EASE_POWER } },
};

// Stagger container for grid sweeps
const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

// Individual card — lateral sweep (slight Y + opacity)
const cardReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_POWER } },
};

// ─────────────────────────────────────────
// COUNT-UP STAT COMPONENT
// ─────────────────────────────────────────
interface CountUpStatProps {
  target: number;
  suffix: string;
  label: string;
}

function CountUpStat({ target, suffix, label }: CountUpStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, {
      duration: 2.0,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [inView, count, target]);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="px-4"
    >
      <h4 className="text-4xl font-serif font-bold text-legal-gold">
        {display}{suffix}
      </h4>
      <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// GOLD CTA BUTTON
// Arrow slides 4px right on hover, golden glow on bg
// ─────────────────────────────────────────
function GoldButton({
  onClick,
  disabled,
  children,
  className = "",
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.01, boxShadow: "0 0 28px rgba(194, 155, 87, 0.45)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`group w-full bg-[#C29B57] text-legal-navy font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-widest uppercase flex justify-center items-center gap-2 hover:bg-[#A68345] ${className}`}
    >
      <span>{children}</span>
      <motion.span
        className="inline-flex items-center"
        whileHover={{ x: 4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <ChevronRight className="w-5 h-5" />
      </motion.span>
    </motion.button>
  );
}

// ─────────────────────────────────────────
// ANIMATED PRACTICE AREA CARD
// -2px Y lift + golden glow on hover
// ─────────────────────────────────────────
function AreaCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      variants={cardReveal}
      whileHover={{
        y: -2,
        boxShadow: "0 8px 32px rgba(194, 155, 87, 0.18), 0 0 0 1px rgba(194, 155, 87, 0.35)",
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className="bg-[#111A30] border border-slate-800 rounded-lg p-8 cursor-default"
    >
      <div className="text-legal-gold mb-6">{icon}</div>
      <h3 className="text-xl font-serif font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// TESTIMONIAL CARD
// ─────────────────────────────────────────
function TestimonialCard({ quote, initials, role }: { quote: string; initials: string; role: string }) {
  return (
    <motion.div
      variants={cardReveal}
      className="bg-[#111A30] border border-slate-800 rounded-lg p-8 relative"
    >
      <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-800" />
      <div className="flex gap-1 mb-6 text-legal-gold">
        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
      </div>
      <p className="text-slate-300 text-sm leading-relaxed mb-8 italic">"{quote}"</p>
      <div>
        <strong className="text-white block">{initials}</strong>
        <span className="text-slate-500 text-xs uppercase tracking-wider">{role}</span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────
export default function VallesLegalPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    caseType: "",
    urgency: "",
  });

  const WHATSAPP_NUMBER = "584120000000";

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const updateForm = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field !== "name" && field !== "phone") {
      setTimeout(() => handleNext(), 300);
    }
  };

  const submitPhone = () => {
    // Simulated background webhook — lead saved before user reaches legal questions
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formData.name, phone: formData.phone }),
    }).catch(() => {/* silent fail — API route not yet live */ });
    handleNext();
  };

  const generateWhatsAppLink = () => {
    const text = `Hola Dr., solicito evaluación confidencial.\n\n*Nombre:* ${formData.name}\n*Teléfono:* ${formData.phone}\n*Caso:* ${formData.caseType}\n*Urgencia:* ${formData.urgency}\n\nRequiero asistencia inmediata.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const isEmergency = formData.urgency === "EMERGENCIA 24H (Detenido/Fiscal)";

  return (
    <div className="min-h-screen bg-legal-navy flex flex-col font-sans overflow-x-hidden text-legal-parchment">

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_POWER }}
        className="border-b border-legal-gold/20 bg-[#060B1A]/95 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="text-legal-gold w-8 h-8 md:w-9 md:h-9" />
            <span className="text-xl md:text-2xl font-serif tracking-widest uppercase font-bold text-white">
              Valles <span className="text-legal-gold">Legal</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#areas" className="text-xs text-slate-300 hover:text-legal-gold transition-colors font-bold tracking-widest uppercase">
              Áreas de Práctica
            </a>
            <a href="#firma" className="text-xs text-slate-300 hover:text-legal-gold transition-colors font-bold tracking-widest uppercase">
              La Firma
            </a>
            <div className="flex items-center gap-2 text-legal-gold">
              <Phone className="w-4 h-4" />
              <span className="font-bold text-sm tracking-widest">+58 412-000-0000</span>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── [1] HERO SECTION ── */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-4 md:px-8 overflow-hidden">
        {/* ambient glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-legal-gold/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT: Copy de Autoridad */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
            }}
            className="space-y-8 relative z-10 text-center lg:text-left"
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 bg-[#121E38] border border-legal-gold/30 px-5 py-2 rounded-full text-legal-gold text-xs font-bold uppercase tracking-widest shadow-lg">
                <Shield className="w-4 h-4" />
                ⛨ FIRMA JURÍDICA PREMIUM
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold text-white leading-[1.1] tracking-tight"
            >
              Protegemos su{" "}
              <span className="font-serif italic font-normal text-legal-gold">Patrimonio</span>,
              su{" "}
              <span className="font-serif italic font-normal text-legal-gold">Familia</span>{" "}
              y su{" "}
              <span className="font-serif italic font-normal text-legal-gold">Libertad</span>.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              No deje su futuro al azar. Más de 15 años de experiencia enfrentando casos de
              alta complejidad con total contundencia, discreción y eficacia táctica.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-6 pt-4 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-3">
                <div className="bg-legal-gold/10 p-2.5 rounded-lg text-legal-gold shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-white font-bold text-sm uppercase tracking-wide">Estrategia Probada</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-legal-gold/10 p-2.5 rounded-lg text-legal-gold shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-white font-bold text-sm uppercase tracking-wide">Atención Personalizada</span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Embudo de Leads */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: EASE_POWER, delay: 0.35 }}
            id="evaluacion"
            className="relative z-10 w-full max-w-md mx-auto lg:ml-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-br from-legal-gold/25 to-transparent rounded-[2rem] blur-xl opacity-40 pointer-events-none" />
            <div className="bg-[#111A30] rounded-[2rem] p-8 md:p-10 shadow-2xl border border-legal-gold/20 relative overflow-hidden min-h-[460px] flex flex-col justify-center">
              <div className="absolute top-0 left-0 h-1.5 bg-slate-800 w-full">
                <motion.div
                  className="h-full bg-legal-gold origin-left"
                  animate={{ scaleX: step / 5 }}
                  transition={{ duration: 0.5, ease: EASE_POWER }}
                  style={{ transformOrigin: "left" }}
                />
              </div>

              {/* STEP 1 — Name */}
              {step === 1 && (
                <motion.div key="s1" variants={fadeUp} initial="hidden" animate="show" className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-legal-gold font-bold text-xs tracking-widest uppercase">Evaluación Previa • 1/4</span>
                    <h3 className="text-2xl font-serif font-bold text-white">¿Cuál es su nombre o el de su empresa?</h3>
                  </div>
                  <input
                    type="text"
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full bg-[#0A111F] border border-slate-600 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-legal-gold focus:ring-1 focus:ring-legal-gold transition-all text-lg"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onKeyDown={(e) => { if (e.key === "Enter" && formData.name) handleNext(); }}
                  />
                  <GoldButton disabled={!formData.name} onClick={handleNext}>CONTINUAR</GoldButton>
                </motion.div>
              )}

              {/* STEP 2 — Phone (early lead capture) */}
              {step === 2 && (
                <motion.div key="s2" variants={fadeUp} initial="hidden" animate="show" className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-legal-gold font-bold text-xs tracking-widest uppercase">Contacto Seguro • 2/4</span>
                    <h3 className="text-2xl font-serif font-bold text-white">¿A qué WhatsApp le contactamos?</h3>
                    <p className="text-xs text-slate-400">Total reserva y discreción.</p>
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+58 412 000 0000"
                      className="w-full bg-[#0A111F] border border-slate-600 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-legal-gold focus:ring-1 focus:ring-legal-gold transition-all text-lg"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter" && formData.phone.length > 8) submitPhone(); }}
                    />
                  </div>
                  <GoldButton disabled={formData.phone.length < 8} onClick={submitPhone}>
                    AVANZAR AL DIAGNÓSTICO
                  </GoldButton>
                  <button onClick={handleBack} className="text-slate-400 hover:text-white text-xs uppercase tracking-widest w-full text-center transition-colors">← Volver</button>
                </motion.div>
              )}

              {/* STEP 3 — Case type */}
              {step === 3 && (
                <motion.div key="s3" variants={fadeUp} initial="hidden" animate="show" className="space-y-5">
                  <div className="space-y-2">
                    <span className="text-legal-gold font-bold text-xs tracking-widest uppercase">Área Legal • 3/4</span>
                    <h3 className="text-2xl font-serif font-bold text-white">Seleccione su situación</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { title: "Corporativo y Mercantil", icon: <Building className="w-5 h-5" /> },
                      { title: "Civil, Familia y Bienes", icon: <Scale className="w-5 h-5" /> },
                      { title: "Defensa Penal", icon: <AlertTriangle className="w-5 h-5" /> },
                    ].map((item) => (
                      <motion.button
                        key={item.title}
                        whileHover={{ x: 4, borderColor: "rgba(194, 155, 87, 0.7)", backgroundColor: "rgba(194, 155, 87, 0.08)", transition: { duration: 0.25 } }}
                        onClick={() => updateForm("caseType", item.title)}
                        className="flex items-center justify-between p-4 border border-slate-600 rounded-xl transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-slate-400 group-hover:text-legal-gold transition-colors">{item.icon}</div>
                          <span className="font-bold text-white text-sm">{item.title}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-legal-gold transition-colors" />
                      </motion.button>
                    ))}
                  </div>
                  <button onClick={handleBack} className="text-slate-400 hover:text-white text-xs uppercase tracking-widest w-full text-center pt-2 transition-colors">← Volver</button>
                </motion.div>
              )}

              {/* STEP 4 — Urgency */}
              {step === 4 && (
                <motion.div key="s4" variants={fadeUp} initial="hidden" animate="show" className="space-y-5">
                  <div className="space-y-2">
                    <span className="text-legal-gold font-bold text-xs tracking-widest uppercase">Prioridad • 4/4</span>
                    <h3 className="text-2xl font-serif font-bold text-white">Nivel de Urgencia</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { level: "Requiere planificación (Normal)", classes: "hover:border-blue-500/70 hover:bg-blue-500/8" },
                      { level: "Riesgo Patrimonial (Urgente)", classes: "hover:border-orange-500/70 hover:bg-orange-500/8" },
                      { level: "EMERGENCIA 24H (Detenido/Fiscal)", classes: "border-legal-crimson/50 hover:bg-legal-crimson/15 text-red-400 font-bold" },
                    ].map((item) => (
                      <motion.button
                        key={item.level}
                        whileHover={{ x: 4, transition: { duration: 0.25 } }}
                        onClick={() => updateForm("urgency", item.level)}
                        className={`w-full p-4 text-left border border-slate-600 rounded-xl transition-colors flex items-center gap-3 ${item.classes}`}
                      >
                        <Clock className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-bold">{item.level}</span>
                      </motion.button>
                    ))}
                  </div>
                  <button onClick={handleBack} className="text-slate-400 hover:text-white text-xs uppercase tracking-widest w-full text-center pt-2 transition-colors">← Volver</button>
                </motion.div>
              )}

              {/* STEP 5 — Summary */}
              {step === 5 && (
                <motion.div key="s5" variants={fadeUp} initial="hidden" animate="show" className="space-y-5 text-center">
                  <div className="flex justify-center">
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: EASE_POWER }}>
                      <Lock className="w-12 h-12 text-legal-gold" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-white">Diagnóstico Completado</h3>
                    <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest">Su información está protegida</p>
                  </div>
                  <div className="bg-[#0A111F] p-5 rounded-xl text-left border border-slate-700 space-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Titular</span>
                      <strong className="text-white">{formData.name}</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Materia</span>
                      <strong className="text-white">{formData.caseType}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status</span>
                      <strong className={isEmergency ? "text-red-500" : "text-legal-gold"}>
                        {formData.urgency}
                      </strong>
                    </div>
                  </div>
                  <motion.a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.01, y: -2, boxShadow: isEmergency ? "0 0 28px rgba(136, 19, 55, 0.6)" : "0 0 28px rgba(194, 155, 87, 0.45)" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`flex items-center justify-center gap-2 w-full font-bold py-4 rounded-xl text-sm tracking-widest uppercase shadow-lg ${isEmergency
                        ? "bg-legal-crimson hover:bg-red-800 text-white animate-pulse"
                        : "bg-[#C29B57] hover:bg-[#A68345] text-legal-navy"
                      }`}
                  >
                    <PhoneForwarded className="w-5 h-5" />
                    {isEmergency ? "CONTACTO URGENTE (24/7)" : "HABLAR CON UN ABOGADO"}
                  </motion.a>
                  <button onClick={() => setStep(1)} className="text-slate-500 hover:text-white text-xs uppercase tracking-widest w-full text-center mt-2 transition-colors">
                    Iniciar nueva consulta
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── [2] CINTA DE CONFIANZA — COUNT-UP ── */}
      <section className="bg-[#0A111F] border-y border-slate-800 py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-x-0 md:divide-x divide-slate-800 text-center"
        >
          <CountUpStat target={15} suffix="+" label="Años de Experiencia" />
          <CountUpStat target={98} suffix="%" label="Casos de Éxito" />
          {/* 24/7 — not a simple integer, so a fade-in only */}
          <motion.div
            variants={fadeUp}
            className="px-4"
          >
            <h4 className="text-4xl font-serif font-bold text-legal-gold">24/7</h4>
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Atención Penal</p>
          </motion.div>
          <CountUpStat target={100} suffix="%" label="Confidencialidad" />
        </motion.div>
      </section>

      {/* ── [3] ÁREAS DE PRÁCTICA ── */}
      <section id="areas" className="py-24 bg-legal-navy px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">
              Defensa Estratégica en Casos de Alta Complejidad
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Seleccionamos cuidadosamente cada expediente para garantizar el rigor y la contundencia que nos caracteriza.
            </p>
          </motion.div>

          {/* Stagger grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            <AreaCard
              icon={<Building className="w-10 h-10" />}
              title="Derecho Corporativo y Mercantil"
              description="Litigios societarios, quiebras, fusiones complejas y blindaje fiscal para la protección absoluta de su empresa y junta directiva."
            />
            <AreaCard
              icon={<Scale className="w-10 h-10" />}
              title="Litigio Civil y Patrimonial"
              description="Divorcios de alto riesgo, herencias complejas, disputas contractuales y estrategias robustas para la protección de bienes familiares."
            />
            <AreaCard
              icon={<Shield className="w-10 h-10" />}
              title="Defensa Penal Especializada"
              description="Defensa ante tribunales, extradiciones, fraudes corporativos y recursos de libertad personal ante las más altas autoridades."
            />
          </motion.div>
        </div>
      </section>

      {/* ── [4] EL SOCIO FUNDADOR ── */}
      <section id="firma" className="py-24 bg-[#0A111F]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Foto ejecutiva */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.0, ease: EASE_POWER }}
              className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#111A30]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A111F] via-transparent to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center bg-[#0d1526]">
                <Users className="w-32 h-32 text-slate-800" />
              </div>
              <span className="absolute bottom-8 left-8 text-slate-500 font-serif z-20 italic text-sm">
                Valles Legal • Archivo Fotográfico
              </span>
            </motion.div>

            {/* Copy */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
              className="space-y-6"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-legal-gold text-xs font-bold uppercase tracking-widest">
                <Briefcase className="w-4 h-4" />
                La Firma
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-serif font-bold text-white">
                Estrategas jurídicos implacables a su favor.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed pt-2">
                Cuando su patrimonio o su futuro están en juego,{" "}
                <strong className="text-white font-normal">no hay margen para improvisar</strong>.
              </motion.p>
              <motion.p variants={fadeUp} className="text-slate-400 leading-relaxed">
                Nuestros abogados asociados son veteranos en los tribunales, con una filosofía
                basada en la anticipación del rival y en hablar con la cruda verdad a nuestros
                representados desde el primer minuto. Nos adelantamos al problema, mitigamos los
                riesgos ocultos y actuamos con una precisión quirúrgica.
              </motion.p>
              <motion.div variants={fadeUp} className="pt-8">
                <motion.a
                  href="#evaluacion"
                  whileHover={{ boxShadow: "0 0 20px rgba(194, 155, 87, 0.3)", backgroundColor: "rgba(194,155,87,1)", color: "#0A142F" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="inline-flex items-center gap-2 border border-legal-gold text-legal-gold font-bold py-3 px-8 rounded-lg text-sm tracking-widest uppercase cursor-pointer"
                >
                  Solicitar Evaluación Privada
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── [5] PRUEBA SOCIAL / TESTIMONIOS ── */}
      <section className="py-24 bg-legal-navy px-4 md:px-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">
              Resultados Blindados. Clientes Protegidos.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Nuestra mayor victoria es el silencio y la tranquilidad de aquellos a quienes representamos.
            </p>
          </motion.div>

          {/* Stagger grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            <TestimonialCard
              quote="La firma bloqueó legalmente el embargo e instruyó una contra-demanda que rescató el 85% de nuestros activos frente a una multinacional. Letales en su investigación y ejecución."
              initials="E. R."
              role="Junta Directiva Sector Financiero"
            />
            <TestimonialCard
              quote="Buscábamos un bufete que no tuviera miedo de ir a juicio. Desmontaron cada acusatorio con pruebas irrefutables. La decisión de contratarlos nos devolvió la libertad operativa."
              initials="A. G."
              role="Socio Mayoritario Industrial"
            />
            <TestimonialCard
              quote="En un caso de familia de extrema tensión, aportaron la cordura legal y la agresividad procesal necesaria para asegurar la custodia y los bienes. Cero margen de error."
              initials="M. V."
              role="Cliente Civil Confidencial"
            />
          </motion.div>
        </div>
      </section>

      {/* ── [7] FOOTER ESTRICTO ── */}
      <footer className="bg-[#050B16] py-16 text-center text-slate-500 text-sm border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Scale className="text-slate-600 w-8 h-8" />
            <span className="font-serif text-2xl text-slate-300 font-bold uppercase tracking-widest">
              Valles <span className="text-slate-600">Legal</span>
            </span>
          </div>
          <div className="space-y-1 uppercase tracking-widest text-xs font-bold text-slate-400">
            <p>Torre Financiera Empresarial, Piso 8, Oficina 84.</p>
            <p>Atención Internacional y Nacional</p>
          </div>
          <div className="bg-[#0A111F] border border-slate-800 p-6 rounded-lg my-8">
            <p className="text-xs leading-relaxed text-slate-400 text-justify md:text-center">
              <strong>DESCARGO DE RESPONSABILIDAD:</strong> Esta es una evaluación preliminar.
              La información enviada mediante esta plataforma se maneja bajo el más estricto
              secreto profesional. Sin embargo, enviar esta solicitud NO constituye el inicio
              automático de una relación formal de Abogado-Cliente sin previo contrato de
              mandato y honorarios firmado por ambas partes.
            </p>
          </div>
          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-center items-center gap-6 text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-legal-gold transition-colors">Política de Privacidad</a>
            <span className="hidden md:inline text-slate-700">•</span>
            <a href="#" className="hover:text-legal-gold transition-colors">Términos Legales</a>
            <span className="hidden md:inline text-slate-700">•</span>
            <span>Copyright © {new Date().getFullYear()} Valles Legal.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
