# Plan Implementacji Modulu Sylabizowania

## Cel Dokumentu

Ten dokument opisuje wdrozenie osobnego modulu `Sylabizowanie`. Jest zrodlem
prawdy dla kolejnych etapow implementacji tego modulu.

Etap 0 polega wylacznie na utworzeniu tego dokumentu. Kolejne etapy nie sa
wykonywane automatycznie. Kazdy nastepny etap musi zostac osobno i recznie
zainicjowany.

## Cel Modulu

Modul `Sylabizowanie` ma wspierac dziecko w rozpoznawaniu, liczeniu i
wskazywaniu sylab w slowach. Jest to osobna sciezka cwiczen przygotowujaca do
czytania, ale nie zastapi ani nie zmieni obecnego modulu `Czytanie`.

Najwazniejsze zalozenia:

- `Czytanie` pozostaje osobnym modulem;
- core obecnego czytania pozostaje bez zmian;
- nie tworzymy sesji mieszanych;
- jednego dnia mozna wykonac osobna sesje sylabizowania i osobna sesje czytania;
- punkty, odznaki i podsumowania sa liczone wspolnie dla obu modulow;
- historia zadan i powtorek rozroznia, czy zadanie pochodzilo z sylabizowania,
  czy z czytania.

## Ograniczenia Wdrozenia

- Nie wprowadzac backendu, kont, synchronizacji, AI ani rozpoznawania mowy.
- Nie zmieniac nazw ocen rodzica.
- Nie zmieniac designu istniejacych ekranow.
- Nie przebudowywac obecnego modulu czytania.
- Nowy ekran lub panel musi korzystac z ogolnej budowy istniejacych ekranow.
- Robocze elementy nawigacji moga zostac dodane do istniejacego flow tylko w
  sposob minimalny, np. jako nowy krok lub karta pomiedzy istniejacymi elementami.
- Docelowe zmiany wizualne w istniejacych elementach wymagaja osobnego etapu:
  najpierw opis zakresu, potem realizacja dopiero po zatwierdzeniu.
- Nie dodawac zadania wyboru poprawnego podzialu z kilku odpowiedzi, poniewaz
  takie zadanie moze wzmacniac zgadywanie.

## Etapy Wdrozenia

### Etap 0 - Dokument Projektowy

Zakres:

- utworzyc `docs/SYLLABIFICATION_IMPLEMENTATION_PLAN.md`;
- opisac pelny plan wdrozenia modulu sylabizowania;
- nie zmieniac kodu aplikacji;
- nie zmieniac danych JSON;
- nie zmieniac UI.

Rezultat:

- istnieje dokument implementacyjny;
- dokument jasno wskazuje, ze kolejne etapy beda inicjowane recznie;
- `git diff --check` przechodzi czysto.

### Etap 1 - Fundament Danych I Typow

Cel: przygotowac wspolne typy i dane pod dwa osobne moduly bez zmiany
zachowania obecnego czytania.

Zakres:

- dodac typ `SessionModule = 'reading' | 'syllabification'`;
- dodac typ `SyllabificationSupportMode = 'full-help' | 'partial-help' | 'independent'`;
- rozszerzyc rodzaje zadan o sylabizowanie:
  - `syllable-count`;
  - `syllable-say`;
  - `syllable-build`;
  - `syllable-split`;
- rozszerzyc dane slow o pola potrzebne do sylabizowania:
  - `syllableCount`;
  - `suitableForSyllabification`;
  - opcjonalnie `syllabificationTags`;
- zaktualizowac walidacje tresci.

Zasady danych:

- modul sylabizowania korzysta z recznego podzialu slow w `words.json`;
- automatyczne dzielenie slow na sylaby nie jest czescia MVP;
- slowo oznaczone jako nadajace sie do sylabizowania musi miec co najmniej
  dwie sylaby;
- `syllableCount` musi odpowiadac liczbie elementow w `syllables`;
- slowa jednosylabowe moga pozostac w bazie czytania, ale nie powinny trafic do
  glownej puli sylabizowania.

Rezultat:

- dane i typy sa gotowe na dwa moduly;
- obecny generator czytania dziala jak dotad;
- walidacja tresci wykrywa niespojne dane sylabizowania.

### Etap 2 - Nawigacja Modulow

Cel: dodac wybor, czy dziecko cwiczy `Sylabizowanie`, czy `Czytanie`.

Zakres:

- dodac ekran `ModuleChoiceScreen`;
- ustawic flow: `StartScreen` -> `ModuleChoiceScreen` -> `LevelScreen` -> `SessionScreen`;
- dla `Czytanie` po wyborze poziomu uruchamiac obecny generator czytania;
- dla `Sylabizowanie` po wyborze poziomu przejsc do wyboru trybu pomocy;
- zachowac istniejacy wyglad ekranow i uzyc istniejacych klas/konstrukcji UI,
  gdzie to mozliwe.

