"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useCallback, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Download,
  Linkedin,
  GraduationCap,
  Briefcase,
  Sparkles,
  ArrowDown,
} from "lucide-react";

/* ───── animation variants ───── */

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease },
  },
};

const revealLine = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease },
  },
};

/* ───── main page ───── */

export default function Home() {
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = useCallback(async () => {
    setExporting(true);
    try {
      const [{ toCanvas }, { PDFDocument }, { saveAs }] = await Promise.all([
        import("html-to-image"),
        import("pdf-lib"),
        import("file-saver"),
      ]);
      const el = document.querySelector(".cv-container") as HTMLElement;
      if (!el) return;

      const canvas = await toCanvas(el, {
        pixelRatio: 2,
        cacheBust: true,
        filter: (node: HTMLElement) => !node.classList?.contains("no-print"),
      });

      const pngBlob = await new Promise<Blob>((res) =>
        canvas.toBlob((b) => res(b!), "image/png")
      );
      const pngBytes = await pngBlob.arrayBuffer();

      const pdf = await PDFDocument.create();
      const img = await pdf.embedPng(pngBytes);
      const a4Width = 595.28;
      const scale = a4Width / img.width;
      const pageHeight = img.height * scale;
      const page = pdf.addPage([a4Width, pageHeight]);
      page.drawImage(img, { x: 0, y: 0, width: a4Width, height: pageHeight });

      const pdfBytes = await pdf.save();
      saveAs(
        new Blob([pdfBytes as BlobPart], { type: "application/pdf" }),
        "Layla_van_Bruggen_CV.pdf"
      );
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF generation failed — opening print dialog as fallback.");
      window.print();
    } finally {
      setExporting(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f4f0]">
      {/* Download FAB */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={handleExportPDF}
        disabled={exporting}
        className="no-print fixed right-6 bottom-6 z-50 flex items-center gap-2.5 rounded-full bg-sidebar px-5 py-3.5 text-sm font-medium text-white shadow-2xl transition-all hover:scale-105 hover:shadow-gold/25 hover:shadow-xl active:scale-95 cursor-pointer group disabled:opacity-70 disabled:cursor-wait"
      >
        <Download className={`h-4 w-4 transition-transform group-hover:-translate-y-0.5 ${exporting ? "animate-bounce" : ""}`} />
        {exporting ? "Generating…" : "Export PDF"}
      </motion.button>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="no-print fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4 text-muted/40" />
        </motion.div>
      </motion.div>

      {/* CV Container */}
      <div className="flex min-h-screen items-start justify-center px-4 py-8 sm:px-8 sm:py-16 print:p-0 print:items-start">
        <div className="cv-container w-full max-w-[1060px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.08)] print:max-w-none print:rounded-none print:shadow-none">

          {/* ═══ HERO SECTION ═══ */}
          <div className="grid grid-cols-[360px_1fr]">
            {/* Sidebar top — photo + name area */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="relative flex flex-col items-center bg-sidebar px-8 pt-12 pb-10"
            >
              {/* Decorative gold line */}
              <motion.div
                variants={revealLine}
                className="absolute top-0 left-8 right-8 h-[2px] origin-left bg-gradient-to-r from-gold via-gold-light to-transparent"
              />

              {/* Photo */}
              <PhotoWithSparks />

              {/* Name on sidebar */}
              <motion.h1
                variants={fadeUp}
                className="text-center font-serif text-3xl font-semibold leading-tight text-white whitespace-nowrap"
              >
                Layla <span className="text-gold">van Bruggen</span>
              </motion.h1>

              <motion.div
                variants={revealLine}
                className="my-4 h-px w-16 origin-center bg-gold/40"
              />

              <motion.p
                variants={fadeUp}
                className="text-center text-[13px] font-medium uppercase tracking-[0.35em] leading-relaxed text-sidebar-foreground/60"
              >
                Communications
                <br />
                Strategist
              </motion.p>
            </motion.div>

            {/* Hero right — tagline + summary */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="flex flex-col justify-center px-12 py-12"
            >
              <motion.div variants={fadeRight} className="mb-1">
                <span className="relative inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-gold">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                  </span>
                  Available for London roles
                </span>
              </motion.div>

              <motion.blockquote variants={fadeUp} className="my-6">
                <p className="font-serif text-[2.6rem] font-medium leading-[1.15] tracking-tight text-foreground">
                  I turn boardroom
                  <br />
                  strategy into stories
                  <br />
                  that move{" "}
                  <motion.span
                    className="relative inline-block text-gold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    7,000
                    <motion.span
                      className="absolute -bottom-1 left-0 h-[2px] w-full bg-gold/40"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                      style={{ originX: 0 }}
                    />
                  </motion.span>{" "}
                  people.
                </p>
              </motion.blockquote>

              <motion.p
                variants={fadeUp}
                className="max-w-md text-sm leading-relaxed text-muted"
              >
                Senior communications professional with a strong track record
                in corporate and internal communications. Experienced in
                advising C&#8209;suite stakeholders, driving strategic initiatives,
                and translating organisational strategy into compelling narratives.
              </motion.p>
            </motion.div>
          </div>

          {/* Gold divider band */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 1, ease }}
            className="h-[2px] origin-left bg-gradient-to-r from-sidebar via-gold to-sidebar"
          />

          {/* ═══ BODY: SIDEBAR + CONTENT ═══ */}
          <div className="grid grid-cols-[360px_1fr]">
            {/* Sidebar bottom — details */}
            <SidebarDetails />

            {/* Main content — experience */}
            <MainContent />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SIDEBAR DETAILS
   ═══════════════════════════════════════════ */

function SidebarDetails() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.aside
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger}
      className="flex flex-col bg-sidebar px-8 py-10"
    >
      {/* Contact */}
      <motion.div variants={fadeLeft}>
        <SidebarHeading>Contact</SidebarHeading>
        <div className="space-y-3 text-sm">
          <ContactItem icon={MapPin} text="Amsterdam, NL" />
          <ContactItem icon={Phone} text="+31 6 2556 7245" />
          <ContactItem icon={Mail} text="l.van.bruggen@hotmail.com" />
          <ContactItem icon={Linkedin} text="LinkedIn" href="https://www.linkedin.com/in/laylavanbruggen/" />
        </div>
      </motion.div>

      {/* Education */}
      <motion.div variants={fadeLeft} className="mt-8">
        <SidebarHeading>Education</SidebarHeading>
        <div className="space-y-4">
          <EduItem
            degree="Master of Arts"
            field="Communication & Information Sciences"
            school="Vrije Universiteit Amsterdam"
          />
          <EduItem
            degree="Bachelor of Arts"
            field="Communication & Information Sciences"
            school="Vrije Universiteit Amsterdam"
          />
          <EduItem
            degree="Minor"
            field="International Relations"
            school="Universitas Gadjah Mada, Indonesia"
          />
        </div>
      </motion.div>

      {/* Languages */}
      <motion.div variants={fadeLeft} className="mt-8">
        <SidebarHeading>Languages</SidebarHeading>
        <div className="space-y-3">
          <LangBar lang="Dutch" level="Native" pct={100} delay={0.8} />
          <LangBar lang="English" level="Full professional" pct={90} delay={1.0} />
        </div>
      </motion.div>

      {/* Tools */}
      <motion.div variants={fadeLeft} className="mt-8">
        <SidebarHeading>Tools & Tech</SidebarHeading>
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.4 } } }}
          className="flex flex-wrap gap-1.5"
        >
          {[
            "Microsoft 365",
            "WordPress",
            "HubSpot",
            "Poppulo",
            "Google Analytics",
            "MailChimp",
            "ChatGPT",
            "Claude",
          ].map((tool) => (
            <motion.span
              key={tool}
              variants={scaleIn}
              whileHover={{
                scale: 1.08,
                y: -2,
                boxShadow: "0 4px 12px rgba(200,165,90,0.25)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              style={{ borderColor: "rgba(200,165,90,0.2)" }}
              className="rounded-full border bg-gold/5 px-3 py-1 text-xs text-gold-light hover:!border-[rgba(200,165,90,0.6)] transition-colors cursor-default"
            >
              {tool}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.aside>
  );
}

/* ═══════════════════════════════════════════
   MAIN CONTENT
   ═══════════════════════════════════════════ */

function MainContent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.main
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger}
      className="px-12 py-10"
    >
      {/* Section heading: Experience */}
      <motion.div variants={fadeUp} className="mb-8 flex items-center gap-3">
        <motion.span
          initial={{ rotate: -20, scale: 0 }}
          animate={isInView ? { rotate: 0, scale: 1 } : {}}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 12 }}
        >
          <Briefcase className="h-4 w-4 text-gold" />
        </motion.span>
        <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground">
          Experience
        </h2>
        <motion.div
          variants={revealLine}
          className="h-px flex-1 origin-left bg-border"
        />
      </motion.div>

      {/* Deloitte */}
      <motion.div variants={fadeUp} className="print-break-avoid">
        <ExperienceCard
          title="Senior Consultant Internal Communications"
          company="Deloitte"
          period="May 2022 — Present"
          highlight
          bullets={[
            "Own the firmwide internal communications narrative at corporate level, aligning with business strategy and leadership priorities",
            "Drive strategic communications across Talent, DE&I, and Leadership — translating complex priorities into clear, engaging stories",
            "Partner with senior stakeholders to safeguard brand integrity and communication standards",
            "Deliver cohesive employer branding communications, connecting internal culture with external positioning",
            "Advise leadership on communication strategy, tone of voice, and channel effectiveness",
          ]}
        />
      </motion.div>

      {/* Strict */}
      <motion.div variants={fadeUp} className="mt-7 print-break-avoid">
        <ExperienceCard
          title="Marketing Communications Specialist"
          company="Strict"
          period="Aug 2021 — Apr 2022"
          bullets={[
            "Owned internal and external corporate communications for an IT consulting firm",
            "Increased social media engagement by 68% through strategic content production and distribution",
            "Led cross-functional marketing projects across Strict and Strict Young Professionals",
          ]}
        />
      </motion.div>

      {/* Self-employed */}
      <motion.div variants={fadeUp} className="mt-7 print-break-avoid">
        <ExperienceCard
          title="Communications Specialist"
          company="Van Bruggen Communications — Self-employed"
          period="Dec 2020 — Apr 2022"
          bullets={[
            "Managed communications for three clients — editorial content, strategic plans, and social media management",
            "Drove online traffic and engagement through data analysis and content strategy",
          ]}
        />
      </motion.div>

      {/* Earlier Experience */}
      <motion.div variants={fadeUp} className="mt-8">
        <div className="mb-4 flex items-center gap-3">
          <motion.span
            initial={{ rotate: -20, scale: 0 }}
            animate={isInView ? { rotate: 0, scale: 1 } : {}}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 12 }}
          >
            <Sparkles className="h-4 w-4 text-gold" />
          </motion.span>
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground">
            Earlier Experience
          </h3>
          <motion.div
            variants={revealLine}
            className="h-px flex-1 origin-left bg-border"
          />
        </div>
        <div className="space-y-2.5">
          <EarlierRole role="Content Producer" company="ABN AMRO" period="2021" />
          <EarlierRole role="Data Entry Assistant" company="De Bijenkorf" period="2020" />
          <EarlierRole role="Social Media & Marketing" company="Royal Coster Diamonds" period="2020" />
          <EarlierRole role="Sales Supervisor / Interim Asst. Store Manager" company="Michael Kors" period="2017 — 2019" />
          <EarlierRole role="Visual Merchandiser" company="Michael Kors" period="2015 — 2016" />
        </div>
      </motion.div>

      {/* Academic */}
      <motion.div variants={fadeUp} className="mt-8">
        <div className="mb-4 flex items-center gap-3">
          <motion.span
            initial={{ rotate: -20, scale: 0 }}
            animate={isInView ? { rotate: 0, scale: 1 } : {}}
            transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 12 }}
          >
            <GraduationCap className="h-4 w-4 text-gold" />
          </motion.span>
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground">
            Academic
          </h3>
          <motion.div
            variants={revealLine}
            className="h-px flex-1 origin-left bg-border"
          />
        </div>
        <p className="text-sm leading-relaxed text-muted">
          <span className="font-medium text-foreground/80">Student Assistant</span>{" "}
          — Vrije Universiteit Amsterdam. Taught Visual Rhetorics and Text Conventions.
          Guest speaker on Social Media Management.
        </p>
      </motion.div>
    </motion.main>
  );
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════ */

