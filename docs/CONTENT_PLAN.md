# Plan Tresci

## Zasady Doboru Materialu

Material ma byc po polsku, prosty i zwiazany z codziennymi albo motoryzacyjnymi tematami. Pierwsza wersja skupia sie na prawdziwych slowach, a nie pseudowyrazach.

Zasady:

- zaczynac od latwych sylab i znanych slow;
- nie pokazywac obrazka przed proba przeczytania, jesli obrazek moglby zdradzic odpowiedz;
- trudniejsze dwuznaki wprowadzac pozniej;
- kazdy poziom musi miec opis dla rodzica;
- slowa powinny miec recznie sprawdzony podzial na sylaby.
- do modulu sylabizowania wybierac przede wszystkim slowa dwu- i trzysylabowe;
- slowa jednosylabowe nie powinny byc glownym materialem sylabizowania;
- nie tworzyc zadan polegajacych na wyborze poprawnego podzialu z kilku
  wariantow, bo zwieksza to ryzyko zgadywania.

## Wielkosc Bazy Docelowej

Sesja pozostaje krotka i ma miec okolo 10 zadan. Baza cwiczen powinna jednak
docelowo wystarczyc na okolo miesiac spokojnej pracy, czyli mniej wiecej 20-25
krotkich sesji bez poczucia, ze aplikacja skonczyla sie po kilku dniach.

Poziom nie jest traktowany jako jednorazowo zaliczony etap. Poziom oznacza
zakres trudnosci, do ktorego rodzic moze wracac przez wiele sesji.

Docelowo baza powinna zawierac orientacyjnie:

- Poziom 1: 40-60 sylab, znakow i bardzo prostych slow;
- Poziom 2: 60-90 prostych slow oraz 40-60 krotkich zdan;
- Poziom 3: 50-70 slow z dwuznakami oraz 30-50 zdan;
- Poziom 4: 35-50 trudniejszych slow oraz 25-40 zdan.

Liczby sa kierunkiem, nie sztywnym limitem. Lepiej dodawac material stopniowo i
sprawdzac go recznie, niz szybko wypelnic baze zbyt trudnymi albo malo
przydatnymi slowami.

Stan bazy MVP po etapie zamykajacym MVP:

- 118 sylab, znakow i elementow do rozgrzewki;
- 107 slow z recznym podzialem na sylaby;
- 65 krotkich zdan z pytaniami o sens.

Ta sama baza slow moze zasilac modul czytania i modul sylabizowania, ale zadania
powinny zapisywac, z ktorego modulu pochodza. Dzieki temu postepy moga byc
liczone wspolnie, a historia nadal pozwala rozroznic trudnosc w podziale slowa
od trudnosci w przeczytaniu calego slowa.

Taka pula jest traktowana jako baza gotowa do pierwszego regularnego uzycia.
Dalsze rozszerzanie powinno byc spokojnym dopisywaniem sprawdzonych elementow,
a nie warunkiem uruchomienia MVP.

## Powtarzanie Materialu

Slowa, sylaby i zdania moga sie powtarzac, ale powtorki powinny wynikac z
oceny rodzica i historii pracy.

Regula dla MVP:

- `Samodzielnie`: material nie wraca do aktywnej puli powtorek w najblizszych
  sesjach;
- `Z pomocą`: material wraca do puli powtorek;
- `Trudne`: material wraca do puli powtorek z wyzszym priorytetem;
- `Pomiń`: material wraca do puli powtorek, ale bez naliczania punktow za probe.

Oznacza to, ze dziecko nie powinno stale widziec slow, ktore czyta juz pewnie.
Aplikacja ma wracac przede wszystkim do elementow wymagajacych utrwalenia.

Historia powtorek powinna rozrozniac modul zadania. Slowo przeczytane
samodzielnie w module czytania nie musi automatycznie oznaczac, ze dziecko umie
samodzielnie wskazac jego podzial na sylaby. Analogicznie slowo dobrze
podzielone na sylaby nie musi oznaczac plynnego przeczytania calego slowa.

## Material Do Sylabizowania

Modul sylabizowania korzysta przede wszystkim z `words.json`, czyli slow z
recznie sprawdzonym podzialem na sylaby.

Na start najlepiej wybierac:

- slowa dwusylabowe o prostym podziale, np. `ma-ma`, `la-to`, `ko-ło`;
- slowa trzysylabowe o czytelnym rytmie, np. `o-po-na`, `ra-kie-ta`;
- slowa z dwuznakami dopiero po utrwaleniu prostych slow;
- slowa znane dziecku i zgodne z motywem albo codziennym kontekstem.

Unikac na poczatku:

- slow jednosylabowych, np. `tor`, `dom`, `most`;
- trudnych grup spolglosek;
- slow z niejednoznacznym podzialem;
- slow, w ktorych `i` moze byc mylace dla dziecka.

Dane slowa moga zawierac dodatkowe pola pomocne dla sylabizowania:

- `syllableCount`: liczba sylab;
- `syllabificationLevel`: orientacyjna trudnosc podzialu;
- `syllabificationTags`: tagi, np. `proste`, `dwuznak`, `i-zmiekczajace`;
- `allowedSyllableSplits`: dopuszczalne reczne warianty podzialu, jesli sa potrzebne;
- `suitableForSyllabification`: czy slowo nadaje sie do zadan sylabizowania.

W MVP podzial na sylaby pozostaje reczny. Automatyczne dzielenie slow nie jest
czescia MVP.

## Tryby Pomocy W Sylabizowaniu

### Z Pomoca

