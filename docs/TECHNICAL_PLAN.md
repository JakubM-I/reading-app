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
- wybor modulu cwiczen;
- stan biezacej sesji;
- zapis postepow;
- komponenty zadan;
- panel rodzica;
- panel postepow;
- motyw wizualny.

Przykladowe obszary:

- `content`: poziomy czytania, struktury, laczenia, slowa, pseudowyrazy i
  zdania;
- `session`: generowanie i prowadzenie sesji dla wybranego modulu;
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
- liczba sylab w wyrazie;
- przydatnosc wyrazu do modulu sylabizowania;
- zdanie;
- pytanie o sens;
- modul zadania: `syllabification` albo `reading`;
- typ zadania;
- tagi trudnosci, np. `dwuznak`, `dz`, `pojazdy`.

Kazdy element powinien miec stabilne `id`, aby historia postepow nie opierala sie tylko na tekscie.

Rekomendowany podzial plikow JSON:

- `levels.json`: poziomy, opisy dla rodzica i kolejnosc trudnosci;
- `syllables.json`: sylaby i dwuznaki do rozgrzewki;
- `words.json`: slowa, podzial na sylaby, liczba sylab, poziomy i tagi;
- `sentences.json`: zdania, pytania o sens i powiazane slowa.
- `structures.json`: definicje pierwszych szesciu struktur;
- `blends.json`: recznie przygotowane laczenia `C + V` i `CV + C`;
- `decodingWords.json`: prawdziwe slowa sklasyfikowane wedlug struktury;
- `pseudowords.json`: jawnie oznaczony material bez znaczenia.

Bazy cwiczen nie nalezy zapisywac w localStorage. Reset postepow nie moze jej usuwac.

Modul sylabizowania korzysta z recznego podzialu sylab i grafemow. Kazdy
grafem ma role `vowel` albo `consonant` oraz indeks sylaby. Automatyczne
dzielenie slow ani generowanie pseudowyrazow nie jest czescia MVP.

Przydatne pola dla slow:

- `syllableCount`;
- `syllabificationLevel`;
- `syllabificationTags`;
- `allowedSyllableSplits`;
- `suitableForSyllabification`.

## Stan Sesji

Biezaca sesja powinna przechowywac:

- wybrany modul: `syllabification` albo `reading`;
- wybrany poziom czytania albo strukture sylabowa;
- wybrany tryb pomocy, jesli jest to sesja sylabizowania;
- informacje, czy pseudowyrazy byly wlaczone;
- liste zadan;
- indeks aktualnego zadania;
- czastkowe oceny;
- czastkowe punkty;
- informacje, czy sesja zostala zakonczona.

Reset biezacej sesji usuwa tylko stan tej sesji i nie zapisuje jej w historii.

Nie tworzymy sesji mieszanych w MVP. Po starcie rodzic wybiera modul, a
generator przygotowuje zadania tylko dla tego modulu.

## Dobor Zadan I Powtorki

Generator sesji powinien traktowac poziom jako zakres trudnosci, nie jako
jednorazowo zaliczony etap. Rodzic moze wiele razy wybrac ten sam poziom.

Docelowo generator powinien korzystac z lokalnej historii ocen:

- material oceniony jako `Samodzielnie` nie trafia do aktywnej puli powtorek w
  najblizszych sesjach;
- material oceniony jako `Z pomocą` wraca do puli powtorek;
- material oceniony jako `Trudne` wraca do puli z wyzszym priorytetem;
- material oceniony jako `Pomiń` wraca do puli, ale bez punktow za wykonanie.

Jesli w wybranym poziomie brakuje nowego materialu, generator moze dobrac
material z wczesniejszych poziomow albo powtorzyc elementy wymagajace utrwalenia.
Nie powinien jednak stale powtarzac elementow, ktore dziecko czyta samodzielnie.

Historia powtorek rozroznia modul i rodzaj zadania. Klucz ma format
`modul:rodzaj-zadania:materialId`, dzieki czemu czytanie i budowanie tego samego
slowa nie nadpisuja sie.

## Zapis Postepow

Na MVP wystarczy lokalny zapis w przegladarce, ale musi istniec eksport/import jako kopia zapasowa.

Zapis obejmuje:

- historie zakonczonych sesji;
- historie ocen dla materialu, aby generator mogl decydowac o powtorkach;
- modul sesji i modul zadania;
- punkty laczne;
- odznaki;
- trudne slowa;
- pominiete zadania;
- date ostatniej sesji.

Format postepow ma wersje 2. Normalizacja przy odczycie i imporcie przyjmuje
wersje 1, zachowuje punkty, odznaki i sesje oraz przepisuje historie materialu
na klucze zawierajace rodzaj zadania.

Pelny reset usuwa caly lokalny zapis postepow po potwierdzeniu.
Pelny reset nie usuwa plikow JSON z baza cwiczen.

## Eksport I Import Postepow

Eksport tworzy plik JSON z lokalnymi postepami. Plik powinien zawierac:

- wersje formatu eksportu;
- date eksportu;
- historie sesji;
- modul sesji i modul zadan w historii;
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
- wybor modulu `Sylabizowanie`;
- wybor modulu `Czytanie`;
- przejscie sesji sylabizowania bez mieszania jej z czytaniem;
- 36 kombinacji generatora: 6 struktur, 3 tryby pomocy i pseudowyrazy
  wlaczone lub wylaczone;
- dokladnie 10 zadan i jedna struktura w kazdej sesji sylabizowania;
- obsluga `CVC` bez sztucznego podzialu na kilka sylab;
- przejscie calej sesji;
- naliczanie punktow dla wszystkich ocen z uwzglednieniem modulu, poziomu,
  typu zadania i trybu pomocy;
- `Pomiń` daje 0 punktow;
- trudne zadania trafiaja do historii;
- historia zadan zapisuje modul;
- historia zadan zapisuje rodzaj zadania i kontekst struktury;
- import postepow w wersji 1 migruje dane do wersji 2;
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
