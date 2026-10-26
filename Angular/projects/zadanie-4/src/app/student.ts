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
    this._oceny = oceny;
  }

  get imie(): string {
    return this._imie;
  }

  set imie(value: string) {
    this._imie = value;
  }

  get nazwisko(): string {
    return this._nazwisko;
  }

  set nazwisko(value: string) {
    this._nazwisko = value;
  }

  get wiek(): number {
    return this._wiek;
  }

  set wiek(value: number) {
    this._wiek = value;
  }

  get oceny(): number[] {
    return this._oceny;
  }

  set oceny(value: number[]) {
    this._oceny = value;
  }

}