Material pokazuje pelny podzial slowa, np. `ra-kie-ta`. Celem jest spokojne
powiedzenie slowa sylabami i potem calosciowo.

Podpowiedz moze byc widoczna od razu, np.:

- `Każda część ma samogłoskę.`
- `Powiedz słowo powoli.`

### Z Podpowiedzia

Material pokazuje czesciowa pomoc, np.:

- liczbe sylab;
- puste miejsca na sylaby;
- pierwsze miejsce podzialu;
- krotka sciage pod zadaniem.

Przyklad: `rakieta`, podpowiedz `3 sylaby`.

### Samodzielnie

Dziecko widzi caly wyraz i samo wskazuje miejsca podzialu. Podpowiedz powinna
byc dostepna, ale schowana, aby rodzic mogl jej uzyc dopiero wtedy, gdy jest
potrzebna.

## Poziomy

### Poziom 1 - Proste Sylaby

Opis dla rodzica: latwe sylaby otwarte i bardzo proste slowa dwusylabowe. Dobry poziom na rozgrzewke i budowanie pewnosci.

Sylaby:

- `ma`;
- `ta`;
- `la`;
- `ko`;
- `to`;
- `sa`;
- `po`;
- `mo`;
- `ra`;
- `na`.

Slowa:

- `mama` -> `ma-ma`;
- `tata` -> `ta-ta`;
- `lato` -> `la-to`;
- `kolo` -> `ko-lo`;
- `moto` -> `mo-to`;
- `rano` -> `ra-no`.

### Poziom 2 - Proste Slowa I Zdania

Opis dla rodzica: latwe slowa znane z codziennosci i motywu pojazdow, z pierwszymi krotkimi zdaniami.

Slowa:

- `auto` -> `au-to`;
- `koło` -> `ko-ło`;
- `droga` -> `dro-ga`;
- `rama` -> `ra-ma`;
- `opona` -> `o-po-na`;
- `kask` -> `kask`;
- `tor` -> `tor`;
- `most` -> `most`;
- `dom` -> `dom`;
- `las` -> `las`.

Zdania:

- `Auto jedzie.`
- `Koło jest duże.`
- `Tata ma auto.`
- `To jest tor.`
- `Auto stoi.`
- `Most jest tu.`

### Poziom 3 - Dwuznaki Podstawowe

Opis dla rodzica: utrwalanie czestszych dwuznakow, ktore moga utrudniac plynne czytanie.

Dwuznaki:

- `ch`;
- `sz`;
- `cz`;
- `rz`.

Slowa:

- `chata` -> `cha-ta`;
- `chmura` -> `chmu-ra`;
- `szosa` -> `szo-sa`;
- `szyna` -> `szy-na`;
- `czapka` -> `czap-ka`;
- `cztery` -> `czte-ry`;
- `rzeka` -> `rze-ka`;
- `orzech` -> `o-rzech`.

Zdania:

- `Auto jedzie po szosie.`
- `To jest czapka.`
- `Nad torem jest chmura.`
- `Rzeka jest daleko.`

### Poziom 4 - Trudniejsze Dwuznaki I Trojznaki

Opis dla rodzica: trudniejszy poziom z elementami `dz`, `dź`, `dż`. Uzywac spokojnie i krotko, raczej jako utrwalanie niz dlugi blok.

Elementy:

- `dz`;
- `dź`;
- `dż`.

Slowa:

- `dzwon` -> `dzwon`;
- `dzwonek` -> `dzwo-nek`;
- `dzban` -> `dzban`;
- `dziecko` -> `dziec-ko`;
- `dźwig` -> `dźwig`;
- `dżem` -> `dżem`;
- `dżungla` -> `dżun-gla`.

Zdania:

- `Dźwig stoi.`
- `Dzwonek dzwoni.`
- `To jest dżem.`
- `Dziecko ma kask.`

## Przykladowe Slowa Motoryzacyjne

- `auto` -> `au-to`;
- `motor` -> `mo-tor`;
- `opona` -> `o-po-na`;
- `koło` -> `ko-ło`;
- `droga` -> `dro-ga`;
- `garaż` -> `ga-raż`;
- `tor` -> `tor`;
- `most` -> `most`;
- `kask` -> `kask`;
- `pilot` -> `pi-lot`;
- `rakieta` -> `ra-kie-ta`;
- `pociąg` -> `po-ciąg`.

## Przykladowe Pytania O Sens

- `Auto jedzie.` -> `Co jedzie?`
- `Koło jest duże.` -> `Jakie jest koło?`
- `Motor stoi.` -> `Co stoi?`
- `Tata ma auto.` -> `Co ma tata?`
- `Dźwig stoi.` -> `Co stoi?`
- `Auto jedzie po szosie.` -> `Gdzie jedzie auto?`

## Uwagi Do Implementacji Tresci

- Baza cwiczen powinna byc zapisana jako statyczne pliki JSON w repo.
- JSON powinien byc traktowany jako zrodlo prawdy dla poziomow, sylab, slow, zdan i pytan.
- Kazdy material powinien miec stabilny identyfikator.
- Podzial na sylaby powinien byc reczny, nie generowany automatycznie w MVP.
- Material oceniony jako `Samodzielnie` powinien wypasc z aktywnej puli powtorek.
- Material oceniony jako `Z pomocą`, `Trudne` albo `Pomiń` powinien wracac w kolejnych sesjach.
- Trudne slowa powinny wracac w kolejnych sesjach czesciej.
- Na start mozna miec mala, sprawdzona baze, ale docelowy MVP powinien pokryc okolo miesiac pracy.
