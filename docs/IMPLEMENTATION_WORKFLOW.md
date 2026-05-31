# Workflow Realizacji Aplikacji

## Cel Workflow

Aplikacja ma powstawac etapami. Nie budujemy calego MVP naraz. Kazdy krok powinien konczyc sie malym, sprawdzalnym rezultatem, ktory mozna uruchomic, obejrzec albo zweryfikowac w dokumentacji.

Zasady:

- jeden etap = jeden konkretny przyrost;
- po kazdym etapie aplikacja powinna sie budowac i uruchamiac;
- nie dodawac funkcji spoza aktualnego etapu;
- nie przechodzic do kolejnego etapu, jesli poprzedni nie ma podstawowej weryfikacji;
- decyzje produktowe aktualizowac w dokumentach przed implementacja.

## Etap 0 - Przygotowanie Repo

Cel: przygotowac projekt technicznie, bez logiki aplikacji.

Zakres:

- zainicjowac projekt React + Vite + TypeScript;
- dodac podstawowe skrypty uruchamiania i budowania;
- dodac minimalna strukture katalogow;
- upewnic sie, ze aplikacja startuje lokalnie;
- nie implementowac jeszcze cwiczen.

Rezultat:

- lokalna aplikacja pokazuje prosty ekran startowy lub placeholder;
- `npm run dev` uruchamia projekt;
- `npm run build` przechodzi poprawnie.

## Etap 1 - Statyczna Baza Cwiczen JSON

Cel: przygotowac material edukacyjny jako dane, zanim powstanie pelna logika sesji.

Zakres:

- dodac pliki JSON z baza cwiczen;
- przygotowac poziomy, sylaby, slowa i zdania;
- dodac stabilne identyfikatory;
- dodac reczny podzial slow na sylaby;
- dodac prosta walidacje albo test sprawdzajacy poprawnosc struktury danych.

Pliki danych:

- `levels.json`;
- `syllables.json`;
- `words.json`;
- `sentences.json`.

Rezultat:

- aplikacja lub test potrafi wczytac baze cwiczen;
- kazdy poziom ma opis dla rodzica;
- dane nie sa zapisywane w localStorage.

## Etap 2 - Podstawowy Layout I Nawigacja

Cel: stworzyc szkielet aplikacji bez pelnego dzialania cwiczen.

Zakres:

- ekran startowy;
- wybor poziomu z opisem;
- pusty ekran sesji;
- panel postepow jako placeholder;
- miejsce na reset danych;
- spokojny motyw wizualny: auta, tory, pojazdy, odznaki kierowcy.

Rezultat:

- mozna przejsc ze startu do wyboru poziomu i ekranu sesji;
- UI jest czytelny na MacBooku;
- aplikacja nadal nie potrzebuje kont ani backendu.

## Etap 3 - Silnik Sesji Bez Zapisu Postepow

Cel: uruchomic jedna sesje w pamieci aplikacji, bez trwalego zapisu.

Zakres:

- generowanie listy zadan dla wybranego poziomu;
- postep sesji, np. `4 / 10`;
- przechodzenie miedzy zadaniami;
- reset biezacej sesji bez zapisu;
- struktura ocen rodzica: `Samodzielnie`, `Z pomocą`, `Trudne`, `Pomiń`.

Rezultat:

- mozna przejsc cala sesje od startu do podsumowania;
- punkty sa liczone w pamieci;
- po odswiezeniu strony postep sesji moze zniknac.

## Etap 4 - Rozgrzewka Liter I Dwuznakow

Cel: zaimplementowac pierwszy realny typ zadania.

Zakres:

- zadanie rozpoznawania lub czytania sylaby/dwuznaku;
- widoczna sekcja `Oceń wykonanie zadania`;
- naliczanie punktow wedlug oceny;
- obsluga `Pomiń` jako 0 punktow.

Rezultat:

- rozgrzewka dziala w ramach sesji;
- rodzic moze ocenic kazde zadanie;
- podsumowanie sesji pokazuje oceny i punkty.

## Etap 5 - Czytanie Prowadzone

Cel: dodac glowne cwiczenie sylaba -> wyraz -> zdanie.

