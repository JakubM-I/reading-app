# Plan Techniczny

## Cel Techniczny MVP

Pierwsza implementacja ma byc lokalna aplikacja webowa. Celem jest szybkie, stabilne narzedzie do cwiczen, nie pelna platforma edukacyjna.

Planowany stos:

- React;
- Vite;
- TypeScript;
- statyczne pliki JSON jako baza cwiczen;
- lokalny zapis postepow w przegladarce;
- eksport/import postepow do pliku JSON;
- brak backendu;
- brak kont;
- brak zewnetrznej bazy danych;
- pozniejszy statyczny deploy na Netlify.

## Proponowana Struktura Aplikacji

Przyszla aplikacja powinna logicznie rozdzielac:

- dane cwiczen;
- stan biezacej sesji;
- zapis postepow;
- komponenty zadan;
- panel rodzica;
- panel postepow;
- motyw wizualny.

Przykladowe obszary:

- `content`: sylaby, slowa, zdania, poziomy;
- `session`: generowanie i prowadzenie sesji;
- `progress`: punkty, historia, podsumowania;
- `components`: ekrany i elementy UI;
- `storage`: zapis i odczyt danych lokalnych.

To nie jest jeszcze wymagana struktura plikow, ale kierunek dla implementacji.

## Dane Cwiczen

Material powinien byc zdefiniowany jako statyczne pliki JSON w repo. To jest zrodlo prawdy dla cwiczen i poziomow.

Minimalne typy danych:

- poziom trudnosci;
- sylaba;
- wyraz z recznym podzialem na sylaby;
- zdanie;
- pytanie o sens;
- typ zadania;
- tagi trudnosci, np. `dwuznak`, `dz`, `pojazdy`.

Kazdy element powinien miec stabilne `id`, aby historia postepow nie opierala sie tylko na tekscie.

Rekomendowany podzial plikow JSON:

- `levels.json`: poziomy, opisy dla rodzica i kolejnosc trudnosci;
- `syllables.json`: sylaby i dwuznaki do rozgrzewki;
- `words.json`: slowa, podzial na sylaby, poziomy i tagi;
- `sentences.json`: zdania, pytania o sens i powiazane slowa.

Bazy cwiczen nie nalezy zapisywac w localStorage. Reset postepow nie moze jej usuwac.

## Stan Sesji

Biezaca sesja powinna przechowywac:

- wybrany poziom;
- liste zadan;
- indeks aktualnego zadania;
- czastkowe oceny;
- czastkowe punkty;
- informacje, czy sesja zostala zakonczona.

Reset biezacej sesji usuwa tylko stan tej sesji i nie zapisuje jej w historii.

## Zapis Postepow

Na MVP wystarczy lokalny zapis w przegladarce, ale musi istniec eksport/import jako kopia zapasowa.

Zapis obejmuje:

- historie zakonczonych sesji;
- punkty laczne;
- odznaki;
- trudne slowa;
- pominiete zadania;
- date ostatniej sesji.

Pelny reset usuwa caly lokalny zapis postepow po potwierdzeniu.
Pelny reset nie usuwa plikow JSON z baza cwiczen.

## Eksport I Import Postepow

Eksport tworzy plik JSON z lokalnymi postepami. Plik powinien zawierac:

- wersje formatu eksportu;
- date eksportu;
- historie sesji;
- punkty laczne;
- odznaki;
- trudne slowa;
- pominiete zadania.

Import wczytuje taki plik i po potwierdzeniu zastepuje obecny lokalny zapis postepow. Import nie modyfikuje bazy cwiczen zapisanej w repo.

Jezeli format eksportu zmieni sie w przyszlosci, nalezy dodac migracje albo jasny komunikat o niezgodnym pliku.

## Podsumowania

Aplikacja powinna liczyc:

- podsumowanie dnia;
- podsumowanie tygodnia;
- podsumowanie miesiaca.

Rekomendacja dla MVP:

- dzien: biezaca data lokalna;
- tydzien: biezacy tydzien kalendarzowy;
- miesiac: biezacy miesiac kalendarzowy.

UI powinien jasno opisac, jaki zakres pokazuje.

## Przyszly Deploy

Docelowo aplikacja moze zostac wdrozona jako statyczna strona na Netlify.

Wymagania pod przyszly deploy:

- brak zaleznosci od lokalnego serwera backendowego;
- brak sekretow w repo;
- brak chronionych assetow marek;
- baza cwiczen dostarczana jako statyczne JSON-y;
- mozliwosc zbudowania statycznej paczki.

## Testowanie Przyszlej Implementacji

Minimalny zestaw testow/scenariuszy:

- start sesji z wybranym poziomem;
- przejscie calej sesji;
- naliczanie punktow dla wszystkich ocen;
- `Pomiń` daje 0 punktow;
- trudne zadania trafiaja do historii;
- zapis sesji pojawia sie w podsumowaniach;
- eksport postepow tworzy plik JSON;
- import postepow odtwarza lokalny zapis;
- reset sesji nie zapisuje wyniku;
- pelny reset usuwa historie i punkty;
- pelny reset nie usuwa bazy cwiczen;
- aplikacja dziala bez konta i backendu.

## Ograniczenia

Nie dodawac w MVP:

- backendu;
- logowania;
- rozpoznawania mowy;
- AI;
- generowania tresci w runtime;
- zaleznosci wymagajacych sieci do dzialania aplikacji;
- marek i assetow chronionych prawami IP.
