# Zadanie 4 – Komponenty, widoki i komunikacja w Angular

Sprawozdanie z realizacji zadań w środowisku Angular / TypeScript.

Kod źródłowy projektu:
- Główny komponent: [src/app/app.ts](src/app/app.ts) | [src/app/app.html](src/app/app.html) | [src/app/app.css](src/app/app.css)
- Model danych: [src/app/student.ts](src/app/student.ts)
- Komponent dodawania: [src/app/add-student/add-student.ts](src/app/add-student/add-student.ts) | [src/app/add-student/add-student.html](src/app/add-student/add-student.html)
- Komponent edycji: [src/app/edit-student/edit-student.ts](src/app/edit-student/edit-student.ts) | [src/app/edit-student/edit-student.html](src/app/edit-student/edit-student.html)

---

## Uruchomienie projektu

W katalogu `Angular`:

```powershell
npm run start:zadanie-4
```

Aplikacja dostępna jest pod adresem: `http://localhost:4200/`.

Kompilacja produkcyjna:

```powershell
npm run build:zadanie-4
```

---

## 1. Selektor komponentu głównego i szablon

Selektor komponentu głównego aplikacji został zmieniony z domyślnego `app-root` na `<students>`, zgodnie z wymaganiami zadania:

```typescript
@Component({
  selector: 'students',
  imports: [AddStudent, EditStudent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly tytul_listy = 'Lista wszystkich studentów';
}
```