Zakres:

- ekran sylab;
- ekran calego wyrazu;
- ekran prostego zdania;
- przechodzenie etapami bez automatycznego tempa;
- pytanie o sens jako element ustny oceniany przez rodzica.

Rezultat:

- dziecko moze przeczytac slowo etapami;
- podzial sylabowy znika przed czytaniem calego wyrazu;
- rodzic ocenia wykonanie po zadaniu.

## Etap 6 - Budowanie Slow Z Sylab

Cel: dodac aktywne skladanie wyrazu.

Zakres:

- kafelki sylab;
- ukladanie kliknieciem;
- pole odpowiedzi;
- mozliwosc cofniecia wybranej sylaby;
- ocena rodzica po wykonaniu.

Rezultat:

- dziecko moze zbudowac wyraz z kafelkow;
- aplikacja nie wymaga przeciagania;
- zadanie liczy punkty tak samo jak pozostale.

## Etap 7 - Lokalny Zapis Postepow

Cel: zapisywac zakonczone sesje lokalnie.

Zakres:

- zapis historii sesji w przegladarce;
- punkty laczne;
- odznaki progowe;
- lista trudnych slow;
- pelny reset postepow z potwierdzeniem.

Rezultat:

- po odswiezeniu strony historia i punkty zostaja;
- reset sesji nie zapisuje wyniku;
- pelny reset usuwa postepy, ale nie baze cwiczen.

## Etap 8 - Panel Postepow

Cel: pokazac rodzicowi realny obraz pracy.

Zakres:

- podsumowanie dnia;
- podsumowanie biezacego tygodnia kalendarzowego;
- podsumowanie biezacego miesiaca;
- punkty laczne;
- liczba sesji;
- ostatnie trudne slowa;
- odznaki.

Rezultat:

- rodzic widzi, ile pracy zostalo wykonane;
- dane moga sluzyc do realnej nagrody poza aplikacja;
- panel nie wymaga backendu.

## Etap 9 - Eksport I Import Postepow

Cel: zabezpieczyc dane przed utrata.

Zakres:

- eksport postepow do pliku JSON;
- import wczesniej wyeksportowanego pliku;
- potwierdzenie przed nadpisaniem obecnych postepow;
- komunikat przy niezgodnym pliku.

Rezultat:

- rodzic moze zrobic kopie zapasowa;
- import odtwarza lokalny zapis;
- eksport nie zawiera bazy cwiczen.

## Etap 10 - Dopolerowanie MVP

Cel: przygotowac pierwsza wersje do regularnego domowego uzycia.

Zakres:

- sprawdzenie pelnego flow;
- uproszczenie tekstow w UI;
- poprawa czytelnosci na MacBooku;
- drobne poprawki motywu pojazdow;
- usuniecie rozpraszaczy;
- weryfikacja braku marek i chronionych assetow.

Rezultat:

- aplikacja jest gotowa do pierwszych prawdziwych sesji;
- MVP nie zawiera funkcji spoza ustalonego zakresu;
- dokumentacja zgadza sie z implementacja.

## Reguly Kontroli Po Kazdym Etapie

Po kazdym etapie nalezy sprawdzic:

- czy aplikacja nadal sie uruchamia;
- czy build przechodzi;
- czy nie dodano backendu, kont, AI ani rozpoznawania mowy;
- czy nie dodano chronionych marek, nazw ani assetow;
- czy zmiana odpowiada dokumentacji;
- czy kolejny etap nie wymaga nowej decyzji produktowej.

## Kolejnosc Obowiazkowa Dla MVP

Kolejne etapy powinny byc realizowane w tej kolejnosci:

1. Przygotowanie repo.
2. Statyczna baza cwiczen JSON.
3. Layout i nawigacja.
4. Silnik sesji bez zapisu.
5. Rozgrzewka.
6. Czytanie prowadzone.
7. Budowanie slow.
8. Lokalny zapis postepow.
9. Panel postepow.
10. Eksport/import.
11. Dopolerowanie MVP.

Nie nalezy laczyc wielu etapow w jedna duza zmiane, chyba ze uzytkownik wyraznie o to poprosi.
