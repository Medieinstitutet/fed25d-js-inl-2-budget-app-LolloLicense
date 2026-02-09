
# Hej & välkommen till din ekonomiska hjälpreda: ikapp :bank:

![ikapp loggan](/screenshots/logo.png)

En enkel budget-app där du kan logga inkomster, utgifter & sparande. Du ser dina poster kopplade till datum, kan lägga till en kommentar och får tydliga ikoner för varje kategori. Appen visar även totalsummor för vald typ och en översikt med saldo, utgifter och sparande. 

🔗 Live demo: [ikapp] (https://medieinstitutet.github.io/fed25d-js-inl-2-budget-app-LolloLicense/)

📦 Repo: [Medieinstitutet] (https://github.com/Medieinstitutet/fed25d-js-inl-2-budget-app-LolloLicense)

![Tablet view](/screenshots/tablet-view.png)

## Planering  :scroll:

- Design: Figma
- Inspiration: Pinterest
- Pseudokod i VS Code (löpande) & Github Issues 


## Funktioner :calling:

- Lägga till poster för
    - Inkomster
    - Utgifter
    - Sparande
- Varje post innehåller belopp, kategori och kommentar (frivilligt)
- I listorna visas ikon, kategorinamn, kommentar, datum och belopp
- Poster kan raderas via en radera-knapp (soptunna) vid varje rad
- Totalsummor beräknas per typ (inkomst/utgift/sparande) och saldo visas även i översiktsrutan 
- Visuell feedback: saldo/totalsummor markeras med röd/grön text beroende på värde
- Periodvy
    - Växla mellan månad / år 
    - Navigera till föregående / nästa period
    - Filtrera listor och summeringar utifrån vald period
    - Appen förhindrar loggning i framtida perioder (alert visas vid försök).

![Mobile view](/screenshots/mobile-view.png) 


## Struktur & DRY-tänk :triangular_ruler:
- State
- Helpers
- Period Helpers
- LocalStorage 
- UI functions
- Render UI
- Init & Fetch

### JSON :file_folder:
Kategorier laddas från `public/data/categories.json` och delas upp i:
`income` || `expense` || `savings`
Varje kategori har `id`, `label`, `icon` (svg i `public/icons/`)



## Tillgänglighet :duck: 

- Löpande kollat Firefox och Lighthouse för att följa a11y-riktlinjer. 
- Testad även i https://www.accessibilitychecker.org/ - hade svårt att tyda exakt vad som krävdes för att få över 95%
- Tydliga felmeddelanden i formulär visas med röd text.
- UX-tänk rakt igenom: vyerna är tydliga och tabbningen funkar fint. Jag har rubber-duck testat appen på min extremt o-webbiga pappa och han lyckades navigera sig fram och börja logga sin budget.

![Lighthouse analys](/screenshots/lighthouse.png)
![HTML validation analys](/screenshots/validation-html.png)
![CSS validation analys](/screenshots/validation-css.png)

## Stack :dollar:

- HTML
- SCSS (Sass)
- TypeScript
- Vite
- Biome (lint-format)
- Prettier

### Kör lokalt: `npm install` → `npm run dev`

## Credits :love_letter: 

  - Ikoner: Heroicons & Iconify
  - Typsnitt: Josefin Sans


## Utmaningar :rocket: 

Den största utmaningen var till en början att ro ihop detta på kort tid, från idé till kod. Jag fick verkligen hålla i tyglarna och sätta upp ramar för vad som skulle få plats i appen, jag valde att hålla det enkelt men med tydligt UX-tänk och sömlösa funktioner. Sedan att lägga på TypeScript ovanpå befintlig JavaScript var ju helt nytt, både att överhuvudtaget förstå vad TypeScript är och sedan implementera det. Jag kan ärligt säga att många av funktionerna och hur de skulle anropa varandra var ganska komplexa för mig och jag lärde mig massor om vad jag inte kan. 

### Extra svårt :steam_locomotive:

- Periodlogiken (månad/år + prev/next + filtrering): att få state, filtrering och UI att synka när man byter period

- TypeScript på befintlig JS
querySelector<HTMLFormElement>() och event-typer (SubmitEvent, MouseEvent) utan att fastna i TS-varnings-träsket


## Lärdomar :boom:

- Hur smidigt det är att använda localStorage
- Inse sina begränsningar och hålla det enkelt
- Hur mycket mer det finns att lära – och hur mycket som faktiskt går att bygga
- State-tänk 

### Resurser 
MDN, dokumentation, olika forumtrådar samt AI som bollplank vid felsökning och struktur.

#### Projekt av: Louise Sverkström :octocat:

Tack för att du kikade förbi! 
