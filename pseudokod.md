# ikAPP

En app som hjälper dig hålla koll på din ekonomi.

## <--Inputfält

Ett fält kopplat till en radio där men väljer utgift eller inkomst, om inkomst blir texten grön med ett + framför. om utgift blir texten röd med ett - framör.

1. [ ] Inkomst: belopp, beskrivning, kategori
2. [ ] Utgift: Belopp, beskrivning, kategori

## Arrayer

- En listan med budgetposter: id, typ(inkomst/utgift), belopp, text, kategori, datum
  där utgifter kontra inkomster får olika färg ett månadshjul där inkomster har en färg, utgiften en andra färg och pengar kvar en färg (som en sammanställning)
  --> Output
- månadshjul / balans ui kompatibelt (om tid finns)
- Lista med alla poster
- balans i skrift ( >=0 / <0)

## Interaktion

- välj vilken vy : Månad / år
- bläddra mellan år / månad och uppdatera entrys därefter
  - delfault är kopplat till dagens datum och genom att antingen uppdatera sida eller bläddra till baka så fyller man i på dagens datum.
  - om man vill backlogga sin budget får posten första dagen i vald månad / år
- lägg till inkomst / utgift
- Efter submit av ny post ska inputs återställas till default
- en list med entry posts renderas och togglar beroende på vilken tab som är vald ( inkomster - utgifter - sparande)
- ta bort poster
- sparas så att appen inte startar om på noll (localStorage)
- hämta info från localStorage vid varje reload
- man kan se den valda periodens översikt i en inforuta samt kolla i tabs

### Flöde

1. Sidan laddas in och läser in sparad budget från tidigare (loclaStorage)

2. Månads buget inputs

- Användare kan lägga in inkomst / utgift (välja radiobutton) i inputfält
- listan och uppdateras och flyttar till rätt tabentry när man väljer radiobutton
- balasen för vald type uppdateras och visas
- detta sparas i localStorage

3. Radera poster

- använadaren väler vilket post, med hjälp av data id så raderas rätt post
- listan uppdateras och sparas
