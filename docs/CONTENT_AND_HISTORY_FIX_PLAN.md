# Plan Poprawek Historii I Bazy Tresci

## Cel Dokumentu

Ten dokument opisuje dwa osobne etapy prac po dodaniu wejscia sylabowego do
modulu `Sylabizowanie`.

Kolejnosc jest celowa:

1. Najpierw naprawiamy historie materialu i rotacje powtorek.
2. Dopiero potem rozbudowujemy baze sylab, slow i zdan.

Dzieki temu nowe tresci beda od razu korzystaly z poprawnego mechanizmu
powtorek, a nie maskowaly problemu z historia.

## Kontekst

Obecna baza wystarcza na MVP i pierwsze regularne uzywanie aplikacji, ale nie
jest jeszcze rowno rozlozona wzgledem docelowych ambicji z `CONTENT_PLAN.md`.

Aktualny stan bazy:

- 118 sylab, znakow i elementow do rozgrzewki;
- 111 realnych sylab do czytania w nowych zadaniach `syllable-read`;
- 142 slow;
- 125 slow oznaczonych jako przydatne do sylabizowania;
- 106 zdan.

Po etapie 2 poziom 4 nie jest juz najcienszym miejscem bazy: ma 30 slow do
sylabizowania i 25 zdan. Poziom 3 ma 40 slow do sylabizowania i 31 zdan.

Drugi problem jest techniczny: dokumentacja zaklada, ze historia materialu
rozroznia modul zadania, ale obecny zapis postepow uzywa przede wszystkim samego
`materialId`. Generator sylabizowania szuka natomiast kluczy w formacie
`syllabification:<id>`. To moze ograniczac jakosc rotacji i powtorek.

## Etap 1 - Naprawa Historii Materialu

Status: zrealizowany.

Cel: sprawic, aby zapis i odczyt historii materialu konsekwentnie rozroznialy
modul zadania.

Zakres:

- dodac `module` do rekordow zapisanej sesji i zapisanych zadan, zgodnie z
  opisem w `PROGRESS_AND_REWARDS.md`;
- zapisywac status materialu pod kluczem zawierajacym modul, np.
  `reading:<materialId>` i `syllabification:<materialId>`;
- dostosowac generator czytania do odczytu historii z kluczy `reading:<id>`;
- zostawic generator sylabizowania przy odczycie `syllabification:<id>`;
- zachowac kompatybilnosc ze starymi postepami:
  - stare sesje bez `module` traktowac jako `reading`;
  - stare zadania bez `module` traktowac jako `reading`;
  - stare wpisy `materialProgress` bez prefiksu modulu traktowac jako
    `reading:<id>`;
- nie zmieniac nazw ocen, punktacji ani formatu eksportu bardziej niz to
  konieczne do dodania pola `module`.

Rezultat:

- czytanie i sylabizowanie moga miec osobna historie dla tego samego slowa;
- dobre wykonanie zadania w jednym module nie ukrywa powtorki w drugim module;
- rotacja materialu dziala przewidywalnie po kilku zakonczonych sesjach;
- stare kopie postepow nadal mozna zaimportowac.

Testy i scenariusze:

- `npm run validate:content`;
- `npm run build`;
- przejsc jedna sesje `Czytanie` i sprawdzic, ze historia materialu zapisuje
  wpisy `reading:<id>`;
- przejsc jedna sesje `Sylabizowanie` i sprawdzic, ze historia materialu zapisuje
  wpisy `syllabification:<id>`;
- wykonac to samo slowo w obu modulach i potwierdzic, ze powstaja dwa osobne
  rekordy materialu;
- zaimportowac stary plik postepow bez `module` i potwierdzic, ze aplikacja
  nadal dziala.

## Etap 2 - Rozbudowa Bazy Tresci

Status: zrealizowany.

Cel: zwiekszyc baze materialu tak, aby sesje mialy wiecej roznorodnosci,
szczegolnie na poziomach 3 i 4.

Zakres:

- rozbudowac `words.json`, przede wszystkim dla poziomow 3 i 4;
- w razie potrzeby dodac brakujace sylaby do `syllables.json`, ale tylko gdy
  wynikaja z nowych slow albo potrzeb rozgrzewki;
- rozbudowac `sentences.json` dla poziomow, ktore maja mniej zdan niz docelowy
  zakres;
- utrzymac reczny podzial slow na sylaby;
- nie dodawac pseudowyrazow;
- nie dodawac marek, postaci ani chronionych nazw;
- nie dodawac automatycznego generowania tresci w runtime.

Priorytet rozbudowy:

1. Poziom 4: zwiekszyc liczbe slow do sylabizowania z 12 do co najmniej 30.
2. Poziom 3: zwiekszyc liczbe slow do sylabizowania z 23 do co najmniej 40.
3. Poziom 2: dopelnic prostymi slowami i zdaniami, jesli po testach nadal bedzie
   za malo roznorodnosci.
4. Poziom 1: dopisywac ostroznie, tylko latwe i bardzo pewne slowa.

Zasady jakosci:

- nowe slowa maja byc znane dziecku albo latwe do wyjasnienia przez rodzica;
- w module sylabizowania preferowac slowa dwu- i trzysylabowe;
- unikac slow z niejednoznacznym podzialem;
- przy trudniejszych dwuznakach nie kumulowac wielu trudnosci w jednym slowie,
  jesli nie jest to potrzebne;
- kazde nowe slowo musi przejsc walidacje i reczny przeglad podzialu.

Rezultat:

- poziomy 3 i 4 maja wystarczajaco materialu na dluzsza prace;
- dziecko rzadziej widzi te same slowa tylko dlatego, ze baza jest mala;
- fallback do wczesniejszych poziomow pozostaje pomocny, ale nie jest jedynym
  sposobem utrzymania roznorodnosci.

Testy i scenariusze:

- `npm run validate:content`;
- `npm run build`;
- sprawdzic liczby materialu po poziomach;
- recznie przejrzec nowe slowa z podzialem sylabowym;
- przejsc sesje `Sylabizowanie` na poziomach 3 i 4;
- przejsc sesje `Czytanie` na poziomach, w ktorych dodano zdania.

## Kryteria Zakonczenia Calosci

- historia materialu rozroznia `reading` i `syllabification`;
- stare postepy pozostaja czytelne po imporcie;
- poziom 4 nie jest juz najwiekszym waskim gardlem bazy;
- walidacja tresci i build przechodza czysto;
- zmiana nie wprowadza backendu, logowania, synchronizacji ani generowania
  tresci poza repo.
