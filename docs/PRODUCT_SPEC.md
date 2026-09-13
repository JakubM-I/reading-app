# Specyfikacja Produktu MVP

## Cel Produktu

Aplikacja ma wspierac krotkie, regularne cwiczenia sylabizowania i czytania po polsku. Jest projektowana dla jednego dziecka, ktore konczy pierwsza klase i ma trudnosc ze skladaniem wyrazow z sylab oraz z utrzymaniem sensu prostego zdania po przeczytaniu.

Produkt nie ma zastapic rodzica, nauczyciela ani specjalisty. Ma byc domowym narzedziem wspierajacym wspolna prace.

## Odbiorcy

Glowni uzytkownicy:

- dziecko wykonujace cwiczenia;
- rodzic prowadzacy sesje, oceniajacy wykonanie i obserwujacy postepy.

Pierwsza wersja zaklada prace wspolna. Dziecko nie musi samodzielnie obslugiwac calej aplikacji.

## Platforma

Pierwsza implementacja:

- lokalna aplikacja webowa;
- React + Vite + TypeScript;
- uruchamianie w przegladarce na MacBooku;
- brak kont;
- brak backendu;
- brak synchronizacji;
- lokalny zapis danych w przegladarce;
- baza cwiczen jako statyczne pliki JSON w repo;
- eksport/import postepow do pliku JSON;
- pozniejsza mozliwosc deployu statycznego na Netlify.

## Zakres Funkcjonalny MVP

MVP zawiera:

- start sesji;
- wybor modulu po starcie sesji: `Sylabizowanie` albo `Czytanie`;
- brak sesji mieszanych w MVP;
- reczny wybor poziomu w module `Czytanie`;
- reczny wybor jednej z pierwszych szesciu struktur wyrazowych w module
  `Sylabizowanie`;
- opis poziomu albo struktury widoczny dla rodzica;
- modul sylabizowania jako osobna sciezka cwiczen;
- tryby pomocy w module sylabizowania: `Z pomocą`, `Z podpowiedzią`, `Samodzielnie`;
- cwiczenia laczenia spolgłoski z samogloska, czytania slow o okreslonej
  budowie, ukladania slow i odczytywania ich budowy;
- dwa jawnie oznaczone pseudowyrazy w domyslnej sesji sylabizowania, z opcja
  wylaczenia przez rodzica;
- rozgrzewke liter i dwuznakow;
- czytanie prowadzone;
- budowanie slow z sylab;
- reczna ocene kazdego zadania przez rodzica;
- punkty i odznaki progowe;
- podsumowanie sesji;
- podsumowanie dnia, tygodnia i miesiaca;
- panel postepow;
- eksport postepow do pliku JSON;
- import postepow z pliku JSON;
- reset biezacej sesji;
- pelny reset postepow z potwierdzeniem.

## Poza Zakresem MVP

MVP nie zawiera:

- logowania;
- wielu profili dzieci;
- kont rodzica;
- backendu;
- chmury;
- rozpoznawania mowy;
- automatycznej oceny wymowy;
- AI;
- rankingow;
- presji czasu;
- pelnej gry fabularnej;
- marek, postaci i assetow chronionych prawami IP.

## Motyw

Motyw publiczny: generyczne auta, wyscigi, pojazdy, tory, garaz i odznaki kierowcy.

Motyw ma wspierac motywacje, ale nie moze przeslaniac cwiczenia. Elementy wizualne powinny byc spokojne, czytelne i niezbyt bodzcujace.

## Sesja

Sesja powinna trwac okolo 3-6 minut. Dziecko powinno od poczatku widziec, ile zadan zostalo do konca.

Po starcie sesji rodzic wybiera, co dziecko cwiczy:

- `Sylabizowanie`;
- `Czytanie`.

Sesje nie sa mieszane w MVP. Tego samego dnia mozna wykonac osobno sesje
sylabizowania i osobno sesje czytania. Punkty, odznaki i podsumowania sa
liczone wspolnie dla obu modulow.

Domyslna struktura sesji czytania:

1. 3 zadania rozgrzewkowe.
2. 4 zadania czytania prowadzonego.
3. 2 zadania budowania slow.
4. 1 krotkie zdanie z pytaniem o sens.
5. Podsumowanie punktow i postepu.

Domyslna struktura sesji sylabizowania:

1. Wybor jednej z szesciu struktur i trybu pomocy przez rodzica.
2. 3 zadania syntezy sylaby lub sylaby zamknietej.
3. 3 zadania czytania prawdziwych slow.
4. 2 zadania czytania jawnie oznaczonych pseudowyrazow; po ich wylaczeniu
   aplikacja podaje prawdziwe slowa.
5. 1 zadanie budowania slowa.
6. 1 zadanie ponownego czytania z pokazana budowa.
7. Podsumowanie punktow i postepu.

Tryby pomocy w sylabizowaniu:

- `Z pomocą`: budowa, kolory i granice sylab sa widoczne od poczatku;
- `Z podpowiedzią`: budowa pojawia sie po uzyciu `Pokaż budowę`;
- `Samodzielnie`: dziecko najpierw probuje przeczytac samodzielnie, a rodzic
  moze pozniej uzyc `Pokaż odpowiedź`.

## Ocena Zadania

Po kazdym zadaniu aplikacja pokazuje rodzicowi sekcje "Ocen wykonanie zadania".

Dostepne oceny:

- `Samodzielnie`;
- `Z pomocą`;
- `Trudne`;
- `Pomiń`.

`Pomiń` konczy zadanie i nalicza 0 punktow.

## Kryteria Sukcesu MVP

MVP jest gotowe, gdy:

- mozna przeprowadzic pelna lokalna sesje;
- rodzic moze wybrac modul: `Sylabizowanie` albo `Czytanie`;
- rodzic moze wybrac poziom i zobaczyc jego opis;
- rodzic moze wybrac jedna z szesciu struktur sylabowych i zobaczyc jej opis;
- dziecko moze przejsc osobna sesje sylabizowania;
- dziecko moze przejsc osobna sesje czytania z rozgrzewka, czytaniem i budowaniem slow;
- rodzic ocenia kazde zadanie;
- aplikacja zapisuje lokalnie punkty i historie z informacja o module zadania;
- podsumowania lacza wyniki z obu modulow;
- aplikacja korzysta z bazy cwiczen zapisanej w plikach JSON;
- rodzic moze wyeksportowac i zaimportowac postepy jako plik JSON;
- panel postepow pokazuje dzien, tydzien i miesiac;
- reset sesji i reset aplikacji dzialaja zgodnie z opisem;
- aplikacja nie wymaga internetu ani konta.
