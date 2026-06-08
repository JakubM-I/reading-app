# Model Nauki

## Problem Do Wsparcia

Glowna trudnosc to skladanie elementow w calosc: najpierw rozpoznanie podzialu slowa na sylaby, potem skladanie sylab w wyraz, a nastepnie wyrazow w proste zdanie. Dziecko czasem zgaduje slowo po fragmencie, dlatego aplikacja ma spowalniac prace ze slowem i kierowac uwage na kolejne czesci wyrazu.

MVP rozdziela dwa glowne moduly:

- `Sylabizowanie`: cwiczenie rozpoznawania, liczenia i zaznaczania sylab w slowie;
- `Czytanie`: dotychczasowy modul czytania, czyli rozgrzewka, czytanie prowadzone, budowanie slow i proste zdania.

Sesje nie sa mieszane. Rodzic moze danego dnia przeprowadzic osobno sesje sylabizowania i osobno sesje czytania.

Trzecim obszarem jest utrwalanie liter i dwuznakow. Nie jest to osobny kurs alfabetu, ale krotka rozgrzewka przed czytaniem.

## Zasady Cwiczen

- Jedno zadanie na ekranie.
- Jasny poczatek i koniec sesji.
- Brak presji czasu.
- Powtarzalny schemat zadan.
- Najpierw tekst, potem ewentualny obrazek lub nagroda.
- Podzial na sylaby stopniowo znika, aby dziecko czytalo caly wyraz.
- W module sylabizowania pomoc znika stopniowo, aby dziecko przechodzilo od obserwowania podzialu do samodzielnego wskazywania granic sylab.
- Rodzic ocenia wykonanie zamiast automatycznej oceny mowy.

## Rozgrzewka Liter I Dwuznakow

Cel: przypomnienie znakow, ktore moga przeszkadzac w dalszym czytaniu.

Typy zadan:

- rozpoznaj litere albo dwuznak;
- znajdz taki sam znak;
- przeczytaj sylabe;
- odroznij podobne elementy.

Priorytetowe obszary:

- proste sylaby otwarte: `ma`, `ta`, `la`, `ko`, `to`, `sa`;
- podobne litery: `b/d`, `p/b`, `m/n`;
- dwuznaki: `ch`, `sz`, `cz`, `rz`;
- trudniejsze dwuznaki i trojznaki: `dz`, `dź`, `dż`.

## Sylabizowanie

Cel: nauczenie dziecka widzenia i wypowiadania czesci wyrazu przed probą
czytania calego slowa. Modul ma ograniczac zgadywanie po pierwszym fragmencie
wyrazu i przygotowywac do czytania prowadzonego.

Sylabizowanie jest osobnym modulem, a nie czescia sesji czytania. Po starcie
sesji rodzic wybiera, czy dziecko cwiczy `Sylabizowanie`, czy `Czytanie`.

Tryby pomocy:

- `Z pomocą`: aplikacja pokazuje pelny podzial, np. `ra-kie-ta`;
- `Z podpowiedzią`: aplikacja pokazuje czesciowa pomoc, np. liczbe sylab,
  puste miejsca albo jedno miejsce podzialu;
- `Samodzielnie`: dziecko widzi caly wyraz, np. `rakieta`, i samo wskazuje
  miejsca podzialu.

Typy zadan:

- policz sylaby w slowie;
- powiedz slowo sylabami;
- uloz slowo z kafelkow sylab;
- wstaw kreski podzialu w slowie.

Nie dodajemy w MVP zadania wyboru poprawnego wariantu podzialu z kilku
odpowiedzi, bo moze wzmacniac zgadywanie.

Przykladowy przebieg zadania `Z pomocą`:

1. Aplikacja pokazuje `ra-kie-ta`.
2. Dziecko czyta albo wypowiada kolejne sylaby.
3. Dziecko wypowiada caly wyraz.
4. Rodzic ocenia wykonanie.

Przykladowy przebieg zadania `Z podpowiedzią`:

