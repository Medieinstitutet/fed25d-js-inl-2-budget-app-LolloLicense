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

- välj månad uppe i en swiper
  - delfault är kopplat till dagens datum
- lägg till inkomst / utgift
- Efter submit av ny post ska inputs återställas till default
- en list med entry posts renderas och togglar beroende på vilken tab som är vald ( inkomster - utgifter - sparande)
- ta bort poster
- sparas så att appen inte startar om på noll (localStorage)
- hämta info från localStorage vid varje reload
- en månads / år balans ska visas med en pie chart samt en generell balans

### Flöde

1. Sidan laddas in och läser in sparad budget från tidigare (loclaStorage)

2. Månads buget inputs

- Användare kan lägga in inkomst / utgift (välja radiobutton) i inputfält
- listan och uppdateras
- det evtuella månadshjulet uppdateras / balasen
- detta sparas i localStorage

3. Radera poster

- använadaren väler vilket post, med hjälp av data id så raderas rätt post
- listan uppdateras och sparas