Zasady:

- nie dodawac trybu mieszanego;
- nie zmieniac tresci ani ukladu istniejacych ekranow bardziej, niz wymaga tego
  minimalne przepiecie nawigacji;
- modul czytania ma pozostac dostepny i dzialac jak przed dodaniem wyboru modulu.

Rezultat:

- po starcie sesji rodzic wybiera modul;
- wybor `Czytanie` prowadzi do obecnego flow czytania;
- wybor `Sylabizowanie` prowadzi do flow nowego modulu.

### Etap 3 - Generator Sesji Sylabizowania

Cel: dodac osobny generator sesji sylabizowania.

Zakres:

- dodac `createSyllabificationSession`;
- generator przyjmuje poziom, tryb pomocy, dane cwiczen i historie materialu;
- sesja zawiera tylko zadania sylabizowania;
- sesja nie zawiera rozgrzewki, czytania prowadzonego, budowania slow w module
  czytania ani pytania o sens zdania.

Domyslny uklad sesji:

1. 1 zadanie liczenia sylab.
2. 2 zadania mowienia slowa sylabami.
3. 1 zadanie ukladania albo wskazywania sylab.
4. 2 zadania wstawiania podzialu sylabowego.

Zasady doboru materialu:

- wybierac slowa oznaczone jako `suitableForSyllabification`;
- priorytetowo wybierac slowa z aktualnego poziomu;
- jesli brakuje materialu, mozna dobrac slowa z wczesniejszych poziomow;
- nie dobierac slow jednosylabowych;
- rotacja materialu korzysta z historii specyficznej dla modulu
  `syllabification`.

Rezultat:

- mozna utworzyc kompletna sesje sylabizowania w pamieci;
- sesja ma `module: 'syllabification'`;
- obecny generator czytania nie zmienia swojego zachowania.

### Etap 4 - Ekrany Zadan Sylabizowania

Cel: dodac obsluge zadan sylabizowania w UI zgodnie z obecna budowa aplikacji.

Zakres:

- dodac ekran lub panel zadan sylabizowania, np. `SyllabificationTaskPanel`;
- podlaczyc nowe rodzaje zadan do wspolnego `SessionTaskPanel`;
- wykorzystac istniejacy `SessionScreen`, panel rodzica, oceny i postep sesji;
- dodac obsluge trybow pomocy:
  - `Z pomocą`;
  - `Z podpowiedzią`;
  - `Samodzielnie`.

Zachowanie trybow:

- `Z pomocą`: pokazac pelny podzial, np. `ra-kie-ta`;
- `Z podpowiedzią`: pokazac czesciowa pomoc, np. liczbe sylab, puste miejsca
  albo pierwsza granice;
- `Samodzielnie`: pokazac caly wyraz i schowac sciage pod przyciskiem
  `Podpowiedź`.

Sciaga sylabizowania:

- ma byc krotka i spokojna;
- moze zawierac komunikaty typu:
  - `Znajdź samogłoski.`;
  - `Zwykle jedna sylaba ma jedną samogłoskę.`;
  - `Powiedz słowo powoli.`;
  - `Dwuznak trzyma się razem.`;
  - `Nie każde i robi osobną sylabę.`;
- nie moze przejmowac zadania za dziecko.

Zasady UI:

- nie zmieniac designu istniejacych ekranow;
- nie dodawac rozpraszajacych animacji;
- nie uzywac czerwonych komunikatow porazki;
- teksty w UI maja byc krotkie, konkretne i spokojne.

Rezultat:

- dziecko moze przejsc zadania sylabizowania;
- rodzic ocenia kazde zadanie tym samym zestawem ocen co w czytaniu;
- panel rodzica i podsumowanie sesji dzialaja wspolnie dla obu modulow.

### Etap 5 - Postepy I Kompatybilnosc

Cel: zapisac informacje o module bez utraty kompatybilnosci z obecnymi
postepami.

Zakres:

- zachowac `StoredProgress.version = 1`;
- dodac `module` do sesji, zadan i historii materialu;
- normalizowac stare rekordy bez pola `module` jako `reading`;
- rozdzielic historie powtorek dla czytania i sylabizowania;
- zachowac kompatybilny eksport/import.

Zasady:

- stare dane w `localStorage` musza sie ladowac poprawnie;
- stara sesja bez `module` oznacza sesje `reading`;
- stare zadanie bez `module` oznacza zadanie `reading`;
- klucz historii materialu powinien rozrozniac modul, np. `reading:word-l2-auto`
  i `syllabification:word-l2-auto`;
