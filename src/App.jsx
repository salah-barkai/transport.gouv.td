import { useState, useEffect, useRef } from "react";

/* ============================================================
   GUIDE D'INTÉGRATION DES IMAGES
   ============================================================
   Toutes les images sont centralisées dans l'objet IMAGES ci-dessous.
   Pour remplacer une image, changez simplement la valeur de l'URL.

   Formats acceptés :
   - URL externe : "https://example.com/mon-image.jpg"
   - Chemin local : "/images/hero-bg.jpg"  (dans dossier public/)
   - Import direct : import heroImg from "./assets/hero.jpg"  → heroImg

   LISTE DE TOUTES LES IMAGES À REMPLACER :
   ============================================================ */
const IMAGES = {
  // ── HERO (page d'accueil) ──────────────────────────────────
  // Recommandé : photo aérienne de N'Djaména ou de l'aéroport Hassan Djamous
  // Dimensions idéales : 1920x700px
  hero_bg: "image/image pour acceuil.jpg",

  // ── PORTRAIT DE LA MINISTRE ───────────────────────────────
  // Recommandé : photo officielle de Mme Fatimé Goukouni Weddeye
  // Dimensions idéales : 400x500px (portrait)
  ministre: "image/Ministre de transport.jpg",

  // ── LOGO DU MINISTÈRE ────────────────────────────────────
  // Remplacez par les armoiries ou le logo officiel du MTACMN
  // Dimensions idéales : 120x120px (carré, fond transparent PNG)
  logo: "image/logo.jpg", // null = affiche les armoiries texte à la place

  // ── STRUCTURES SOUS TUTELLE ───────────────────────────────
  // Photo représentative de chaque agence
  adac: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",  // Aviation / aéroport
  anam: "https://images.unsplash.com/photo-1504608524841-42584120d238?w=600&q=80",  // Météo / ciel nuages
  dgtt: "https://images.unsplash.com/photo-1545173168-9f1947eb7a44?w=600&q=80",    // Routes / transport

  // ── ARTICLES / ACTUALITÉS ────────────────────────────────
  // Chaque article a sa propre image. Modifiez ici ou via le dashboard admin.
  article_1: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",  // Aéroport / avion
  article_2: "https://images.unsplash.com/photo-1504608524841-42584120d238?w=800&q=80",  // Météo / nuages
  article_3: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",  // Document / réglementation
  article_4: "https://images.unsplash.com/photo-1545173168-9f1947eb7a44?w=800&q=80",    // Route / infrastructure
  article_5: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",    // Sécurité routière

  // ── SECTION PROJETS ───────────────────────────────────────
  projet_aeroport: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80",
  projet_rail: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80",
  projet_port: "https://images.unsplash.com/photo-1504636130927-19c5a8f7c94a?w=800&q=80",
  projet_meteo: "https://images.unsplash.com/photo-1504608524841-42584120d238?w=800&q=80",

  // ── MÉTÉOROLOGIE ─────────────────────────────────────────
  meteo_hero: "https://images.unsplash.com/photo-1534088568-c1a89c8c1b91?w=1200&q=80",

  // ── BANNIÈRES SECTEURS (header de chaque page) ────────────
  banner_transport: "https://images.unsplash.com/photo-1545173168-9f1947eb7a44?w=1200&q=80",
  banner_aviation: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
  banner_meteo: "https://images.unsplash.com/photo-1504608524841-42584120d238?w=1200&q=80",
  banner_reglementation: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80",
};

/* ============================================================
   DONNÉES RÉELLES DU MINISTÈRE
   ============================================================ */
const MINISTERE = {
  nom: "Ministère des Transports, de l'Aviation Civile et de la Météorologie Nationale",
  sigle: "MTACMN",
  ministre: "Mme Fatimé Goukouni Weddeye",
  secretaireGeneral: "Dihoulné Laurent",
  president: "Maréchal Mahamat Idriss Déby Itno",
  adresse: "N'Djaména, République du Tchad",
  telephone: "+235 22 51 44 92",
  email: "contact@transports.gouv.td",
  siteOfficiel: "transports.gouv.td",
  bp: "BP 578",
};

