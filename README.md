# Mario Schubert × Vogel Beratung

Eine eigenständige Bewerbungs-Microsite für die Position **Videograf & Bewegtbild Producer** bei Vogel Beratung. Das Design versteht die Bewerbung als lebenden Motion-Production-Field-Guide: redaktionell, modular, visuell präzise und systemorientiert.

## Entwicklung

```bash
npm install
npm run dev
```

Die Startseite liegt unter `/`, der druckoptimierte Lebenslauf unter `/cv`.

## Qualitätssicherung

```bash
npm run lint
npm run build
npm run preview
```

Die Seite ist für Desktop, Tablet und Mobile optimiert. Autoplay wird bei `prefers-reduced-motion` deaktiviert; das Hero-Video kann immer manuell abgespielt oder pausiert werden.

## Deployment auf Vercel

Das Repository kann direkt als Vite-Projekt importiert werden. `vercel.json` leitet direkte Aufrufe – insbesondere `/cv` – an die SPA weiter. Build-Befehl: `npm run build`, Output-Verzeichnis: `dist`.

## Mediennachweis

Die verwendeten Portfolio-Fotos und der Markenfilm stammen von Marios eigener WYLDWORKS-Website und wurden ausschließlich für diese Bewerbung lokal eingebunden. Es werden keine externen Bilddienste oder Hotlinks verwendet.

## Kontakt

Mario Schubert · Ingolstadt  
[servus@marioschub.com](mailto:servus@marioschub.com) · [+49 1515 5338029](tel:+4915155338029)
