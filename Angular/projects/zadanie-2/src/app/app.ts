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

{
    const liczba: number=123;
    console.log('1a', liczba, typeof liczba);
}

// TO źle wyipszę ponieważ TS nie pozwala na przypisanie wartości do zmiennej, która nie została zainicjalizowana
// {const liczba:number;
//    console.log('1b', liczba, typeof liczba);
//}

{
    const liczba=123;
    console.log('1c', liczba, typeof liczba);
}
// z 2a
function ZliczSamogłoski(tekst: string): number {
    return (tekst.match(/[aeiouy]/gi) || []).length;
}
// z 2b
function wypiszTablice(tab:number[]): void {
  console.log(tab.map((wartość, index) => `Element ${index}: ${wartość+3}`).join(', '));
}

console.log('2a:', ZliczSamogłoski('Ala ma kota'));
wypiszTablice([1, 2, 3, 4, 5]);

//z3
// 
class WpisCeny {
  constructor(public readonly data: Date, public readonly cena: number) {}
}


class Ksiazka {
  private autor: string;
  private tytuł: string;
  private cena: number;
  private historiaCenArray: WpisCeny[] = [];

  constructor(autor: string, tytuł: string, cena: number) {
    this.autor = autor;
    this.tytuł = tytuł;
    this.cena = cena;
    this.historiaCenArray.push(new WpisCeny(new Date(), cena));
  }

  get Autor(): string {
    return this.autor;
  }
  set Autor(value: string) {
    this.autor = value;
  }

  get Tytul(): string {
    return this.tytuł;
  }
  set Tytul(value: string) {
    this.tytuł = value;
  }

  get Cena(): number {
    return this.cena;
  }
  set Cena(value: number) {
    if (value < 0) {
      console.error('Cena nie może być ujemna');
      return;
    }
    this.cena = value;
  }

  get HistoriaCen(): WpisCeny[] {
    return this.historiaCenArray;
  }
  set HistoriaCen(value: WpisCeny[]) {
    this.historiaCenArray = value;
  }

  zmienCenę(procent: number): void {
    let CenaTemp=this.cena;
    this.cena = Math.round(this.cena * (1 + procent / 100) * 100) / 100;
    this.historiaCenArray.push(new WpisCeny(new Date(), this.cena));
    console.log(`Cena książki "${this.tytuł}" zmieniona z ${CenaTemp} na ${this.cena}`);
  }
}

let ksiazka = new Ksiazka('Autor', 'Tytuł', 29.99);

//zmiana ceny 
ksiazka.zmienCenę(20);
ksiazka.zmienCenę(-10);
console.log('3 historia cen:', ksiazka.HistoriaCen);