import Image from "next/image";
import Link from "next/link";
import { InstallButton } from "@/components/pwa/install-button";
import { NotificationBanner } from "@/components/notifications/NotificationBanner";
import { SpecialesSection } from "@/components/notifications/SpecialesSection";

const LOGO = "/pizza-lescapade-medias/identite/logo-rond-lescapade.jpg";

const pizzasSignature = [
  {
    src: "/pizza-lescapade-medias/pizzas/pizza-truffe-burrata.jpg",
    nom: "Tartufo",
    desc: "Crème fraîche, sauce tartufata noire, mozzarella, jambon blanc, burrata",
    prix: "19 €",
  },
  {
    src: "/pizza-lescapade-medias/pizzas/pizza-parma.jpg",
    nom: "Parma",
    desc: "Tomate, mozzarella, jambon cru, parmesan, roquette, pesto, crème de balsamique",
    prix: "14 €",
  },
  {
    src: "/pizza-lescapade-medias/pizzas/pizza-jambon-burrata.jpg",
    nom: "Jambon Burrata",
    desc: "Crème fraîche, jambon blanc, burrata, sauce tartufata, mozzarella",
    prix: "19 €",
  },
];

const carte = [
  { nom: "Marguerite", desc: "Tomate, mozzarella, olives, origan", prix: "10 €" },
  { nom: "Napolitaine", desc: "Tomate, anchois, olives", prix: "10 €" },
  { nom: "Jambon mozzarella", desc: "Tomate, jambon blanc, mozzarella, olives, origan", prix: "11 €" },
  { nom: "Alsacienne", desc: "Crème fraîche, lardons, oignons", prix: "12 €" },
  { nom: "Reine", desc: "Tomate, jambon blanc, champignons, mozzarella, olives, origan", prix: "12 €" },
  { nom: "4 fromages", desc: "Tomate, emmental, mozzarella, chèvre, roquefort, olives", prix: "13 €" },
  { nom: "Saumon", desc: "Crème fraîche, saumon, aneth, mozzarella", prix: "13 €" },
  { nom: "Andalouse", desc: "Tomate, poivrons, oignons, chorizo, mozzarella, olives, origan", prix: "13 €" },
  { nom: "Bolognaise", desc: "Tomate, poivrons, oignons, viande hachée, mozzarella, olives, origan", prix: "13 €" },
  { nom: "Corsica", desc: "Tomate, mozzarella, figatelli, brousse, olives, origan", prix: "13 €" },
  { nom: "Végétarienne", desc: "Tomate, courgettes, poivrons, oignons, champignons, mozzarella, olives, origan", prix: "13 €" },
  { nom: "Poulet curry", desc: "Crème fraîche, poulet, oignons, mozzarella, curry", prix: "13 €" },
  { nom: "Chèvre miel", desc: "Crème fraîche, chèvre, miel, pignons", prix: "14 €" },
  { nom: "Parma", desc: "Tomate, mozzarella, jambon cru, parmesan, roquette, olive, origan, pesto, crème de balsamique", prix: "14 €" },
  { nom: "L'Italienne", desc: "Tomate, mozzarella, salade, mozza di bufala, tomates séchées, pesto, crème de balsamique", prix: "14 €" },
  { nom: "Savoyarde", desc: "Crème fraîche, oignons, pommes de terre, reblochon, mozzarella", prix: "15 €" },
  { nom: "Tartufo", desc: "Crème fraîche, sauce tartufata noire, mozzarella, jambon blanc, burrata / bufala", prix: "19 €" },
];

const ambiancePhotos = [
  { src: "/pizza-lescapade-medias/lieu/tables-rondins-jour.jpg", alt: "Tables sur rondins en terrasse" },
  { src: "/pizza-lescapade-medias/lieu/terrasse-jardin.jpg", alt: "Terrasse et jardin" },
  { src: "/pizza-lescapade-medias/ambiance-soir/guirlandes-nuit-1.jpg", alt: "Guirlandes lumineuses la nuit" },
  { src: "/pizza-lescapade-medias/ambiance-soir/concert-live-1.jpg", alt: "Concert live en soirée" },
];

