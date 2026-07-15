# Mario Schubert × Vogel Beratung

Eine eigenständige Bewerbungs-Microsite für die Position **Videograf & Bewegtbild Producer** bei Vogel Beratung. Das Design versteht die Bewerbung als lebenden Motion-Production-Field-Guide: redaktionell, modular, visuell präzise und systemorientiert.

## Entwicklung

```bash
npm install
npm run dev
```

Die Startseite liegt unter `/`, der druckoptimierte Lebenslauf unter `/cv` und das einseitige Anschreiben unter `/anschreiben`.

Direkte Dokumente:

- `/documents/Mario_Schubert_CV_Vogel.pdf`
- `/documents/Mario_Schubert_Anschreiben_Vogel.pdf`

## Qualitätssicherung

```bash
npm run lint
npm run build
npm run preview
```

Die Seite ist für Desktop, Tablet und Mobile optimiert. Autoplay wird bei `prefers-reduced-motion` deaktiviert; das Hero-Video kann immer manuell abgespielt oder pausiert werden. Der Filmindex lädt ausschließlich lokale Vorschaubilder. YouTube-/Drive-Player werden erst nach einer expliziten Auswahl in den zugänglichen Dialog eingesetzt und beim Schließen wieder vollständig entfernt.

## Deployment auf Vercel

Das Repository kann direkt als Vite-Projekt importiert werden. `vercel.json` leitet direkte Aufrufe – insbesondere `/cv` – an die SPA weiter. Build-Befehl: `npm run build`, Output-Verzeichnis: `dist`.

## Mediennachweis

Die verwendeten Portfolio-Fotos, Filmvorschaubilder und der Markenfilm stammen von Marios eigener WYLDWORKS-Website beziehungsweise seiner kuratierten Arbeitsauswahl und wurden ausschließlich für diese Bewerbung lokal eingebunden. Es werden keine externen Bilddienste oder Bild-Hotlinks verwendet. Externe Video-Player werden aus Performance- und Datenschutzgründen erst nach Klick geladen; YouTube verwendet `youtube-nocookie.com`.

## Kontakt

Mario Schubert · Ingolstadt  
[servus@marioschub.com](mailto:servus@marioschub.com) · [+49 1515 5338029](tel:+4915155338029)
