# Postepy I Nagrody

## Cel Systemu Punktow

Punkty maja wspierac motywacje poza aplikacja. Nie sa testem i nie powinny budowac presji. Najwazniejsze jest nagradzanie udzialu w sesji oraz samodzielnosci.

## Oceny Zadania

Rodzic ocenia kazde zadanie w sekcji:

`Oceń wykonanie zadania`

Dostepne oceny:

- `Samodzielnie`;
- `Z pomocą`;
- `Trudne`;
- `Pomiń`.

## Punktacja

Zasady:

- `Samodzielnie`: 2 punkty, czyli 1 punkt za probe + 1 punkt bonusowy.
- `Z pomocą`: 1 punkt za probe.
- `Trudne`: 1 punkt za probe, a zadanie trafia do czestszych powtorek.
- `Pomiń`: 0 punktow.

Punktacja ma byc jasno pokazana w podsumowaniu sesji.

## Wplyw Oceny Na Powtorki

Ocena rodzica decyduje nie tylko o punktach, ale tez o tym, czy material wraca
do puli kolejnych sesji.

Zasady:

- `Samodzielnie`: material uznajemy za opanowany w biezacym cyklu i nie
  powtarzamy go w najblizszych sesjach;
- `Z pomocą`: material wraca do puli powtorek;
- `Trudne`: material wraca do puli powtorek z wyzszym priorytetem;
- `Pomiń`: material wraca do puli powtorek, ale za zadanie naliczane jest 0 punktow.

Poziom nie powinien byc opisywany jako zaliczony. Aplikacja zapisuje wykonane
sesje i stan materialu, ale rodzic nadal decyduje, kiedy zostac na poziomie,
kiedy wrocic nizej i kiedy sprobowac trudniej.

## Odznaki

Odznaki sa progowe i spokojne. Nie powinny wymagac perfekcji.

Przykladowe progi:

- 10 punktow: `Pierwszy przejazd`;
- 25 punktow: `Kierowca treningowy`;
- 50 punktow: `Mistrz toru`;
- 100 punktow: `Super mechanik`;
- 200 punktow: `Legenda garażu`.

Nazwy moga zostac dopracowane pozniej, ale musza pozostac generyczne i bez marek.

## Co Zapisujemy

Postepy sa zapisywane lokalnie w przegladarce. Baza cwiczen nie jest zapisywana w postepach; jest statycznym zestawem plikow JSON w repo.

Kazda zapisana sesja powinna zawierac:

- date i godzine zakonczenia;
- wybrany poziom;
- liczbe zadan;
- zdobyte punkty;
- liczbe ocen `Samodzielnie`;
- liczbe ocen `Z pomocą`;
- liczbe ocen `Trudne`;
- liczbe ocen `Pomiń`;
- liste trudnych slow;
- liste pominietych zadan.

Kazde zadanie w historii moze zawierac:

- typ zadania;
- identyfikator materialu;
- slowo lub zdanie;
- ocene rodzica;
- zdobyte punkty.

Dodatkowo zapis powinien pozwalac ustalic status materialu dla generatora
powtorek, np. czy dany wyraz byl ostatnio przeczytany samodzielnie, z pomoca,
oznaczony jako trudny albo pominiety.

## Podsumowanie Dnia

Pokazuje:

- punkty zdobyte dzisiaj;
- liczbe ukonczonych sesji;
- liczbe zadan;
- ile bylo samodzielnych odpowiedzi;
- trudne slowa z dzisiaj.

## Podsumowanie Tygodnia

Pokazuje:

- punkty z biezacego tygodnia kalendarzowego;
- liczbe sesji;
- dni z wykonana sesja;
- najczesciej trudne slowa;
- zdobyte odznaki.

MVP liczy tydzien jako biezacy tydzien kalendarzowy i opisuje ten zakres w UI.

## Podsumowanie Miesiaca

Pokazuje:

- punkty z biezacego miesiaca;
- liczbe sesji;
- liczbe zadan;
- najczesciej trudne slowa;
- odznaki zdobyte w miesiacu.

## Reset Postepow

Pelny reset usuwa:

- punkty;
- historie sesji;
- odznaki;
- liste trudnych slow.

Reset musi wymagac potwierdzenia. Przycisk nie powinien byc przypadkowo dostepny w glownym flow dziecka.
Reset nie usuwa bazy cwiczen.

## Eksport I Import

MVP powinno pozwalac rodzicowi wykonac kopie zapasowa postepow.

Eksport:

- pobiera plik JSON z lokalnymi postepami;
- zawiera historie sesji, punkty, odznaki i trudne slowa;
- nie zawiera bazy cwiczen.

Import:

- pozwala wgrac wczesniej wyeksportowany plik JSON;
- zastepuje obecny lokalny zapis po potwierdzeniu;
- nie modyfikuje bazy cwiczen.

To jest podstawowy mechanizm trwalosci danych w MVP. Backend i synchronizacja pozostaja poza zakresem.
