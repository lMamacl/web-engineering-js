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

  dodajOcene(ocena: number): void {
    if (ocena >= 2.0 && ocena <= 5.0) {
      this._oceny.push(ocena);
    }
  }
}