- dobry wynik w sylabizowaniu nie oznacza automatycznie opanowania czytania tego
  samego slowa;
- dobry wynik w czytaniu nie oznacza automatycznie opanowania samodzielnego
  podzialu slowa.

Rezultat:

- postepy z obecnej wersji aplikacji pozostaja czytelne;
- nowe sesje zapisuja modul;
- powtorki materialu dzialaja osobno dla obu modulow.

### Etap 6 - Podsumowania

Cel: pokazywac wspolny obraz pracy z jednym systemem punktow dla obu modulow.

Zakres:

- punkty liczyc wspolnie dla obu modulow;
- punkty naliczac wedlug modulu, poziomu, typu zadania i trybu pomocy;
- odznaki liczyc wedlug wspolnych progow opisanych w
  `docs/PROGRESS_AND_REWARDS.md`;
- podsumowania dnia, tygodnia i miesiaca obejmuja oba moduly;
- ewentualny podzial na moduly pokazac tylko pomocniczo.

Zasady:

- nie zmieniac nazw ocen;
- nie przebudowywac panelu postepow bez osobnej decyzji.

Rezultat:

- rodzic widzi laczny postep pracy;
- sesje sylabizowania i czytania zwiekszaja te same punkty laczne;
- aplikacja nadal zachowuje spokojny, prosty system nagradzania.

### Etap 7 - Docelowe Poprawki Wizualne Po Akceptacji

Cel: zaplanowac ewentualne zmiany wizualne dopiero po sprawdzeniu podstawowego
wdrozenia.

Zakres:

- etap nie jest czescia podstawowego wdrozenia modulu;
- jesli po dodaniu modulu trzeba dopracowac strone glowna, wybor modulu albo
  inne istniejace elementy, najpierw trzeba spisac zakres zmian;
- realizacja zmian wizualnych nastepuje dopiero po zatwierdzeniu zakresu.

Zasady:

- nie poprawiac przy okazji designu istniejacych ekranow;
- nie zmieniac ukladu strony glownej bez osobnej decyzji;
- nie dodawac nowych dekoracji, jesli nie wspieraja czytelnosci cwiczenia.

Rezultat:

- podstawowe wdrozenie modulu nie rozlewa sie na redesign aplikacji;
- ewentualne dopracowanie wizualne ma osobny, kontrolowany etap.

## Interfejsy I Typy Do Dodania

Minimalne nowe typy:

```ts
type SessionModule = 'reading' | 'syllabification'

type SyllabificationSupportMode =
  | 'full-help'
  | 'partial-help'
  | 'independent'
```

Minimalne rozszerzenie typow sesji:

- sesja ma `module`;
- zadanie ma `module`;
- zadanie sylabizowania moze miec `supportMode`;
- zadanie sylabizowania ma dane slowa, sylab i oczekiwanego podzialu.

Minimalne rozszerzenie typow postepow:

- rekord sesji ma `module`;
- rekord zadania ma `module`;
- rekord materialu ma `module` albo jest zapisywany pod kluczem z modulem.

## Testy I Kryteria Akceptacji

Testy techniczne dla kolejnych etapow:

- `npm run validate:content`;
- `npm run build`;
- reczne przejscie sesji czytania;
- reczne przejscie sesji sylabizowania;
- reczny test importu/eksportu postepow;
- reczny test starego localStorage bez pola `module`.

Kryteria akceptacji calego modulu:

- rodzic moze wybrac `Sylabizowanie` albo `Czytanie`;
- `Czytanie` dziala jak dotad;
- `Sylabizowanie` ma osobna sesje i tryb pomocy;
- nie istnieje sesja mieszana;
- zadania sylabizowania nie polegaja na wyborze poprawnej odpowiedzi z kilku
  wariantow;
- punkty i odznaki licza sie wspolnie;
- historia powtorek rozroznia oba moduly;
- stare postepy sa traktowane jako `reading`;
- UI nowego modulu jest zgodny z ogolna budowa aplikacji;
- istniejace ekrany nie zostaly przeprojektowane.

## Kryteria Akceptacji Etapu 0

- Powstal tylko plik `docs/SYLLABIFICATION_IMPLEMENTATION_PLAN.md`.
- Dokument jasno mowi, ze modul czytania pozostaje bez zmian.
- Dokument jasno mowi, ze nie robimy sesji mieszanych.
- Dokument jasno mowi, ze zmiany wizualne istniejacych ekranow sa poza
  podstawowym wdrozeniem.
- Dokument wskazuje, ze kolejne etapy beda inicjowane recznie.
- `git diff --check` przechodzi czysto.
