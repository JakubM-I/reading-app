# Przeplyw UX

## Zasady Interfejsu

Interfejs ma byc spokojny, przewidywalny i czytelny. Glownym urzadzeniem jest MacBook, ale elementy powinny byc wystarczajaco duze, aby dziecko moglo klikac lub przeciagac sylaby bez frustracji.

Podstawowe zasady:

- jedno glowne zadanie na ekranie;
- widoczny postep sesji;
- jasny przycisk resetu biezacej sesji;
- panel rodzica oddzielony od obszaru dziecka;
- wybor modulu po starcie sesji: `Sylabizowanie` albo `Czytanie`;
- brak sesji mieszanych w MVP;
- brak rozpraszajacych animacji;
- teksty krotkie i konkretne.

## Ekrany MVP

### Start

Zawiera:

- przycisk rozpoczecia sesji;
- podglad punktow lacznych;
- wejscie do panelu postepow;
- eksport/import postepow;
- wejscie do resetu danych.

### Wybor Modulu

Po kliknieciu rozpoczecia sesji rodzic wybiera, co dziecko cwiczy:

- `Sylabizowanie`;
- `Czytanie`.

Nie ma trybu mieszanego w MVP. Tego samego dnia mozna wykonac dwie osobne
sesje, np. najpierw sylabizowanie, a potem czytanie. Podsumowania i punkty sa
liczone wspolnie.

### Wybor Poziomu Lub Struktury

W module `Czytanie` rodzic wybiera poziom recznie. Przy kazdym poziomie
aplikacja pokazuje krotki opis.

Przyklad:

- `Poziom 1 - proste sylaby`: sylaby otwarte i latwe slowa dwusylabowe.
- `Poziom 2 - proste zdania`: latwe slowa w krotkich zdaniach.
- `Poziom 3 - dwuznaki`: utrwalanie `ch`, `sz`, `cz`, `rz`.
- `Poziom 4 - trudniejsze dwuznaki`: `dz`, `dź`, `dż`.

W module `Sylabizowanie` poziomy sa zastapione szescioma kartami struktur:
`CV-CV`, co najmniej trzy sylaby `CV`, `CVC`, `CV-CVC`, `CVC-CV` i
`CVC-CVC`. Po wyborze struktury rodzic ustawia tryb pomocy:

- `Z pomocą`;
- `Z podpowiedzią`;
- `Samodzielnie`.

Na tym samym ekranie moze wylaczyc dwa pseudowyrazy. Ustawienie jest domyslnie
wlaczone, a sesja rozpoczyna sie dopiero po uzyciu przycisku `Rozpocznij sesję`.

### Sesja

Kazda sesja ma staly schemat w ramach wybranego modulu.

Sesja sylabizowania:

1. Trzy zadania laczenia elementow.
2. Trzy prawdziwe slowa wybranej struktury.
3. Dwa jawnie oznaczone pseudowyrazy albo dwa prawdziwe slowa.
4. Ulozenie slowa z sylab lub grafemow.
5. Ponowne czytanie z pokazana budowa.
6. Podsumowanie.

Sesja czytania:

1. Rozgrzewka.
2. Czytanie prowadzone.
3. Budowanie slow.
4. Krotkie zdanie i pytanie.
5. Podsumowanie.

Na ekranie sesji widoczne sa:

- numer zadania, np. `4 / 10`;
- wybrany modul;
- aktualny typ zadania;
- obszar cwiczenia;
- sekcja oceny rodzica;
- reset biezacej sesji.

### Sylabizowanie

Modul sylabizowania uczy laczenia grafemow w sylaby i czytania slow o stalej
budowie. Nie zastepuje modulu czytania i nie miesza sie z nim w jednej sesji.

Tryby:

- `Z pomocą`: oznaczenia budowy sa widoczne od razu;
- `Z podpowiedzią`: oznaczenia pojawiaja sie po `Pokaż budowę`;
- `Samodzielnie`: oznaczenia pojawiaja sie po `Pokaż odpowiedź`.

Samogloski sa czerwone, spolgłoski ciemne, a granice sylab maja dodatkowo
odstep, lacznik i zielony akcent. Kolor nie jest jedynym nosnikiem informacji.
Pseudowyraz zawsze ma etykiete `Wymyślone słowo — nie musi nic znaczyć`.

Nie dodajemy zadania z wyborem poprawnego wariantu z kilku odpowiedzi, bo moze
prowadzic do zgadywania.

#### Podpowiedz Do Sylabizowania

Podpowiedz ma byc krotka i spokojna. Moze miec forme malej sciagi dla rodzica i
dziecka.