function PhotoWithSparks() {
  const [sparks, setSparks] = useState<number[]>([]);

  const handleClick = useCallback(() => {
    const batch = Array.from({ length: 14 }, (_, i) => Date.now() + i);
    setSparks(batch);
    setTimeout(() => setSparks([]), 1800);
  }, []);

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.12 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative mb-6 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-48 w-48 overflow-hidden rounded-full ring-2 ring-gold/30 ring-offset-4 ring-offset-sidebar transition-shadow duration-300 hover:shadow-[0_0_25px_6px_rgba(200,165,90,0.45)] hover:ring-gold/60">
        <Image
          src="/photo.png"
          alt="Layla van Bruggen"
          fill
          className="object-cover object-top"
          priority
        />
      </div>
      {/* Animated ring */}
      <motion.div
        className="absolute -inset-2 rounded-full border"
        style={{ borderColor: "rgba(200,165,90,0.2)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      {/* Spark burst */}
      {sparks.map((id, i) => {
        const angle = (360 / sparks.length) * i;
        const radius = 96;
        const startX = Math.cos((angle * Math.PI) / 180) * radius;
        const startY = Math.sin((angle * Math.PI) / 180) * radius;
        const dist = 60 + Math.random() * 70;
        const size = 3 + Math.random() * 4;
        return (
          <motion.span
            key={id}
            initial={{ opacity: 1, x: startX, y: startY, scale: 1.2 }}
            animate={{
              opacity: 0,
              x: startX + Math.cos((angle * Math.PI) / 180) * dist,
              y: startY + Math.sin((angle * Math.PI) / 180) * dist,
              scale: 0,
            }}
            transition={{ duration: 1.0 + Math.random() * 0.5, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-full bg-gold"
            style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
          />
        );
      })}
    </motion.div>
  );
}

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
        {children}
      </h2>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function ContactItem({
  icon: Icon,
  text,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  href?: string;
}) {
  const inner = (
    <motion.span
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="group/contact flex items-center gap-3 text-sidebar-foreground/80 transition-colors hover:text-white cursor-default"
    >
      <motion.span className="shrink-0 transition-colors group-hover/contact:text-gold">
        <Icon className="h-3.5 w-3.5" />
      </motion.span>
      {text}
    </motion.span>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}

function EduItem({ degree, field, school }: { degree: string; field: string; school: string }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="group relative cursor-default pl-3"
    >
      <div className="absolute left-0 top-0 h-0 w-[2px] rounded-full bg-gold/60 transition-all duration-300 group-hover:h-full" />
      <p className="text-xs font-semibold uppercase tracking-wider text-gold/80 transition-colors group-hover:text-gold">
        {degree}
      </p>
      <p className="text-sm text-sidebar-foreground/90">{field}</p>
      <p className="text-xs text-sidebar-foreground/50">{school}</p>
    </motion.div>
  );
}

function LangBar({ lang, level, pct, delay }: { lang: string; level: string; pct: number; delay: number }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="font-medium text-sidebar-foreground/90">{lang}</span>
        <span className="text-sidebar-foreground/50">{level}</span>
      </div>
      <div className="group/lang h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay, duration: 1, ease }}
          className="relative h-full rounded-full bg-gradient-to-r from-gold/60 via-gold to-gold-light overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer opacity-0 group-hover/lang:opacity-100 transition-opacity" />
        </motion.div>
      </div>
    </div>
  );
}

function ExperienceCard({
  title,
  company,
  period,
  bullets,
  highlight,
}: {
  title: string;
  company: string;
  period: string;
  bullets: string[];
  highlight?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: highlight ? "0 8px 30px rgba(200,165,90,0.1)" : "0 8px 30px rgba(0,0,0,0.06)" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative rounded-xl border p-5 transition-colors ${
        highlight
          ? "border-gold/15 bg-gold/[0.02] hover:border-gold/30"
          : "border-transparent hover:border-border hover:bg-stone-50/50"
      }`}
    >
      {highlight && (
        <div className="absolute top-5 left-0 h-8 w-[2px] rounded-full bg-gold" />
      )}
      <div className="mb-1.5 flex items-baseline justify-between gap-4">
        <h3 className="text-[0.9rem] font-semibold text-foreground">{title}</h3>
        <span className="shrink-0 text-xs tabular-nums text-muted">{period}</span>
      </div>
      <p className="mb-3 text-xs font-medium text-gold">{company}</p>
      <ul className="space-y-2">
        {bullets.map((b) => (
          <motion.li
            key={b}
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="group/bullet flex gap-3 text-[0.82rem] leading-relaxed text-muted cursor-default"
          >
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold/40 transition-colors duration-200 group-hover/bullet:bg-gold" />
            <span className="transition-colors duration-200 group-hover/bullet:text-foreground/70">{b}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function EarlierRole({ role, company, period }: { role: string; company: string; period: string }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="group flex items-baseline gap-2 text-sm cursor-default"
    >
      <span className="relative mt-[5px] h-1.5 w-1.5 shrink-0">
        <span className="absolute inset-0 rounded-full bg-gold/30 transition-all duration-300 group-hover:bg-gold group-hover:scale-150" />
        <span className="absolute inset-0 rounded-full bg-gold/0 transition-all duration-500 group-hover:bg-gold/20 group-hover:scale-[3]" />
      </span>
      <span className="font-medium text-foreground/70 transition-colors duration-200 group-hover:text-foreground">{role}</span>
      <span className="text-muted/40">—</span>
      <span className="text-muted/70 transition-colors duration-200 group-hover:text-muted">{company}</span>
      <span className="ml-auto shrink-0 text-xs tabular-nums text-muted/40">{period}</span>
    </motion.div>
  );
}