_(Źródło: [src/app/app.ts#L6-L13](src/app/app.ts#L6-L13))_

W pliku `src/index.html` aplikacja jest osadzana za pomocą tego znacznika:

```html
<body>
  <students></students>
</body>
```

_(Źródło: [src/index.html#L10-L12](src/index.html#L10-L12))_

W szablonie komponentu wartość pola `tytul_listy` wyświetlana jest za pomocą interpolacji `{{ tytul_listy }}`:

```html
<header class="naglowek-aplikacji">
  <h1>{{ tytul_listy }}</h1>
  <button
    type="button"
    class="przycisk przycisk-glowny"
    (click)="przelaczDodawanie()"
  >
    {{ czyPokazacDodawanie() ? 'Ukryj formularz' : 'Dodaj studenta' }}
  </button>
</header>
```

_(Źródło: [src/app/app.html#L2-L12](src/app/app.html#L2-L12))_

---

## 2. Model danych – klasa `Student`

Klasa modeluje dane studenta z zachowaniem pełnej hermetyzacji (pola prywatne), metod dostępowych (gettery i settery) oraz metod manipulacji ocenami.

### a) Hermetyzacja i operator rozwinięcia (`...` / spread operator) w konstruktorze

Pola `_imie`, `_nazwisko`, `_wiek` i `_oceny` są prywatne, co uniemożliwia bezpośrednią modyfikację stanu z pominięciem reguł walidacji.

W konstruktorze zastosowano operator rozwinięcia `[...oceny]` w celu utworzenia **płytkiej kopii tablicy**:

```typescript
export class Student {
  private _imie: string;
  private _nazwisko: string;
  private _wiek: number;
  private _oceny: number[];

  constructor(
    imie: string,
    nazwisko: string,
    wiek: number,
    oceny: number[] = []
  ) {
    this._imie = imie;
    this._nazwisko = nazwisko;
    this._wiek = wiek;
    this._oceny = [...oceny];
  }
```

_(Źródło: [src/app/student.ts#L1-L17](src/app/student.ts#L1-L17))_

#### Dlaczego użyto `[...oceny]`, a nie `this._oceny = oceny`?
W języku JavaScript tablice są typami referencyjnymi. Gdyby przypisano tablicę bezpośrednio (`this._oceny = oceny`), pole `_oceny` wskazywałoby na ten sam obszar w pamięci co zmienna przekazana do konstruktora (zjawisko *aliasingu*). Wówczas modyfikacja tablicy źródłowej na zewnątrz klasy automatycznie modyfikowałaby stan wewnętrzny obiektu `Student`. Zapis `[...oceny]` tworzy nową, niezależną tablicę w pamięci, co gwarantuje pełną hermetyzację.

---

### b) Gettery i settery z walidacją

Umożliwiają odczyt i zapis właściwości (`student.imie`, `student.wiek`), zabezpieczając dane przed nieprawidłowymi wartościami:

```typescript
  get imie(): string {
    return this._imie;
  }

  set imie(value: string) {
    this._imie = value.trim();
  }

  get nazwisko(): string {
    return this._nazwisko;
  }

  set nazwisko(value: string) {
    this._nazwisko = value.trim();
  }

  get wiek(): number {
    return this._wiek;
  }

  set wiek(value: number) {
    if (value > 0) {
      this._wiek = value;
    }
  }

  get oceny(): number[] {
    return this._oceny;
  }

  set oceny(value: number[]) {
    this._oceny = value;
  }
```

_(Źródło: [src/app/student.ts#L19-L51](src/app/student.ts#L19-L51))_

- `set imie(value)` oraz `set nazwisko(value)` automatycznie usuwają zbędne białe znaki na początku i końcu za pomocą metody `.trim()`.
- `set wiek(value)` uniemożliwia ustawienie niedodatniego wieku (`if (value > 0)`).

---

### c) Metody zarządzania ocenami (`dodajOcene`, `aktualizujOcene`, `usunOcene`)

Klasa posiada zestaw metod enkapsulujących wszelkie operacje na tablicy ocen z walidacją skali ocen (od 2.0 do 5.0) oraz indeksów:

```typescript
  dodajOcene(ocena: number): void {
    if (ocena >= 2.0 && ocena <= 5.0) {
      this._oceny.push(ocena);
    }
  }

  aktualizujOcene(index: number, nowaOcena: number): void {
    if (index >= 0 && index < this._oceny.length && nowaOcena >= 2.0 && nowaOcena <= 5.0) {
      this._oceny[index] = nowaOcena;
    }
  }

  usunOcene(index: number): void {
    if (index >= 0 && index < this._oceny.length) {
      this._oceny.splice(index, 1);
    }
  }
}
```

_(Źródło: [src/app/student.ts#L53-L69](src/app/student.ts#L53-L69))_

---

## 3. Komponent główny `App` i lista studentów

Główny komponent zarządza kolekcją studentów w sygnale `studenci` oraz stanami interfejsu (rozwijanie szczegółów, tryb edycji, widoczność formularza dodawania).

### a) Kolekcja studentów w stanie sygnałowym (`signal`)

```typescript
  readonly studenci = signal<Student[]>([
    new Student('Jan', 'Kowalski', 21, [5.0, 4.0, 2.0]),
    new Student('Anna', 'Nowak', 20, [4.5, 5.0, 3.0]),
    new Student('Piotr', 'Wiśniewski', 23, [2.0, 3.5, 4.0]),
    new Student('Maria', 'Wójcik', 19, [5.0, 4.5]),
    new Student('Tomasz', 'Kamiński', 22, [3.0, 2.0, 4.5]),
  ]);

  readonly czyPokazacDodawanie = signal<boolean>(false);
  readonly rozwinietyStudent = signal<Student | null>(null);
  readonly edytowanyStudent = signal<Student | null>(null);
```

_(Źródło: [src/app/app.ts#L15-L25](src/app/app.ts#L15-L25))_

#### Czym jest `signal()` w Angularze?
Sygnał to reaktywny kontener na wartość. Angular automatycznie śledzi, w których miejscach szablonu wywołano sygnał (np. `studenci()`), i w przypadku zmiany wartości aktualizuje wyłącznie te fragmenty drzewa DOM, które od niego zależą, bez konieczności kosztownego sprawdzania całego drzewa komponentów.

---

### b) Dodawanie studenta i operator rozwinięcia w `update()`

```typescript
  dodajStudenta(nowyStudent: Student): void {
    this.studenci.update((lista) => [...lista, nowyStudent]);
    this.czyPokazacDodawanie.set(false);
  }
```

_(Źródło: [src/app/app.ts#L35-L38](src/app/app.ts#L35-L38))_

#### Dlaczego użyto `update((lista) => [...lista, nowyStudent])`, a nie `this.studenci().push(nowyStudent)`?
W systemie sygnałów Angulara obowiązuje zasada **niemutowalności (*immutability*)**. Metoda `push()` modyfikuje tablicę w miejscu (ta sama referencja w pamięci). Angular porównuje poprzednią i nową wartość sygnału przez referencję (`Object.is`). Gdy referencja się nie zmienia, Angular może pominąć aktualizację widoku. Użycie `[...lista, nowyStudent]` tworzy zupełnie nową tablicę z nową referencją, co gwarantuje natychmiastowe wykrycie zmiany i przerysowanie listy w DOM.

---

### c) Obsługa interakcji i zatrzymanie propagacji zdarzenia (`event.stopPropagation()`)

Wszelka logika decyzyjna została wyniesiona do metod TypeScript (brak logiki w szablonie HTML):

```typescript
  przelaczDodawanie(): void {
    this.czyPokazacDodawanie.update((widoczny) => !widoczny);
  }

  zamknijDodawanie(): void {
    this.czyPokazacDodawanie.set(false);
  }

  przelaczSzczegoly(student: Student): void {
    if (this.rozwinietyStudent() === student) {
      this.rozwinietyStudent.set(null);
    } else {
      this.rozwinietyStudent.set(student);
    }
  }

  czySzczegolyRozwiniete(student: Student): boolean {
    return this.rozwinietyStudent() === student;
  }

  czyOcenaNegatywna(ocena: number): boolean {
    return ocena === 2.0;
  }

  rozpocznijEdycje(student: Student, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.edytowanyStudent.set(student);
  }

  zamknijEdycje(): void {
    this.edytowanyStudent.set(null);
  }

  czyEdytowany(student: Student): boolean {
    return this.edytowanyStudent() === student;
  }
```

_(Źródło: [src/app/app.ts#L27-L69](src/app/app.ts#L27-L69))_

#### Do czego służy `event.stopPropagation()`?
Przycisk *„Edytuj”* znajduje się wewnątrz kontenera studenta (`.student-wiersz`). Kliknięcie wiersza wywołuje metodę `przelaczSzczegoly()`, która rozwija lub zwija widok ocen. Gdy użytkownik klika przycisk *„Edytuj”*, w przeglądarce zachodzi tzw. **bąbelkowanie zdarzenia (*event bubbling*)** – zdarzenie kliknięcia wędruje w górę drzewa DOM do rodzica. Bez `event.stopPropagation()` kliknięcie przycisku edycji wywołałoby równocześnie zwinięcie/rozwinięcie szczegółów studenta. Wywołanie `stopPropagation()` zatrzymuje propagację zdarzenia na poziomie przycisku.

---

### d) Szablon listy studentów i blok `@for` z `track $index`

W szablonie wykorzystano nowoczesny control flow Angulara:

```html
  <section class="lista-studentow">
    @for (student of studenci(); track $index) {
      <article
        class="student-karta"
        [class.aktywny]="czySzczegolyRozwiniete(student)"
        [class.edytowany]="czyEdytowany(student)"
      >
        <div class="student-wiersz">
          <div
            class="student-dane-klik"
            (click)="przelaczSzczegoly(student)"
            role="button"
            tabindex="0"
          >
            <span class="ikona-rozwiniecia">
              {{ czySzczegolyRozwiniete(student) ? '▼' : '▶' }}
            </span>
            <span class="student-nazwisko">
              {{ student.imie }} {{ student.nazwisko }}
            </span>
          </div>

          <button
            type="button"
            class="przycisk przycisk-edycja"
            (click)="rozpocznijEdycje(student, $event)"
          >
            Edytuj
          </button>
        </div>

        @if (czySzczegolyRozwiniete(student)) {
          <div class="student-szczegoly">
            <p><strong>Wiek:</strong> {{ student.wiek }} lat</p>

            <div class="oceny-kontener">
              <strong>Oceny:</strong>
              @if (student.oceny.length === 0) {
                <span class="brak-ocen">Brak ocen</span>
              } @else {
                <div class="oceny-lista">
                  @for (ocena of student.oceny; track $index) {
                    <span
                      class="ocena-odznaka"
                      [class.ocena-negatywna]="czyOcenaNegatywna(ocena)"
                    >
                      {{ ocena }}
                    </span>
                  }
                </div>
              }
            </div>
          </div>
        }
      </article>
    }
  </section>
```

_(Źródło: [src/app/app.html#L28-L84](src/app/app.html#L28-L84))_

#### Dlaczego w pętli `@for` wymagany jest `track`?
Klauzula `track` informuje silnik renderujący Angulara, w jaki sposób unikalnie identyfikować elementy na liście. W przypadku zmiany kolejności, dodania lub usunięcia elementu, Angular nie usuwa całego DOM listy, lecz aktualizuje tylko zmienione wiersze.

#### Dostępność (a11y): `role="button"` i `tabindex="0"`
Element `div.student-dane-klik` reaguje na kliknięcie. Atrybut `tabindex="0"` włącza go do nawigacji klawiaturą (klawisz Tab), a `role="button"` informuje technologie asystujące (czytniki ekranu), że element pełni funkcję przycisku.

Wyróżnienie oceny 2.0 realizowane jest przez powiązanie klasy CSS `[class.ocena-negatywna]="czyOcenaNegatywna(ocena)"`:

```css
.ocena-negatywna {
  color: #dc2626 !important;
  background-color: #fee2e2 !important;
  border: 1px solid #f87171;
  font-weight: bold;
}
```

_(Źródło: [src/app/app.css#L107-L112](src/app/app.css#L107-L112))_

---

## 4. Komponent potomny `AddStudent` (Komunikacja Dziecko ➔ Rodzic)

Komponent formularza gromadzi imię, nazwisko oraz wiek (zgodnie z wymaganiem zadania – bez pola ocen). Przekazuje nowy obiekt klasy `Student` w górę do rodzica za pomocą Signal Output (`output()`).

### a) Klasa komponentu `AddStudent`

```typescript
export class AddStudent {
  readonly imie = signal<string>('');
  readonly nazwisko = signal<string>('');
  readonly wiek = signal<number | null>(null);

  readonly studentDodany = output<Student>();
  readonly anuluj = output<void>();

  zmienImie(wartosc: string): void {
    this.imie.set(wartosc);
  }

  zmienNazwisko(wartosc: string): void {
    this.nazwisko.set(wartosc);
  }

  zmienWiek(wartosc: number | null): void {
    this.wiek.set(wartosc !== null ? Number(wartosc) : null);
  }

  zapiszStudenta(): void {
    const imie = this.imie().trim();
    const nazwisko = this.nazwisko().trim();
    const wiek = this.wiek();

    if (!imie || !nazwisko || wiek === null || wiek <= 0) {
      alert('Proszę wypełnić wszystkie pola poprawnie.');
      return;
    }

    const nowyStudent = new Student(imie, nazwisko, wiek, []);
    this.studentDodany.emit(nowyStudent);
    this.wyczyscFormularz();
  }

  zamknijFormularz(): void {
    this.wyczyscFormularz();
    this.anuluj.emit();
  }

  private wyczyscFormularz(): void {
    this.imie.set('');
    this.nazwisko.set('');
    this.wiek.set(null);
  }
}
```

_(Źródło: [src/app/add-student/add-student.ts#L11-L56](src/app/add-student/add-student.ts#L11-L56))_

#### Czym jest `output<T>()`?
Nowy mechanizm w Angularze zastępujący `@Output() = new EventEmitter<T>()`. Funkcja `output<Student>()` tworzy `OutputEmitterRef`. Wywołanie `this.studentDodany.emit(nowyStudent)` wysyła obiekt bezpośrednio do komponentu nadrzędnego.

---

### b) Szablon formularza i wiązanie pól

```html
<section class="formularz-karta">
  <h3>Dodaj nowego studenta</h3>

  <form (ngSubmit)="zapiszStudenta()">
    <div class="pole-formularza">
      <label for="dodaj-imie">Imię:</label>
      <input
        id="dodaj-imie"
        name="imie"
        type="text"
        [ngModel]="imie()"
        (ngModelChange)="zmienImie($event)"
        placeholder="Wpisz imię"
        required
      />
    </div>

    <div class="pole-formularza">
      <label for="dodaj-nazwisko">Nazwisko:</label>
      <input
        id="dodaj-nazwisko"
        name="nazwisko"
        type="text"
        [ngModel]="nazwisko()"
        (ngModelChange)="zmienNazwisko($event)"
        placeholder="Wpisz nazwisko"
        required
      />
    </div>

    <div class="pole-formularza">
      <label for="dodaj-wiek">Wiek:</label>
      <input
        id="dodaj-wiek"
        name="wiek"
        type="number"
        min="1"
        [ngModel]="wiek()"
        (ngModelChange)="zmienWiek($event)"
        placeholder="Wpisz wiek"
        required
      />
    </div>

    <div class="akcje-formularza">
      <button type="submit" class="przycisk przycisk-sukces">Zapisz studenta</button>
      <button type="button" class="przycisk przycisk-anuluj" (click)="zamknijFormularz()">Anuluj</button>
    </div>
  </form>
</section>
```

_(Źródło: [src/app/add-student/add-student.html#L1-L50](src/app/add-student/add-student.html#L1-L50))_

#### Dlaczego `[ngModel]="imie()"` i `(ngModelChange)="zmienImie($event)"`, a nie `[(ngModel)]="imie"`?
Sygnał `imie` jest obiektem/funkcją reaktywną (`WritableSignal<string>`). Zapis `[(ngModel)]="imie"` próbowałby powiązać pole tekstowe bezpośrednio z referencją funkcji sygnału. Rozbicie wiązania na:
1. `[ngModel]="imie()"` – pobiera aktualną wartość tekstową z sygnału (odczyt),
2. `(ngModelChange)="zmienImie($event)"` – przekazuje wpisany ciąg znaków `$event` do metody komponentu, która aktualizuje sygnał (`this.imie.set(wartosc)`),
gwarantuje pełną zgodność z sygnałami i pozwala zachować czystą strukturę bez inline-logiki w szablonie.

---

### c) Podpięcie komponentu w rodzicu (`App`)

Komponent `AddStudent` jest renderowany warunkowo po kliknięciu przycisku *„Dodaj studenta”*. Rodzic przechwytuje zdarzenie wyjściowe za pomocą wiązania `(studentDodany)`:

```html
  @if (czyPokazacDodawanie()) {
    <app-add-student
      (studentDodany)="dodajStudenta($event)"
      (anuluj)="zamknijDodawanie()"
    ></app-add-student>
  }
```

_(Źródło: [src/app/app.html#L14-L19](src/app/app.html#L14-L19))_

Zmienna `$event` zawiera obiekt `Student` wyemitowany przez dziecko. Metoda rodzica `dodajStudenta($event)` dopisuje go do kolekcji.

---

## 5. Komponent potomny `EditStudent` (Komunikacja Rodzic ➔ Dziecko oraz edycja i dodawanie ocen)

Komponent edycji przyjmuje obiekt studenta od rodzica za pomocą Signal Input (`input.required<Student>()`). Pola formularza są wypełnione aktualnymi wartościami obiektu (odczytanymi przez gettery), a ich modyfikacja wywołuje settery obiektu `Student`. Istniejące oceny studenta można bezpośrednio edytować w polach numerycznych lub usunąć, a także dodać nową ocenę (wymaganie 9).

### a) Klasa komponentu `EditStudent`

```typescript
export class EditStudent {
  readonly student = input.required<Student>();
  readonly zamknij = output<void>();

  readonly nowaOcena = signal<number | null>(null);

  aktualizujImie(noweImie: string): void {
    this.student().imie = noweImie;
  }

  aktualizujNazwisko(noweNazwisko: string): void {
    this.student().nazwisko = noweNazwisko;
  }

  aktualizujWiek(nowyWiek: number | null): void {
    if (nowyWiek !== null) {
      this.student().wiek = Number(nowyWiek);
    }
  }

  zmienIstniejacaOcene(index: number, nowaWartosc: number | null): void {
    if (nowaWartosc !== null && !isNaN(nowaWartosc)) {
      this.student().aktualizujOcene(index, Number(nowaWartosc));
    }
  }

  usunOcene(index: number): void {
    this.student().usunOcene(index);
  }

  zmienNowaOcena(wartosc: number | null): void {
    this.nowaOcena.set(wartosc !== null ? Number(wartosc) : null);
  }

  dodajOcene(): void {
    const ocena = this.nowaOcena();

    if (ocena === null || isNaN(ocena)) {
      alert('Proszę wpisać wartość oceny.');
      return;
    }

    if (ocena < 2.0 || ocena > 5.0) {
      alert('Ocena musi być w przedziale od 2.0 do 5.0.');
      return;
    }

    this.student().dodajOcene(ocena);
    this.nowaOcena.set(null);
  }

  czyOcenaNegatywna(ocena: number): boolean {
    return ocena === 2.0;
  }

  zamknijEdycje(): void {
    this.zamknij.emit();
  }
}
```

_(Źródło: [src/app/edit-student/edit-student.ts#L11-L69](src/app/edit-student/edit-student.ts#L11-L69))_

#### Czym jest `input.required<T>()`?
Zastępuje dekorator `@Input({ required: true })`. Zwraca sygnał wejściowy tylko do odczytu (`Signal<Student>`). Wariant `.required()` wymusza na rodzicu przekazanie wartości na etapie kompilacji TypeScript – brak atrybutu `[student]` w szablonie rodzica spowoduje błąd kompilacji.

#### Jak działa edycja i aktualizacja przez settery w `EditStudent`?
Gdy użytkownik zmienia wartość w polu:
1. Szablon wywołuje metodę: `(ngModelChange)="aktualizujImie($event)"`.
2. Metoda wykonuje: `this.student().imie = noweImie`.
3. Zapis ten wywołuje zdefiniowany w klasie `Student` setter: `set imie(value: string)`, co powoduje walidację (np. obcięcie spacji przez `.trim()`) i zaktualizowanie prywatnego pola `_imie`.
4. W przypadku edycji ocen istniejących wierszy, wywołanie `this.student().aktualizujOcene(index, nowaWartosc)` weryfikuje zakres i podmienia ocenę w tablicy obiektu.

---

### b) Szablon komponentu edycji

Szablon wyświetla edytowalne pola danych osobowych, listę istniejących ocen z możliwością edycji i usunięcia oraz sekcję dodawania nowej oceny:

```html
<section class="formularz-karta edycja-karta">
  <h3>Edycja studenta: {{ student().imie }} {{ student().nazwisko }}</h3>

  <form>
    <div class="pole-formularza">
      <label for="edit-imie">Imię:</label>
      <input
        id="edit-imie"
        name="edit-imie"
        type="text"
        [ngModel]="student().imie"
        (ngModelChange)="aktualizujImie($event)"
      />
    </div>

    <div class="pole-formularza">
      <label for="edit-nazwisko">Nazwisko:</label>
      <input
        id="edit-nazwisko"
        name="edit-nazwisko"
        type="text"
        [ngModel]="student().nazwisko"
        (ngModelChange)="aktualizujNazwisko($event)"
      />
    </div>

    <div class="pole-formularza">
      <label for="edit-wiek">Wiek:</label>
      <input
        id="edit-wiek"
        name="edit-wiek"
        type="number"
        min="1"
        [ngModel]="student().wiek"
        (ngModelChange)="aktualizujWiek($event)"
      />
    </div>
  </form>

  <section class="sekcja-ocen">
    <h4>Oceny studenta</h4>

    <div class="lista-ocen">
      @if (student().oceny.length === 0) {
        <span class="brak-ocen">Brak przypisanych ocen.</span>
      } @else {
        @for (ocena of student().oceny; track $index) {
          <div class="ocena-wiersz">
            <input
              type="number"
              step="0.5"
              min="2.0"
              max="5.0"
              [ngModel]="ocena"
              (ngModelChange)="zmienIstniejacaOcene($index, $event)"
              class="ocena-pole-edycji"
              [class.ocena-negatywna]="czyOcenaNegatywna(ocena)"
              aria-label="Edytuj ocenę"
            />
            <button
              type="button"
              class="przycisk-usun-ocene"
              (click)="usunOcene($index)"
              title="Usuń tę ocenę"
            >
              ✕
            </button>
          </div>
        }
      }
    </div>

    <div class="dodawanie-oceny">
      <label for="nowa-ocena">Nowa ocena:</label>
      <input
        id="nowa-ocena"
        type="number"
        step="0.5"
        min="2.0"
        max="5.0"
        [ngModel]="nowaOcena()"
        (ngModelChange)="zmienNowaOcena($event)"
        placeholder="2.0 - 5.0"
      />
      <button type="button" class="przycisk przycisk-ocena" (click)="dodajOcene()">
        Dodaj ocenę
      </button>
    </div>
  </section>

  <div class="akcje-formularza">
    <button type="button" class="przycisk przycisk-zamknij" (click)="zamknijEdycje()">
      Zakończ edycję
    </button>
  </div>
</section>
```

_(Źródło: [src/app/edit-student/edit-student.html#L1-L96](src/app/edit-student/edit-student.html#L1-L96))_

---

### c) Podpięcie komponentu w rodzicu i składnia `as alias`

W szablonie `app.html` komponent edycji renderowany jest po wybraniu studenta przyciskiem *„Edytuj”*:

```html
  @if (edytowanyStudent(); as wybrany) {
    <app-edit-student
      [student]="wybrany"
      (zamknij)="zamknijEdycje()"
    ></app-edit-student>
  }
```

_(Źródło: [src/app/app.html#L21-L26](src/app/app.html#L21-L26))_

#### Co oznacza konstrukcja `@if (edytowanyStudent(); as wybrany)`?
Sygnał `edytowanyStudent` przechowuje typ `Student | null`. Składnia `as wybrany` dokonuje tzw. **zawężenia typu (*type narrowing*)** wewnątrz bloku `@if`. Tworzy zmienną lokalną szablonu `wybrany`, która ma gwarantowany typ `Student` (wyklucza `null`). Pozwala to bezpiecznie przekazać `[student]="wybrany"` do komponentu `EditStudent` bez ryzyka przekazania wartości pustej i bez konieczności wielokrotnego odczytywania sygnału `edytowanyStudent()`.