const savoirFairePhotos = [
  { src: "/pizza-lescapade-medias/savoir-faire/patons-nature.jpg", alt: "Pâtons prêts à être étalés" },
  { src: "/pizza-lescapade-medias/savoir-faire/pate-etalee.jpg", alt: "Pâte étalée à la main" },
  { src: "/pizza-lescapade-medias/savoir-faire/paton-etalage.jpg", alt: "Étalage du pâton" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-full" style={{ fontFamily: "var(--font-lato), Lato, sans-serif", backgroundColor: "#fdf6ec", color: "#2c1a0e" }}>

      {/* ── BANNEAU NOTIFICATIONS ── */}
      <NotificationBanner />

      {/* ── HERO ── */}
      <section className="relative w-full" style={{ minHeight: "520px" }}>
        <Image
          src="/pizza-lescapade-medias/lieu/entree-enseigne.jpg"
          alt="Entrée de Pizza L'Escapade"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.60) 100%)" }}
        >
          <h1
            className="text-white mb-3 leading-tight"
            style={{ fontFamily: "var(--font-dancing), cursive", fontSize: "clamp(3rem, 8vw, 6rem)", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            Pizza L&apos;Escapade
          </h1>
          <p className="text-amber-100 text-lg mb-8 tracking-wide" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
            Pizzeria artisanale · Guinguette nature
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <a
              href="tel:+33780988177"
              className="flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#7a5c2e", color: "#fdf6ec" }}
            >
              📞 07 80 98 81 77
            </a>
            <a
              href="/menu"
              className="flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold border-2 border-white text-white transition-all hover:bg-white hover:text-stone-900"
            >
              Voir la carte →
            </a>
            <InstallButton variant="hero" />
          </div>
        </div>
      </section>

      {/* ── À LA UNE ── */}
      <SpecialesSection />

      {/* ── NOS SPÉCIALITÉS ── */}
      <section className="py-16 px-6" style={{ backgroundColor: "#fdf6ec" }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-center mb-2"
            style={{ fontFamily: "var(--font-dancing), cursive", fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#7a5c2e" }}
          >
            Nos spécialités
          </h2>
          <p className="text-center mb-12 text-sm tracking-widest uppercase" style={{ color: "#9a7c4e" }}>
            Pâte artisanale · Ingrédients frais du marché
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {pizzasSignature.map((p) => (
              <div
                key={p.nom}
                className="rounded-2xl overflow-hidden shadow-md flex flex-col"
                style={{ backgroundColor: "#fff8f0", border: "1px solid #e8d5b0" }}
              >
                <div className="relative" style={{ height: "220px" }}>
                  <Image
                    src={p.src}
                    alt={p.nom}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 style={{ fontFamily: "var(--font-dancing), cursive", fontSize: "1.5rem", color: "#2c1a0e" }}>
                      {p.nom}
                    </h3>
                    <span className="font-bold text-lg" style={{ color: "#7a5c2e" }}>{p.prix}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b5040" }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── L'AMBIANCE ── */}
      <section className="py-16 px-6" style={{ backgroundColor: "#f5e9d2" }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-center mb-2"
            style={{ fontFamily: "var(--font-dancing), cursive", fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#7a5c2e" }}
          >
            L&apos;ambiance
          </h2>
          <p className="text-center mb-4 text-sm tracking-widest uppercase" style={{ color: "#9a7c4e" }}>
            Guinguette nature · Terrasse · Concerts live
          </p>
          <p className="text-center text-sm leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: "#6b5040" }}>
            Niché dans un écrin de verdure, L&apos;Escapade vous accueille le midi et le soir dans une guinguette chaleureuse.
            Tables en rondins, guirlandes lumineuses, feu de cheminée l&apos;hiver — et concerts live les soirs d&apos;été.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ambiancePhotos.map((p) => (
              <div key={p.src} className="relative rounded-2xl overflow-hidden" style={{ height: "200px" }}>
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/galerie"
              className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
              style={{ border: "1px solid #c4a46e", color: "#7a5c2e" }}
            >
              Voir la galerie complète →
            </Link>
          </div>
        </div>
      </section>

      {/* ── DU PÉTRIN AU FOUR ── */}
      <section className="py-16 px-6" style={{ backgroundColor: "#fdf6ec" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">

            <div className="flex-1 md:order-2">
              <h2
                className="mb-2"
                style={{ fontFamily: "var(--font-dancing), cursive", fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#7a5c2e" }}
              >
                Du pétrin au four
              </h2>
              <p className="text-xs tracking-widest uppercase mb-5" style={{ color: "#9a7c4e" }}>
                Tout fait maison · Farine artisanale
              </p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#6b5040" }}>
                Chez L&apos;Escapade, chaque pizza commence par une pâte travaillée à la main, levée lentement
                pour développer ses arômes. Les pâtons sont façonnés un à un, garnis avec générosité,
                puis enfournés à très haute température pour une cuisson à cœur.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#6b5040" }}>
                Pas de congélateur, pas de surgelé — seulement du frais, du local et du fait avec soin.
              </p>
            </div>

            <div className="md:order-1 grid grid-cols-3 gap-2 md:w-80 flex-shrink-0">
              {savoirFairePhotos.map((p) => (
                <div key={p.src} className="relative rounded-xl overflow-hidden" style={{ height: "130px" }}>
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 120px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LA CARTE ── */}
      <section className="py-16 px-6" style={{ backgroundColor: "#f5e9d2" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-start">

            <div className="md:w-64 flex-shrink-0 mx-auto md:mx-0">
              <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ height: "480px", width: "220px", margin: "0 auto" }}>
                <Image
                  src="/pizza-lescapade-medias/pizzas/pizza-fleurs-planche.jpg"
                  alt="Pizza sur planche de bois"
                  fill
                  className="object-cover"
                  sizes="220px"
                />
              </div>
            </div>

            <div className="flex-1">
              <h2
                className="mb-1"
                style={{ fontFamily: "var(--font-dancing), cursive", fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#7a5c2e" }}
              >
                La carte
              </h2>
              <p className="text-xs tracking-widest uppercase mb-8" style={{ color: "#9a7c4e" }}>
                +1 € par ingrédient supplémentaire
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                {carte.map((item) => (
                  <div key={item.nom} className="flex justify-between gap-3 pb-4" style={{ borderBottom: "1px dashed #d4b98a" }}>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#2c1a0e" }}>{item.nom}</p>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: "#8a6a4e" }}>{item.desc}</p>
                    </div>
                    <span className="font-bold text-sm whitespace-nowrap self-start pt-0.5" style={{ color: "#7a5c2e" }}>{item.prix}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
                  style={{ backgroundColor: "#7a5c2e", color: "#fdf6ec" }}
                >
                  Commander en ligne →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER / CONTACT ── */}
      <footer className="py-12 px-6 text-center" style={{ backgroundColor: "#2c1a0e", color: "#e8d5b0" }}>
        <Image
          src={LOGO}
          alt="Pizza L'Escapade"
          width={80}
          height={80}
          className="rounded-full object-cover mx-auto mb-4"
        />
        <a
          href="tel:+33780988177"
          className="text-xl font-semibold tracking-wide hover:text-amber-300 transition-colors"
          style={{ color: "#e8d5b0" }}
        >
          07 80 98 81 77
        </a>
        <p className="mt-4 text-sm" style={{ color: "#9a7c4e" }}>
          Pizzeria artisanale · Ingrédients frais · Sur place & à emporter
        </p>
      </footer>
    </div>
  );
}
