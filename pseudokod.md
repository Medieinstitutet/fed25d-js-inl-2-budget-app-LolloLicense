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
- måndagshjul / balans ui kompatibelt (om tid finns)
- Lista med alla poster
- balans i skrift ( >=0 / <0)

## Interaktion

- lägg till inkomst / utgift
- ta bort poster
- sparas så att appen inte startar om på noll (localStorage)
- hämta info från localStorage vid varje reload

### Flöde

1. Sidan laddas in och läser in sparad budget från tidigare (loclaStorage)

2.

- Användare kan lägga in inkomst / utgift (välja radiobutton) i inputfält
- listan och uppdateras
- det evtuella månadshjulet uppdateras / balasen
- detta sparas i localStorage

3. Radera poster

- använadaren väler vilket post, med hjälp av data id så raderas rätt post
- listan uppdateras och sparas