const ACTUALITES_INITIALES = [
  {
    id: 1,
    titre: "Audit OACI : La ministre évalue les préparatifs à l'aéroport Hassan Djamous",
    date: "21 mars 2026",
    categorie: "Aviation Civile",
    resume: "La ministre Fatimé Goukouni Weddeye a effectué une visite à l'Aéroport international Hassan Djamous à quelques jours d'un audit international de l'OACI en matière de sûreté aérienne.",
    contenu: "La ministre des Transports, de l'Aviation civile et de la Météorologie nationale, Fatimé Goukouni Weddeye, a effectué ce samedi 21 mars une visite à l'Aéroport international Hassan Djamous. Cette descente sur le terrain visait à galvaniser les équipes et à s'assurer de la pleine préparation avant l'audit OACI. La piste d'atterrissage a bénéficié d'une réhabilitation complète avec installation de nouveaux équipements de sécurité modernisés. Le ministère entend se conformer à toutes les normes internationales de l'Organisation de l'Aviation Civile Internationale.",
    image: IMAGES.article_1,
    imageKey: "article_1",
    une: true,
  },
  {
    id: 2,
    titre: "Semaine Nationale de la Météorologie 2026 : « Observer aujourd'hui pour protéger demain »",
    date: "24 mars 2026",
    categorie: "Météorologie",
    resume: "L'ANAM a lancé officiellement la Semaine nationale de la météorologie (SENAMET) sous le thème « Observer aujourd'hui et protéger demain », avec le soutien de partenaires internationaux.",
    contenu: "Le ministère des Transports, à travers l'Agence nationale de la météorologie (ANAM), a lancé officiellement la Semaine nationale de la météorologie (SENAMET). L'objectif est de sensibiliser les populations et de mobiliser des ressources pour moderniser le réseau d'observation météorologique. Les activités comprennent des panels et ateliers avec l'appui du PAM, la Banque mondiale, le PNUD et l'OMM.",
    image: IMAGES.article_2,
    imageKey: "article_2",
    une: false,
  },
  {
    id: 3,
    titre: "Normes ASSA-AC : Atelier de vulgarisation de la réglementation aéronautique CEMAC",
    date: "16 février 2026",
    categorie: "Aviation Civile",
    resume: "Atelier de vulgarisation des normes communautaires de l'ASSA-AC au Centre CIFOP de Farcha pour renforcer la sécurité du transport aérien national.",
    contenu: "Le Secrétaire général Dihoulne Laurent a présidé l'atelier de vulgarisation de la réglementation communautaire de l'Agence de Supervision de la Sécurité Aérienne en Afrique Centrale (ASSA-AC). Cet atelier vise à renforcer la compréhension et l'application effective des normes aéronautiques communautaires de la zone CEMAC par les acteurs de l'aviation civile tchadienne.",
    image: IMAGES.article_3,
    imageKey: "article_3",
    une: false,
  },
  {
    id: 4,
    titre: "Transports : Évaluation stratégique du programme présidentiel — Chantier 8",
    date: "2 mars 2026",
    categorie: "Transports",
    resume: "Le Premier ministre Allah Maye Halina a présidé une réunion d'évaluation du volet transport du programme présidentiel, couvrant le désenclavement et la modernisation des infrastructures.",
    contenu: "La réunion a évalué l'état d'avancement des projets prioritaires : modernisation des infrastructures routières et aéroportuaires, le projet de voie ferrée Tchad–Cameroun, le développement des ports secs à Moundou et Amdjarass, et le renforcement des partenariats avec les compagnies aériennes internationales.",
    image: IMAGES.article_4,
    imageKey: "article_4",
    une: false,
  },
  {
    id: 5,
    titre: "Sécurité routière : Lancement du programme « Ambassadeurs routiers »",
    date: "15 janvier 2026",
    categorie: "Transports",
    resume: "Le ministère lance le programme des ambassadeurs routiers pour la vulgarisation du code de la route et l'amélioration de la sécurité sur les grands axes nationaux.",
    contenu: "Dans le cadre du renforcement de la sécurité routière, le ministère a lancé le programme des « ambassadeurs routiers » pour vulgariser le code de la route et aménager des aires de repos sur les grands axes.",
    image: IMAGES.article_5,
    imageKey: "article_5",
    une: false,
  },
];

const PROJETS = [
  { id: 1, titre: "Réhabilitation Aéroport International Hassan Djamous", avancement: 85, statut: "En cours", budget: "Partenariat OACI/International", description: "Réhabilitation complète de la piste d'atterrissage et installation de nouveaux équipements de sécurité modernisés conformes aux normes OACI.", secteur: "Aviation", image: IMAGES.projet_aeroport },
  { id: 2, titre: "Voie ferrée Tchad–Cameroun", avancement: 25, statut: "Phase d'étude", budget: "Financement BDEAC", description: "Projet stratégique destiné à renforcer l'accès aux corridors régionaux et désenclaver le territoire national.", secteur: "Transport", image: IMAGES.projet_rail },
  { id: 3, titre: "Ports secs de Moundou et Amdjarass", avancement: 60, statut: "En cours", budget: "Budget national", description: "Développement des ports secs et régulation de ceux de Toukra et de Nguéli pour le commerce régional et international.", secteur: "Transport", image: IMAGES.projet_port },
  { id: 4, titre: "Modernisation réseau météorologique ANAM", avancement: 40, statut: "En cours", budget: "PAM / Banque Mondiale / PNUD", description: "Extension du réseau de stations météorologiques pour couvrir l'ensemble du territoire national et améliorer la précision des prévisions.", secteur: "Météo", image: IMAGES.projet_meteo },
];

