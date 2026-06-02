# AGENTS.md

Instrukcje dla agentow i developerow pracujacych nad tym repozytorium.

## Kontekst Projektu

To indywidualna aplikacja edukacyjna dla jednego dziecka, wspierajaca nauke czytania po polsku. Dziecko konczy pierwsza klase, ma trudnosc ze skladaniem sylab w wyrazy, czasem zgaduje slowa po fragmencie i bywa zniechecone do jezyka polskiego. Ma tez stwierdzone cechy autystyczne, dlatego projekt powinien byc spokojny, przewidywalny i malo bodzcujacy.

## Jezyk I Styl

- Dokumentacja i komunikacja projektowa powinny byc po polsku.
- Interfejs aplikacji powinien byc po polsku.
- Teksty w UI maja byc krotkie, konkretne i spokojne.
- Unikaj tonu testu, porazki, presji czasu i czerwonych komunikatow bledow.

## Priorytety

1. Prostota przed rozbudowa.
2. Przewidywalna sesja przed efektowna gra.
3. Wsparcie rodzica przed automatyczna ocena.
4. Lokalnosc danych przed synchronizacja.
5. Czytelnosc cwiczen przed dekoracjami.

## Zakres MVP

MVP obejmuje:

- jeden lokalny profil dziecka;
- brak logowania;
- brak backendu;
- brak synchronizacji;
- brak rozpoznawania mowy;
- baza cwiczen jako statyczne pliki JSON w repo;
- reczna ocene zadania przez rodzica;
- rozgrzewke liter i dwuznakow;
- czytanie prowadzone;
- budowanie slow z sylab;
- punkty, odznaki i podsumowania;
- reset sesji i reset wszystkich postepow;
- eksport/import postepow jako kopia zapasowa JSON.

Nie dodawaj funkcji spoza MVP bez wyraznej decyzji uzytkownika.

## Zasady Dotyczace Marek I IP

Publiczne repo nie moze zawierac chronionych postaci, marek, nazw ani assetow zwiazanych m.in. z Pokemon, Hot Wheels, Minecraft, Sonic, LEGO, Garfield ani podobnymi markami.

Dozwolony kierunek publiczny:

- generyczne auta;
- wyscigi;
- pojazdy;
- tory;
- garaz;
- odznaki kierowcy;
- klockowe lub pikselowe inspiracje bez kopiowania marek.

Nie uzywaj nazw marek jako nazw poziomow, motywow, assetow, komponentow ani danych cwiczeniowych.

## Zasady Pracy

- Przed wieksza zmiana produktowa sprawdz dokumenty w `docs/`.
- `docs/PRODUCT_SPEC.md` jest zrodlem prawdy dla zakresu MVP.
- Realizacje aplikacji prowadz etapami wedlug `docs/IMPLEMENTATION_WORKFLOW.md`.
- Jesli decyzja produktowa nie jest opisana, najpierw zaproponuj ja w dokumentacji albo zapytaj uzytkownika.
- Nie scaffoldowac aplikacji ani nie dodawac zaleznosci, jesli zadanie dotyczy tylko dokumentacji.
- Nie wprowadzac backendu, routingu serwerowego, kont ani zewnetrznej bazy danych w MVP.
- Baze cwiczen trzymaj w wersjonowanych plikach JSON, nie w localStorage.
- Postepy zapisuj lokalnie w przegladarce i zapewnij eksport/import do pliku JSON.
- Preferuj lokalne, proste struktury danych, ktore da sie pozniej przeniesc do trwalszego storage.
- Kazdy komponent React powinien byc w osobnym pliku. Plik powinien miec nazwe glownego komponentu, ktory eksportuje.

## Definicja Gotowosci Dla Implementacji MVP

Implementacja moze ruszyc, gdy dokumenty odpowiadaja na pytania:

- co budujemy;
- dla kogo;
- jak wyglada jedna sesja;
- jakie sa typy zadan;
- jak rodzic ocenia zadanie;
- jak liczymy punkty;
- gdzie zapisana jest baza cwiczen;
- co zapisujemy lokalnie;
- jak dziala eksport i import postepow;
- jak dziala reset;
- w jakiej kolejnosc realizowac etapy MVP;
- czego celowo nie robimy w MVP.