1. Aplikacja pokazuje slowo `rakieta`.
2. Aplikacja pokazuje podpowiedz: `3 sylaby`.
3. Dziecko wskazuje miejsca podzialu.
4. Rodzic ocenia wykonanie.

Przykladowy przebieg zadania `Samodzielnie`:

1. Aplikacja pokazuje slowo `rakieta`.
2. Dziecko wskazuje miejsca podzialu: `ra-kie-ta`.
3. Dziecko wypowiada slowo sylabami i calosciowo.
4. Rodzic ocenia wykonanie.

### Sciaga Sylabizowania

Sciaga ma byc krotka, spokojna i pomocnicza. Nie jest to kurs zasad
sylabizacji. Jej celem jest wsparcie rodzica i dziecka w chwili zawahania.

Mozliwe podpowiedzi:

- `Znajdź samogłoski.`
- `Zwykle jedna sylaba ma jedną samogłoskę.`
- `Powiedz słowo powoli.`
- `Dwuznak trzyma się razem: sz, cz, ch, rz, dz.`
- `Nie każde i robi osobną sylabę.`

W trybie `Z pomocą` sciaga moze byc widoczna od razu. W trybie
`Z podpowiedzią` moze byc widoczna jako krotka podpowiedz pod zadaniem. W
trybie `Samodzielnie` powinna byc schowana pod przyciskiem `Podpowiedź`, aby
nie przejmowala zadania za dziecko.

Material do sylabizowania powinien zaczynac sie od slow dwu- i trzysylabowych.
Slowa jednosylabowe nie powinny byc uzywane jako glowne zadania sylabizowania,
bo nie cwicza podzialu na czesci.

Podzial slow na sylaby pozostaje reczny. Aplikacja nie powinna generowac
podzialu automatycznie w MVP, poniewaz niektore slowa moga miec warianty
podzialu albo wymagac decyzji dydaktycznej.

## Czytanie Prowadzone

Cel: przejscie od sylab do calego wyrazu i prostego zdania. To pozostaje
osobny modul czytania i nie powinno byc mieszane z sesja sylabizowania.

Przykladowy przebieg:

1. Aplikacja pokazuje wyraz podzielony na sylaby: `ra-kie-ta`.
2. Dziecko czyta kolejne sylaby.
3. Aplikacja pokazuje caly wyraz: `rakieta`.
4. Dziecko czyta caly wyraz.
5. Aplikacja pokazuje proste zdanie: `Rakieta leci.`
6. Dziecko czyta zdanie.
7. Rodzic ocenia wykonanie.

Wazna zasada: obrazek nie powinien zdradzac odpowiedzi przed probą przeczytania, bo dziecko moze zgadywac po kontekście.

## Budowanie Slow

Cel: aktywne skladanie wyrazu z sylab.

Przykladowy przebieg:

1. Aplikacja pokazuje cel: `auto`.
2. Dziecko widzi kafelki: `to`, `au`.
3. Dziecko uklada `au` + `to`.
4. Aplikacja pokazuje caly wyraz.
5. Dziecko czyta calosc.
6. Rodzic ocenia wykonanie.

To cwiczenie ma ograniczac zgadywanie, bo wymaga zwrocenia uwagi na kolejnosc czesci wyrazu.

## Rozumienie Prostego Zdania

Po czesci zadan aplikacja powinna sprawdzic sens prostym pytaniem.

Przyklady:

- `Auto jedzie.` -> `Co jedzie?`
- `Motor stoi.` -> `Co stoi?`
- `Koło jest duże.` -> `Jakie jest koło?`

Pytania maja byc krotkie. Na poczatku wystarczy odpowiedz ustna i ocena rodzica; aplikacja nie musi automatycznie sprawdzac odpowiedzi.

## Czego Unikac

- Dlugo trwajacych blokow czytania.
- Czerwonych bledow i komunikatow porazki.
- Licznika czasu.
- Zbyt wielu animacji.
- Losowych niespodzianek w trakcie zadania.
- Zadan, w ktorych obrazek pozwala zgadnac slowo przed przeczytaniem.