const REGLEMENTATIONS = [
  { titre: "Code de l'Aviation Civile du Tchad", ref: "Loi N°010/PR/2014", secteur: "Aviation", desc: "Texte fondateur régissant l'ensemble des activités de l'aviation civile sur le territoire tchadien." },
  { titre: "Loi portant création de l'ANAM", ref: "LOI N°035/PR/2015 du 18 août 2015", secteur: "Météorologie", desc: "Création de l'Agence Nationale de la Météorologie avec ses missions, attributions et organisation." },
  { titre: "Décret d'application ANAM", ref: "N°521/PR/PM/MDAMN/2017", secteur: "Météorologie", desc: "Modalités d'application de la loi portant création de l'ANAM et organisation de ses services." },
  { titre: "Code de la Route du Tchad", ref: "Décret réglementaire 2019", secteur: "Transport", desc: "Ensemble des règles relatives à la circulation routière et à la sécurité des usagers sur les voies publiques." },
  { titre: "Réglementation CEMAC / ASSA-AC", ref: "Normes communautaires CEMAC", secteur: "Aviation", desc: "Normes de sécurité et de sûreté de l'Agence de Supervision de la Sécurité Aérienne en Afrique Centrale." },
  { titre: "Convention de l'OMM", ref: "Organisation Météorologique Mondiale — ratifiée", secteur: "Météorologie", desc: "Engagement du Tchad dans le cadre du système météorologique mondial coordonné par l'OMM." },
];

const SOUS_STRUCTURES = [
  { nom: "ADAC", nomComplet: "Autorité de l'Aviation Civile du Tchad", description: "Organe régulateur de la politique de l'aviation civile au Tchad, responsable de la promotion de la sécurité et de la sûreté de l'aviation civile nationale.", email: "info@adactchad.org", telephone: "+235 22 52 54 14", adresse: "BP. 96 Blvd Mahamat Khamis Djongos, N'Djaména", image: IMAGES.adac, couleur: "#1a3a6e" },
  { nom: "ANAM", nomComplet: "Agence Nationale de la Météorologie", description: "Créée par la LOI N° 035/PR/2015, l'ANAM fournit des données, prévisions et informations météorologiques et climatiques aux usagers publics et privés.", email: "contact@meteotchad.org", telephone: "+235 22 51 xx xx", adresse: "N'Djaména, Tchad", image: IMAGES.anam, couleur: "#0a5c46" },
  { nom: "DGTT", nomComplet: "Direction Générale des Transports Terrestres", description: "Responsable de la réglementation, du contrôle et de la planification du transport terrestre sur l'ensemble du territoire national.", email: "dgtt@transports.gouv.td", telephone: "+235 22 51 xx xx", adresse: "N'Djaména, Tchad", image: IMAGES.dgtt, couleur: "#6b2d0d" },
];

/* ============================================================
   COMPOSANTS RÉUTILISABLES
   ============================================================ */
const CAT_COLORS = {
  "Aviation Civile": { bg: "#1a3a6e", light: "#dbeafe", text: "#1e3a8a" },
  "Météorologie": { bg: "#0a5c46", light: "#d1fae5", text: "#065f46" },
  "Transports": { bg: "#7c2d12", light: "#fef3c7", text: "#92400e" },
};

