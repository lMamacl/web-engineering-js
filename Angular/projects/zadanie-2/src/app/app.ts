import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('zadanie-2');
}

// ============================================================================
// ZADANIE 1: Sprawdzenie wsparcia dla typowania statycznego w TypeScript
// ============================================================================

console.log('--- ZADANIE 1: Typowanie statyczne w TypeScript ---');

// Przypadek 1a: Jawne typowanie statyczne z poprawną inicjalizacją
{
  const liczba: number = 123;
  console.log('1a:', liczba, typeof liczba);
}

// Przypadek 1b: Deklaracja stałej const bez inicjalizacji
// Kod jest zakomentowany, ponieważ powoduje błąd kompilacji TypeScript:
// "TS1155: 'const' declarations must be initialized."
/*
{
  const liczba: number;
  console.log('1b:', liczba, typeof liczba);
}
*/
console.log('1b: Błąd kompilacji TypeScript (TS1155: stała const musi posiadać wartość początkową)');

// Przypadek 1c: Brak jawnego typu - wnioskowanie typów (Type Inference)
{
  const liczba = 123;
  console.log('1c:', liczba, typeof liczba);
}

// ============================================================================
// ZADANIE 2: Funkcje
// ============================================================================

console.log('\n--- ZADANIE 2: Funkcje ---');

/**
 * 2a) Funkcja zliczająca ile samogłosek ma podany ciąg znaków.
 */
function zliczSamogloski(tekst: string): number {
  const samogloski = 'aąeęioóuy';
  let licznik = 0;
  for (const znak of tekst.toLowerCase()) {
    if (samogloski.includes(znak)) {
      licznik++;
    }
  }

  return licznik;
}

/**
 * 2b) Funkcja wypisująca tablicę liczb w formacie: "tab[0]=3, tab[1]=4, ..."
 */
function wypiszTablice(tab: number[]): void {
  const sformatowanyTekst = tab.map((wartosc, index) => `tab[${index}]=${wartosc}`).join(', ');

  console.log(sformatowanyTekst);
}

// Testy funkcji z zadania 2:
console.log("2a) Liczba samogłosek w 'Programowanie w TypeScript':", zliczSamogloski('Programowanie w TypeScript'));
console.log("2a) Liczba samogłosek w 'Ala ma kota':", zliczSamogloski('Ala ma kota'));

console.log('2b) Sformatowana tablica:');
wypiszTablice([3, 4, 7, 12, 19]);

// ============================================================================
// ZADANIE 3: Klasa Ksiazka (hermetyzacja, gettery, settery, metody)
// ============================================================================

console.log('\n--- ZADANIE 3: Klasa Ksiazka ---');

class Ksiazka {
  // a) Hermetyzacja: prywatne pola
  private _autor: string = '';
  private _tytul: string = '';
  private _cena: number = 0;
  private _historiaCen: { data: Date; cena: number }[] = []; //Tablica przechowująca historię zmian cen książki

  // b) Konstruktor: używa setterów, by od razu zwalidować dane i utworzyć pierwszy wpis w historii
  constructor(autor: string, tytul: string, cena: number) {
    this.autor = autor;
    this.tytul = tytul;
    this.cena = cena;
  }

  // c) Gettery i Settery

  // Getter i Setter dla autora
  get autor(): string {
    return this._autor;
  }
  set autor(nowyAutor: string) {
    if (nowyAutor.trim().length === 0) {
      console.error('Błąd: Autor nie może być pustym tekstem!');
      return;
    }
    this._autor = nowyAutor;
  }

  // Getter i Setter dla tytułu
  get tytul(): string {
    return this._tytul;
  }
  set tytul(nowyTytul: string) {
    if (nowyTytul.trim().length === 0) {
      console.error('Błąd: Tytuł nie może być pustym tekstem!');
      return;
    }
    this._tytul = nowyTytul;
  }

  // Getter i Setter dla ceny
  get cena(): number {
    return this._cena;
  }
  set cena(nowaCena: number) {
    if (nowaCena <= 0) {
      console.error('Błąd: Cena musi być większa od 0!');
      return;
    }
    this._cena = Math.round(nowaCena * 100) / 100;
    this._historiaCen.push({
      data: new Date(),
      cena: this._cena,
    });
  }

  // Getter dla historii cen (właściwość read-only - brak settera chroni historię przed nadpisaniem)
  get historiaCen(): { data: Date; cena: number }[] {
    return [...this._historiaCen];
  }

  // d) Metody:

  zmienCene(oIleProcent: number): void {
    const staraCena = this.cena;
    const nowaCena = this.cena * (1 + oIleProcent / 100);

    // Setter odpowiada za walidację, zaokrąglenie i dopisanie do historii
    this.cena = nowaCena;

    if (this.cena !== staraCena) {
      console.log(
        `Zmieniono cenę książki "${this._tytul}" (${oIleProcent > 0 ? '+' : ''}${oIleProcent}%): z ${staraCena} zł na ${this.cena} zł`
      );
    }
  }
}

const ksiazka1 = new Ksiazka('Stanisław Lem', 'Solaris', 39.99);

console.log(`Książka: "${ksiazka1.tytul}", autor: ${ksiazka1.autor}, cena: ${ksiazka1.cena} zł`);

ksiazka1.cena = 45.00;
console.log(`Cena po bezpośredniej zmianie przez setter: ${ksiazka1.cena} zł`);

ksiazka1.zmienCene(20);

ksiazka1.zmienCene(-15);

console.log('Historia zmian cen książki (odczyt przez getter ksiazka1.historiaCen):');
console.log(ksiazka1.historiaCen);