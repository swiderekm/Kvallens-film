# Kvällens Film 

Deployad miljö: [here](https://kvallens-film-nine.vercel.app/)

Kvällens Film är en modern och responsiv webbapplikation byggd med React, TypeScript och The Movie Database (TMDb) API. Appen fungerar som en personlig filmguide där användaren kan upptäcka populära titlar, söka efter specifika filmer, filtrera och sortera utbudet, titta på officiella trailers samt hantera filmer i sparade listor.

---

## Innehållsförteckning
- [Funktioner](#funktioner)
- [Teknikstack](#teknikstack)
- [Installation och lokal körning](#installation-och-lokal-körning)
- [Projektstruktur](#projektstruktur)
- [Uppfyllda betygskriterier](#uppfyllda-betygskriterier)
  - [Godkänd (G)](#godkänd-g)
  - [Väl Godkänd (VG)](#väl-godkänd-vg)

---

## Funktioner

- **Upptäck & Paginering:** Bläddra bland populära filmer med smidig "Ladda fler"-funktion utan omladdning av sidan.
- **Sökning & Validering:** Textsökning mot TMDb med direkt validering och felåterkoppling vid tomma fält.
- **Avancerad filtrering & sortering:** Filtrera på genre, utgivningsår och minsta betyg, samt sortera efter popularitet eller betyg.
- **Officiella trailers:** Se filmens officiella YouTube-trailer direkt i applikationen via en integrerad videospelare i popup/modal.
- **Dubbel listhantering:**
  - *Min lista (Watchlist):* Spara filmer du planerar att se.
  - *Sedda filmer (Watched):* Bocka av sedda filmer; filmen flyttas automatiskt från Watchlist till Sedda och markeras tydligt i hela appen med statusbricka.
- **Datapersistens:** Listor bevaras i `localStorage` och filterinställningar sparas under aktiv session i `sessionStorage`.

---

## Teknikstack

- **Frontend:** React 18 / 19, TypeScript, Vite
- **Routing:** React Router v6
- **HTTP-klient:** Axios
- **API:** The Movie Database (TMDb) v3 API
- **Stilar:** Modulär och ren CSS (separerad per komponent och vy, med dedikerade media queries för responsivitet)

---

## Installation och lokal körning

Följ dessa steg för att köra projektet lokalt på din dator:

### 1. Klona repositoryt
```bash
git clone <URL_TILL_DITT_GITHUB_REPO>
cd kvallens-film
