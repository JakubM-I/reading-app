# Plan Tresci

## Zasady Doboru Materialu

Material ma byc po polsku, prosty i zwiazany z codziennymi albo motoryzacyjnymi tematami. Pierwsza wersja skupia sie na prawdziwych slowach, a nie pseudowyrazach.

Zasady:

- zaczynac od latwych sylab i znanych slow;
- nie pokazywac obrazka przed proba przeczytania, jesli obrazek moglby zdradzic odpowiedz;
- trudniejsze dwuznaki wprowadzac pozniej;
- kazdy poziom musi miec opis dla rodzica;
- slowa powinny miec recznie sprawdzony podzial na sylaby.

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
- Trudne slowa powinny wracac w kolejnych sesjach czesciej.
- Na start nie dodawac zbyt wielu slow; lepsza jest mala, sprawdzona baza.