Przyklady:

- `Znajdź samogłoski.`
- `Zwykle jedna sylaba ma jedną samogłoskę.`
- `Powiedz słowo powoli.`
- `Dwuznak trzyma się razem.`
- `Nie każde i robi osobną sylabę.`

W trybie `Z pomocą` podpowiedz moze byc widoczna. W trybie `Z podpowiedzią`
moze byc pokazana pod zadaniem. W trybie `Samodzielnie` powinna byc schowana
pod przyciskiem `Podpowiedź`.

### Rozgrzewka

Krotkie zadania na rozpoznanie liter, dwuznakow albo sylab.

Przyklady:

- pokazany znak `sz`, dziecko czyta;
- wybierz taki sam znak;
- przeczytaj sylabe `ma`;
- odroznij `dz` od `dź`.

### Czytanie Prowadzone

Etapy na ekranie:

1. Sylaby.
2. Caly wyraz.
3. Zdanie.
4. Ocena rodzica.

Aplikacja moze przechodzic etapami po kliknieciu rodzica lub dziecka. Nie powinna wymuszac automatycznego tempa.

### Budowanie Slowa

Elementy:

- wyraz docelowy albo instrukcja;
- kafelki z sylabami;
- miejsce do ulozenia slowa;
- przycisk sprawdzenia lub przejscia dalej;
- ocena rodzica.

W MVP kafelki sa ukladane kliknieciem: dziecko klika sylabe, a aplikacja przenosi ja do pola odpowiedzi. Przeciaganie mozna dodac pozniej jako usprawnienie, ale nie jest wymagane w pierwszej wersji.

### Ocena Przez Rodzica

Po zadaniu widoczny jest naglowek:

`Oceń wykonanie zadania`

Przyciski:

- `Samodzielnie`;
- `Z pomocą`;
- `Trudne`;
- `Pomiń`.

Po wyborze aplikacja przechodzi do kolejnego zadania.
Wszystkie cztery oceny sa dostepne przez caly czas. Interaktywny przycisk
`Sprawdź` pomaga w zadaniu, ale nie blokuje oceny rodzica.

### Podsumowanie Sesji

Pokazuje:

- zdobyte punkty;
- liczbe zadan;
- liczbe ocen `Samodzielnie`, `Z pomocą`, `Trudne`, `Pomiń`;
- trudne slowa z sesji;
- nowa odznake, jesli zostala zdobyta;
- przycisk powrotu do startu.

Sesje, ktore nie zostaly wykonane w calosci samodzielnie, rodzic moze pozniej
powtorzyc z dziennika. Powtorka ma identyczne zadania i jest kolejnym podejsciem
do tej samej sesji, a nie nowa sesja.

## Panel Postepow

Panel postepow pokazuje:

- punkty laczne;
- punkty dzisiaj;
- podsumowanie dnia;
- podsumowanie tygodnia;
- podsumowanie miesiaca;
- liczbe sesji;
- ostatnie trudne slowa;
- odznaki;
- podsumowanie `Czytania` i `Sylabizowania`: sesje, zadania, rozklad ocen i
  ostatnia praca;
- neutralne zestawienie szesciu struktur jako czesc podsumowania
  `Sylabizowania`;
- dziennik wszystkich sesji z rozwijanym podgladem podejsc i ocen kazdego
  cwiczenia;
- przycisk powtorki tylko dla zapisanej, niepelnej sesji z zachowanym zestawem
  zadan;
- przyciski `Eksportuj postępy` i `Importuj postępy`.

Podsumowania maja byc proste. Na MVP nie trzeba zaawansowanych wykresow.

Lista struktur i lista poziomow pokazuja tylko nazwe zakresu oraz przycisk
`Zobacz szczegóły`. Szczegoly sa osobnym widokiem z podsumowaniem i historia
sesji tylko dla wybranego zakresu. Dziennik ogolny jest domyslnie zwinięty.
Wpis sylabizowania pokazuje takze wybrany tryb pomocy oraz staly numer sesji
w danej strukturze; wpis czytania pokazuje numer sesji w danym poziomie.

## Reset

Dwa poziomy resetu:

- `Resetuj bieżącą sesję`: wraca do poczatku sesji i nie zapisuje jej wyniku.
- `Wyczyść wszystkie postępy`: usuwa lokalne punkty, historie i odznaki po wyraznym potwierdzeniu.

Pelny reset musi wymagac dodatkowego potwierdzenia.
Reset postepow nie usuwa bazy cwiczen, bo baza jest czescia aplikacji i jest zapisana w plikach JSON w repo.
