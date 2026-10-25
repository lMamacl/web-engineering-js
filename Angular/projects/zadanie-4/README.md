# Zadanie 4 - komponenty i widoki

## Stan początkowy

Projekt został wygenerowany przez Angular CLI jako osobna aplikacja `zadanie-4`.
Na tym etapie nie zawiera rozwiązania zadania — jest to punkt startowy do
samodzielnej realizacji wymagań.

Uruchomienie z katalogu `Angular`:

```powershell
npm run start:zadanie-4
```

Następnie otwórz `http://localhost:4200/`. Sprawdzenie kompilacji:

```powershell
npm run build:zadanie-4
```

## Jak podejść do wymagań

1. **Start projektu** — najpierw uruchom aplikację i sprawdź, że widzisz
   domyślny widok. Dzięki temu późniejsze błędy będzie łatwiej przypisać do
   konkretnej zmiany.
2. **Komponent główny** — w `src/app/app.ts` zmień `selector` komponentu na
   `students`. W `src/index.html` element uruchamiający aplikację musi używać
   tego samego selektora. W tym samym komponencie dodaj pole
   `tytul_listy = 'Lista wszystkich studentów'` i interpolacją `{{ ... }}`
   wyświetl je w `app.html`.
3. **Model `Student`** — utwórz osobny plik modelu, np.
   `src/app/student.ts`. Klasa powinna przechowywać prywatne pola o typach:
   `string`, `string`, `number` oraz `number[]`. Konstruktor powinien przyjmować
   dane studenta, a gettery i settery kontrolować dostęp do pól. Ustal, czy
   walidujesz wiek i oceny; jeżeli tak, rób to konsekwentnie w setterach.
4. **Kolekcja** — w komponencie przechowuj pole typu `Student[]` i utwórz
   dokładnie pięć obiektów. Do wyświetlania użyj bloku `@for` (albo
   `*ngFor`, jeśli prowadzący wymaga starszej składni). Klucz elementu powinien
   być stabilny, np. indeks lub dane studenta.
5. **Widok listy i zdarzenia** — pokaż imię, nazwisko oraz oceny. Użyj
   wiązania klas lub stylu, aby pojedyncza ocena `2.0` była czerwona. Wiek i
   oceny mają pojawić się dopiero po kliknięciu danego studenta/elementu:
   trzymaj stan rozwinięcia w komponencie i obsłuż `(click)`.
6. **`AddStudent`** — wygeneruj komponent poleceniem
   `ng generate component add-student --project zadanie-4`. Formularz powinien
   zbierać imię, nazwisko i wiek, bez ocen. Komponent rodzic powinien go
   pokazywać po kliknięciu przycisku `Dodaj studenta`. Do komunikacji użyj
   `@Output()` z eventem zawierającym nowego `Student`; rodzic dopisuje go do
   swojej tablicy. Przy wielu polach rozważ `FormsModule` i `[(ngModel)]`.
7. **`EditStudent`** — wygeneruj komponent
   `edit-student`. Rodzic powinien przekazać wybranego studenta przez
   `@Input()`. Pola formularza należy zainicjalizować aktualnymi wartościami,
   a zapis zmian odesłać do rodzica przez `@Output()`. Nie twórz kopii
   przypadkowo bez późniejszego przekazania zmian do kolekcji.
8. **Dodawanie oceny** — w `EditStudent` dodaj pole liczbowo przechowujące
   nową ocenę i przycisk `Dodaj ocenę`. Po kliknięciu sprawdź, że wartość jest
   poprawna, dopisz ją do tablicy ocen i wyślij zaktualizowany obiekt lub event
   z nową oceną do komponentu rodzica. Zdecyduj, czy ocena ma być w zakresie
   `2.0–5.0`, i stosuj tę regułę także przy edycji.

## Kolejność pracy

Najpierw wykonaj punkty 2–5 i uruchom aplikację, potem dodaj interakcje z
punktu 6. Na końcu wygeneruj oba komponenty formularzy, dodaj ich importy do
komponentu standalone i dopiero wtedy podłącz `@Input()`/`@Output()`.
Po każdym etapie uruchamiaj:

```powershell
npm run build:zadanie-4
```

Ważne: komponenty standalone muszą być dodane do tablicy `imports` komponentu,
który używa ich selektorów. Jeśli Angular zgłasza, że element nie jest znany,
najczęściej brakuje właśnie tego importu albo selektor w szablonie nie zgadza
się z deklaracją komponentu.