function resolveAssetUrl(src) {
  if (!src || typeof src !== "string") return src;

  // URLs already absolute or embedded.
  if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  const normalized = src.replace(/^\.?\//, "");
  const looksLikeBackendAsset = normalized.startsWith("image/") || normalized.startsWith("uploads/");
  const isViteDev = typeof window !== "undefined" && window.location.port === "5173";

  if (looksLikeBackendAsset && isViteDev) {
    return `http://127.0.0.1:8000/${normalized}`;
  }

  return src;
}

function Badge({ label }) {
  const c = CAT_COLORS[label] || { bg: "#374151", light: "#f3f4f6", text: "#111827" };
  return (
    <span style={{ background: c.bg, color: "#fff", padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
  );
}

function ImagePlaceholder({ label, height = 220 }) {
  return (
    <div style={{ height, background: "linear-gradient(135deg,#e5e7eb,#d1d5db)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 13, gap: 8 }}>
      <span style={{ fontSize: 32 }}>🖼️</span>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 11, opacity: 0.7 }}>Remplacer dans IMAGES</span>
    </div>
  );
}

function ArticleImg({ src, alt, height = 220, style = {} }) {
  if (!src) return <ImagePlaceholder label={alt} height={height} />;
  return <img src={resolveAssetUrl(src)} alt={alt} style={{ width: "100%", height, objectFit: "cover", display: "block", ...style }} onError={e => { e.target.style.display = "none"; e.target.nextSibling && (e.target.nextSibling.style.display = "flex"); }} />;
}

function SectionBanner({ image, title, subtitle, height = 280, overlay = "rgba(0,20,60,0.62)" }) {
  return (
    <div style={{ position: "relative", height, overflow: "hidden" }}>
      {image
        ? <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#1a3a6e,#2563eb)" }} />
      }
      <div style={{ position: "absolute", inset: 0, background: overlay }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(20px,4vw,36px)", fontWeight: 900, margin: "0 0 12px", fontFamily: "'Georgia',serif", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 15, opacity: 0.85, maxWidth: 600, margin: 0, lineHeight: 1.7 }}>{subtitle}</p>}
      </div>
    </div>
  );
}

/* ============================================================
   PAGE ACCUEIL
   ============================================================ */
function PageAccueil({ actualites, setPage, onOpenArticle }) {
  const une = actualites.find(a => a.une) || actualites[0];
  const secondaires = actualites.filter(a => a.id !== une?.id).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <div style={{ position: "relative", height: 580, overflow: "hidden" }}>
        <ArticleImg src={IMAGES.hero_bg} alt="Hero Ministère" height={580} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,20,70,0.88) 0%, rgba(0,20,70,0.55) 60%, rgba(0,20,70,0.15) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 60px" }}>
          <div style={{ maxWidth: 600, color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 3, height: 40, background: "#f59e0b" }} />
              <div>
                <div style={{ fontSize: 11, letterSpacing: 4, fontWeight: 700, opacity: 0.75, textTransform: "uppercase" }}>République du Tchad 🇹🇩</div>
                <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.6, textTransform: "uppercase" }}>Unité · Travail · Progrès</div>
              </div>
            </div>
            <h1 style={{ fontSize: "clamp(22px,3.5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.15, fontFamily: "'Georgia',serif", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
              Ministère des Transports,<br />de l'Aviation Civile<br /><span style={{ color: "#f59e0b" }}>et de la Météorologie Nationale</span>
            </h1>
            <p style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.8, marginBottom: 32, maxWidth: 480 }}>
              Sous la tutelle du Maréchal <strong>Mahamat Idriss Déby Itno</strong>, Président de la République — Désenclavement, mobilité et résilience climatique.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => setPage("actualites")} style={{ background: "#f59e0b", color: "#1a1a2e", border: "none", padding: "13px 28px", borderRadius: 8, fontWeight: 800, cursor: "pointer", fontSize: 14 }}>📰 Actualités</button>
              <button onClick={() => setPage("projets")} style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: "#fff", border: "2px solid rgba(255,255,255,0.35)", padding: "13px 28px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>🚧 Nos Projets</button>
            </div>
          </div>
        </div>
      </div>

      {/* BARRE STATS */}
      <div style={{ background: "#1a3a6e", color: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center" }}>
          {[
            { n: "3", l: "Secteurs stratégiques" },
            { n: "2", l: "Agences sous tutelle" },
            { n: "85%", l: "Réhab. aéroport" },
            { n: "2026", l: "Audit OACI" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "20px 16px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#f59e0b" }}>{s.n}</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTUALITÉ À LA UNE */}
      {une && (
        <div style={{ background: "#f8f9fb", padding: "56px 40px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ width: 4, height: 28, background: "#f59e0b", borderRadius: 2 }} />
              <span style={{ fontWeight: 900, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#6b7280" }}>À la une</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "stretch" }}>
              <div
                style={{ borderRadius: 16, overflow: "hidden", position: "relative", minHeight: 380, cursor: "pointer" }}
                onClick={() => onOpenArticle?.(une)}
              >
                <ArticleImg src={une.image} alt={une.titre} height={380} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.85))", padding: "60px 28px 28px" }}>
                  <Badge label={une.categorie} />
                  <h2 style={{ color: "#fff", fontSize: "clamp(16px,2vw,22px)", fontWeight: 800, margin: "10px 0 6px", lineHeight: 1.3 }}>{une.titre}</h2>
                  <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>📅 {une.date}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {secondaires.map(a => (
                  <div
                    key={a.id}
                    style={{ background: "#fff", borderRadius: 12, overflow: "hidden", display: "flex", gap: 0, flex: 1, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", cursor: "pointer" }}
                    onClick={() => onOpenArticle?.(a)}
                  >
                    <div style={{ width: 110, flexShrink: 0 }}>
                      <ArticleImg src={a.image} alt={a.titre} height="100%" style={{ height: "100%" }} />
                    </div>
                    <div style={{ padding: "14px 16px", flex: 1, minHeight: 0 }}>
                      <Badge label={a.categorie} />
                      <p style={{ fontWeight: 700, fontSize: 13, margin: "7px 0 4px", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.titre}</p>
                      <div style={{ color: "#9ca3af", fontSize: 11 }}>📅 {a.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOT DE LA MINISTRE */}
      <div style={{ padding: "56px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "300px 1fr", gap: 56, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "3/4" }}>
              <ArticleImg src={IMAGES.ministre} alt="Ministre" height={380} style={{ height: "100%" }} />
            </div>
            <div style={{ position: "absolute", bottom: -16, right: -16, background: "#1a3a6e", color: "#fff", borderRadius: 12, padding: "14px 18px", width: 180 }}>
              <div style={{ fontWeight: 800, fontSize: 13, lineHeight: 1.3 }}>Mme Fatimé Goukouni Weddeye</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>Ministre des Transports</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#f59e0b", fontWeight: 700, textTransform: "uppercase", marginBottom: 16 }}>Mot de la Ministre</div>
            <h2 style={{ fontSize: "clamp(20px,2.5vw,32px)", fontWeight: 900, marginBottom: 24, color: "#1a1a2e", lineHeight: 1.25, fontFamily: "'Georgia',serif" }}>Un Tchad connecté, sûr et résilient pour toutes les générations</h2>
            <div style={{ width: 50, height: 3, background: "#f59e0b", marginBottom: 24 }} />
            <p style={{ color: "#374151", lineHeight: 1.9, fontSize: 15, marginBottom: 16 }}>Notre vision stratégique, portée par le Président de la République Maréchal Mahamat Idriss Déby Itno, passe par la mise à disposition des citoyens d'informations fiables et la dématérialisation des démarches administratives.</p>
            <p style={{ color: "#374151", lineHeight: 1.9, fontSize: 15 }}>Le secteur des transports constitue un levier structurant de souveraineté économique et d'intégration régionale. La sécurité aérienne et la météorologie nationale sont au cœur de nos priorités pour 2026. Ensemble, nous bâtirons un Tchad résilient face aux défis du XXIe siècle.</p>
          </div>
        </div>
      </div>

      {/* STRUCTURES SOUS TUTELLE */}
      <div style={{ padding: "56px 40px", background: "#f8f9fb" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#f59e0b", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Structures sous tutelle</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#1a1a2e", margin: 0 }}>Nos Agences Spécialisées</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            {SOUS_STRUCTURES.map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
                  <ArticleImg src={s.image} alt={s.nom} height={200} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(transparent 40%, ${s.couleur}ee)` }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, padding: "16px 20px" }}>
                    <div style={{ color: "#fff", fontWeight: 900, fontSize: 22 }}>{s.nom}</div>
                    <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>{s.nomComplet}</div>
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{s.description}</p>
                  <div style={{ fontSize: 12, color: "#6b7280", display: "flex", flexDirection: "column", gap: 4 }}>
                    <div>📞 {s.telephone}</div>
                    <div>📧 {s.email}</div>
                    <div>📍 {s.adresse}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE ACTUALITÉS
   ============================================================ */
function PageActualites({ actualites, selectedFromHome, onClearSelectedFromHome }) {
  const [selected, setSelected] = useState(selectedFromHome || null);
  const [filtre, setFiltre] = useState("Tous");
  const cats = ["Tous", "Transports", "Aviation Civile", "Météorologie"];
  const filtered = filtre === "Tous" ? actualites : actualites.filter(a => a.categorie === filtre);

  useEffect(() => {
    if (selectedFromHome) {
      setSelected(selectedFromHome);
      onClearSelectedFromHome?.();
    }
  }, [selectedFromHome, onClearSelectedFromHome]);

  if (selected) return (
    <div>
      <div style={{ height: 320, position: "relative", overflow: "hidden" }}>
        <ArticleImg src={selected.image} alt={selected.titre} height={320} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,10,40,0.65)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 40px 36px" }}>
          <Badge label={selected.categorie} />
          <h1 style={{ color: "#fff", fontSize: "clamp(18px,3vw,30px)", fontWeight: 900, margin: "12px 0 8px", maxWidth: 800, lineHeight: 1.25 }}>{selected.titre}</h1>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>📅 Publié le {selected.date}</div>
        </div>
      </div>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px" }}>
        <button onClick={() => setSelected(null)} style={{ color: "#1a3a6e", background: "none", border: "none", cursor: "pointer", fontWeight: 700, marginBottom: 28, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>← Retour aux actualités</button>
        <p style={{ color: "#374151", lineHeight: 2, fontSize: 16 }}>{selected.contenu}</p>
      </div>
    </div>
  );

  return (
    <div>
      <SectionBanner image={IMAGES.banner_transport} title="Actualités" subtitle="Toutes les dernières informations du Ministère des Transports, de l'Aviation Civile et de la Météorologie Nationale" height={260} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFiltre(c)} style={{ padding: "8px 20px", borderRadius: 99, border: "2px solid", cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "all 0.15s", borderColor: filtre === c ? "#1a3a6e" : "#e5e7eb", background: filtre === c ? "#1a3a6e" : "#fff", color: filtre === c ? "#fff" : "#374151" }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 24 }}>
          {filtered.map(a => (
            <article key={a.id} onClick={() => setSelected(a)} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", cursor: "pointer", transition: "transform 0.2s,box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(26,58,110,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; }}>
              <div style={{ height: 200, overflow: "hidden" }}>
                <ArticleImg src={a.image} alt={a.titre} height={200} />
              </div>
              <div style={{ padding: "20px 22px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <Badge label={a.categorie} />
                  <span style={{ color: "#9ca3af", fontSize: 12 }}>{a.date}</span>
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 15, margin: "0 0 10px", lineHeight: 1.4, color: "#1a1a2e" }}>{a.titre}</h3>
                <p style={{ color: "#6b7280", fontSize: 13, margin: 0, lineHeight: 1.65 }}>{a.resume.substring(0, 120)}...</p>
                <div style={{ marginTop: 16, color: "#1a3a6e", fontSize: 13, fontWeight: 700 }}>Lire l'article →</div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af", fontSize: 16 }}>Aucun article dans cette catégorie.</div>}
      </div>
    </div>
  );
}

/* ============================================================
   PAGE PROJETS
   ============================================================ */
function PageProjets() {
  const secteurColor = s => s === "Aviation" ? "#1a3a6e" : s === "Météo" ? "#0a5c46" : "#7c2d12";
  return (
    <div>
      <SectionBanner image={IMAGES.banner_aviation} title="Projets Stratégiques" subtitle="État d'avancement des grands chantiers nationaux portés par le Ministère" height={260} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gap: 28 }}>
          {PROJETS.map((p, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "grid", gridTemplateColumns: "340px 1fr" }}>
              <div style={{ height: "100%", minHeight: 220, overflow: "hidden" }}>
                <ArticleImg src={p.image} alt={p.titre} height="100%" style={{ height: "100%", minHeight: 220 }} />
              </div>
              <div style={{ padding: "32px 36px" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
                  <span style={{ background: secteurColor(p.secteur), color: "#fff", padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{p.secteur}</span>
                  <span style={{ background: p.statut === "En cours" ? "#dcfce7" : "#fef9c3", color: p.statut === "En cours" ? "#166534" : "#854d0e", padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{p.statut}</span>
                </div>
                <h3 style={{ fontWeight: 900, fontSize: 20, margin: "0 0 10px", color: "#1a1a2e" }}>{p.titre}</h3>
                <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>{p.description}</p>
                <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>💰 {p.budget}</span>
                  <span style={{ fontWeight: 800, fontSize: 15, color: secteurColor(p.secteur) }}>{p.avancement}%</span>
                </div>
                <div style={{ background: "#e5e7eb", borderRadius: 99, height: 10 }}>
                  <div style={{ width: `${p.avancement}%`, height: 10, borderRadius: 99, background: `linear-gradient(90deg,${secteurColor(p.secteur)},${secteurColor(p.secteur)}99)`, transition: "width 1s ease" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE MÉTÉOROLOGIE
   ============================================================ */
function PageMeteorologie() {
  const villes = [
    { ville: "N'Djaména", temp: "38°C", cond: "Ensoleillé", hum: "18%", vent: "15 km/h", icon: "☀️" },
    { ville: "Moundou", temp: "34°C", cond: "Partiellement nuageux", hum: "35%", vent: "10 km/h", icon: "⛅" },
    { ville: "Abéché", temp: "40°C", cond: "Très chaud et sec", hum: "12%", vent: "22 km/h", icon: "🌵" },
    { ville: "Sarh", temp: "32°C", cond: "Risque de pluies", hum: "58%", vent: "8 km/h", icon: "🌧️" },
    { ville: "Faya-Largeau", temp: "43°C", cond: "Extrêmement chaud", hum: "8%", vent: "18 km/h", icon: "🏜️" },
    { ville: "Doba", temp: "33°C", cond: "Nuageux", hum: "48%", vent: "12 km/h", icon: "☁️" },
  ];
  return (
    <div>
      <div style={{ position: "relative", height: 360, overflow: "hidden" }}>
        <ArticleImg src={IMAGES.meteo_hero} alt="Météorologie" height={360} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(10,92,70,0.88),rgba(5,150,105,0.65))" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", textAlign: "center", padding: "0 24px" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🌦️</div>
          <h1 style={{ fontSize: "clamp(22px,4vw,40px)", fontWeight: 900, margin: "0 0 10px", fontFamily: "'Georgia',serif" }}>Météorologie Nationale</h1>
          <p style={{ fontSize: 15, opacity: 0.85, maxWidth: 500 }}>Agence Nationale de la Météorologie du Tchad (ANAM)</p>
          <div style={{ marginTop: 14, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", padding: "8px 20px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
            Thème SENAMET 2026 : « Observer aujourd'hui pour protéger demain »
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        <h2 style={{ fontWeight: 900, fontSize: 22, marginBottom: 28, color: "#1a1a2e" }}>Prévisions météo — Grandes villes du Tchad</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20, marginBottom: 48 }}>
          {villes.map((v, i) => (
            <div key={i} style={{ background: "linear-gradient(135deg,#0a5c46,#059669)", borderRadius: 16, padding: 24, color: "#fff", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.1 }}>{v.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{v.ville}</div>
              <div style={{ fontSize: 42, fontWeight: 900, margin: "8px 0" }}>{v.temp}</div>
              <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 12 }}>{v.icon} {v.cond}</div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, opacity: 0.75 }}>
                <span>💧 {v.hum}</span>
                <span>💨 {v.vent}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 36, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
          <h3 style={{ fontWeight: 900, fontSize: 20, marginBottom: 20, color: "#0a5c46" }}>À propos de l'ANAM</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <p style={{ color: "#374151", lineHeight: 1.85, fontSize: 14 }}>L'Agence Nationale de la Météorologie (ANAM) est une entité sous-tutelle du Ministère en charge de l'Aviation Civile et de la Météorologie, créée par la <strong>LOI N° 035/PR/2015</strong> du 18 août 2015. Elle fournit des données, prévisions et informations météorologiques et climatiques aux usagers publics et privés.</p>
              <p style={{ color: "#374151", lineHeight: 1.85, fontSize: 14 }}>Elle contribue à la sécurité du transport aérien, surveille la qualité de l'air, et appuie les politiques nationales de gestion des risques climatiques.</p>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: "#1a1a2e" }}>Domaines d'intervention</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {["Prévisions météo", "Vigilance climatique", "Météo aéronautique", "Climatologie", "Qualité de l'air", "Hydrologie"].map((m, i) => (
                  <div key={i} style={{ background: "#f0fdf4", border: "1px solid #a7f3d0", borderRadius: 8, padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "#065f46" }}>✅ {m}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE RÉGLEMENTATIONS
   ============================================================ */
function PageReglementations() {
  const [filtre, setFiltre] = useState("Tous");
  const cats = ["Tous", "Transport", "Aviation", "Météorologie"];
  const filtered = filtre === "Tous" ? REGLEMENTATIONS : REGLEMENTATIONS.filter(r => r.secteur === filtre);
  const secColor = s => s === "Aviation" ? "#1a3a6e" : s === "Météorologie" ? "#0a5c46" : "#7c2d12";
  return (
    <div>
      <SectionBanner image={IMAGES.banner_reglementation} title="Réglementations & Textes Officiels" subtitle="Lois, décrets et conventions applicables au secteur des Transports, de l'Aviation Civile et de la Météorologie" height={260} />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFiltre(c)} style={{ padding: "8px 20px", borderRadius: 99, border: "2px solid", cursor: "pointer", fontWeight: 700, fontSize: 13, borderColor: filtre === c ? "#1a3a6e" : "#e5e7eb", background: filtre === c ? "#1a3a6e" : "#fff", color: filtre === c ? "#fff" : "#374151" }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {filtered.map((r, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "22px 28px", display: "flex", gap: 20, alignItems: "flex-start", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", borderLeft: `4px solid ${secColor(r.secteur)}` }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: `${secColor(r.secteur)}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📄</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 800, fontSize: 15, color: "#1a1a2e" }}>{r.titre}</span>
                  <span style={{ background: secColor(r.secteur), color: "#fff", padding: "2px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{r.secteur}</span>
                </div>
                <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 6 }}>Réf. : <strong>{r.ref}</strong></div>
                <p style={{ color: "#374151", fontSize: 13, margin: 0, lineHeight: 1.65 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE CONTACT
   ============================================================ */
function PageContact() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <SectionBanner image={IMAGES.banner_transport} title="Nous Contacter" subtitle="Le Ministère est à votre disposition pour toute demande d'information ou démarche administrative" height={240} />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 36 }}>
          {/* Infos officielles */}
          <div>
            <h3 style={{ fontWeight: 900, fontSize: 18, marginBottom: 24, color: "#1a1a2e" }}>Informations officielles</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                ["📍", "Adresse", MINISTERE.adresse],
                ["📞", "Téléphone", MINISTERE.telephone],
                ["📧", "Email", MINISTERE.email],
                ["🌐", "Site web", MINISTERE.siteOfficiel],
                ["📬", "Boîte postale", MINISTERE.bp],
              ].map(([ic, k, v]) => (
                <div key={k} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                  <span style={{ fontSize: 22 }}>{ic}</span>
                  <div>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{k}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2, color: "#1a1a2e" }}>{v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 36, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>Message envoyé !</h3>
                <p style={{ color: "#6b7280", fontSize: 14 }}>Notre équipe vous répondra dans les plus brefs délais.</p>
                <button onClick={() => setSent(false)} style={{ marginTop: 20, background: "#1a3a6e", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Nouveau message</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontWeight: 900, fontSize: 18, marginBottom: 24, color: "#1a1a2e" }}>Envoyer un message</h3>
                {[["Nom complet", "text"], ["Email", "email"], ["Sujet", "text"]].map(([label, type]) => (
                  <div key={label} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6, color: "#374151" }}>{label}</label>
                    <input type={type} style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 14, boxSizing: "border-box", outline: "none" }} placeholder={label} onFocus={e => e.target.style.borderColor = "#1a3a6e"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                  </div>
                ))}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6, color: "#374151" }}>Message</label>
                  <textarea rows={5} style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 14, resize: "vertical", boxSizing: "border-box", outline: "none" }} placeholder="Décrivez votre demande..." onFocus={e => e.target.style.borderColor = "#1a3a6e"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                </div>
                <button onClick={() => setSent(true)} style={{ background: "#1a3a6e", color: "#fff", border: "none", padding: "13px", borderRadius: 10, fontWeight: 800, cursor: "pointer", width: "100%", fontSize: 15 }}>Envoyer le message →</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   NAVIGATION PRINCIPALE
   ============================================================ */
const NAV_LINKS = [
  { id: "accueil", label: "Accueil" },
  { id: "actualites", label: "Actualités" },
  { id: "projets", label: "Projets" },
  { id: "meteorologie", label: "Météorologie" },
  { id: "reglementations", label: "Réglementations" },
  { id: "contact", label: "Contact" },
];

const VALID_PAGES = new Set(NAV_LINKS.map((n) => n.id));

function getPageFromHash() {
  if (typeof window === "undefined") return "accueil";
  const hash = (window.location.hash || "").replace(/^#/, "").trim().toLowerCase();
  return VALID_PAGES.has(hash) ? hash : "accueil";
}

/* ============================================================
   APP PRINCIPALE — SITE PUBLIC
   ============================================================ */
export default function SitePublic() {
  const [page, setPage] = useState(getPageFromHash);
  const [actualites, setActualites] = useState(ACTUALITES_INITIALES);
  const [selectedActualite, setSelectedActualite] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Écoute les nouveaux articles publiés depuis le dashboard
  // Dans un vrai projet, cela passe par une API ou localStorage partagé
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "mtacmn_articles") {
        try { setActualites(JSON.parse(e.newValue)); } catch (error) { console.warn("Sync localStorage invalide", error); }
      }
    };
    window.addEventListener("storage", handler);
    const saved = localStorage.getItem("mtacmn_articles");
    if (saved) try { setActualites(JSON.parse(saved)); } catch (error) { console.warn("Cache local invalide", error); }
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Garder l'état de navigation dans l'URL (hash) pour survivre au refresh.
  useEffect(() => {
    const syncFromHash = () => {
      const nextPage = getPageFromHash();
      setPage((current) => (current === nextPage ? current : nextPage));
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const targetHash = `#${page}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
  }, [page]);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  return (
    <div style={{ fontFamily: "'Crimson Text','Georgia',serif", minHeight: "100vh", background: "#f8f9fb", color: "#1a1a2e" }}>
      {/* Top bar */}
      <div style={{ background: "#0a1628", color: "rgba(255,255,255,0.6)", padding: "7px 32px", fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ letterSpacing: 1 }}>🇹🇩 République du Tchad — Unité · Travail · Progrès</span>
        <span>📞 {MINISTERE.telephone} &nbsp;|&nbsp; 📧 {MINISTERE.email}</span>
      </div>

      {/* Header principal */}
      <header style={{ background: scrolled ? "rgba(255,255,255,0.97)" : "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 200, boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 70, padding: "0 32px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
            {IMAGES.logo
              ? <img src={IMAGES.logo} alt="Logo MTACMN" style={{ height: 50 }} />
              : <div style={{ width: 50, height: 50, borderRadius: 10, background: "linear-gradient(135deg,#0a1628,#1a3a6e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#f59e0b", fontSize: 22, fontWeight: 900 }}>🏛️</span>
                </div>
            }
            <div>
              <div style={{ fontWeight: 900, fontSize: 14, color: "#0a1628", lineHeight: 1.2, fontFamily: "'Crimson Text','Georgia',serif" }}>Ministère des Transports</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>Aviation Civile & Météorologie Nationale</div>
            </div>
          </div>

          {/* Nav desktop */}
          <nav style={{ display: "flex", gap: 2 }}>
            {NAV_LINKS.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                padding: "8px 14px", border: "none", cursor: "pointer", background: "transparent",
                fontWeight: page === n.id ? 800 : 600, fontSize: 13.5, fontFamily: "inherit",
                color: page === n.id ? "#1a3a6e" : "#374151",
                borderBottom: page === n.id ? "3px solid #f59e0b" : "3px solid transparent",
                transition: "all 0.15s",
              }}>{n.label}</button>
            ))}
          </nav>
        </div>
      </header>

      {/* Contenu */}
      <main>
        {page === "accueil" && (
          <PageAccueil
            actualites={actualites}
            setPage={setPage}
            onOpenArticle={(article) => {
              if (!article) return;
              setSelectedActualite(article);
              setPage("actualites");
            }}
          />
        )}
        {page === "actualites" && (
          <PageActualites
            actualites={actualites}
            selectedFromHome={selectedActualite}
            onClearSelectedFromHome={() => setSelectedActualite(null)}
          />
        )}
        {page === "projets" && <PageProjets />}
        {page === "meteorologie" && <PageMeteorologie />}
        {page === "reglementations" && <PageReglementations />}
        {page === "contact" && <PageContact />}
      </main>

      {/* Footer */}
      <footer style={{ background: "#0a1628", color: "rgba(255,255,255,0.65)", padding: "56px 32px 28px", marginTop: 60 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ fontWeight: 900, color: "#fff", fontSize: 16, marginBottom: 14, fontFamily: "'Crimson Text','Georgia',serif" }}>
                {MINISTERE.sigle}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>Ministère des Transports, de l'Aviation Civile et de la Météorologie Nationale de la République du Tchad.</p>
              <div style={{ display: "flex", gap: 10 }}>
                {["🐦","📘","▶️"].map((ic, i) => (
                  <div key={i} style={{ width: 34, height: 34, background: "rgba(255,255,255,0.08)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>{ic}</div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 14, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>Navigation</div>
              {NAV_LINKS.map(n => <div key={n.id}><button onClick={() => setPage(n.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.55)", cursor: "pointer", padding: "4px 0", fontSize: 13, textAlign: "left", display: "block", transition: "color 0.15s" }} onMouseEnter={e => e.target.style.color = "#f59e0b"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}>{n.label}</button></div>)}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 14, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>Structures</div>
              {SOUS_STRUCTURES.map(s => <div key={s.nom} style={{ fontSize: 13, padding: "4px 0", color: "rgba(255,255,255,0.55)" }}>{s.nom} — {s.nomComplet}</div>)}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 14, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>Contact</div>
              {[["📍", MINISTERE.adresse], ["📞", MINISTERE.telephone], ["📧", MINISTERE.email], ["🌐", MINISTERE.siteOfficiel]].map(([ic, v]) => (
                <div key={v} style={{ fontSize: 13, padding: "4px 0", color: "rgba(255,255,255,0.55)" }}>{ic} {v}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, flexWrap: "wrap", gap: 12 }}>
            <span>© 2026 {MINISTERE.nom}. Tous droits réservés.</span>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>République du Tchad — Unité · Travail · Progrès</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
