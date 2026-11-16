import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Student } from '../student';

@Component({
  selector: 'app-edit-student',
  imports: [FormsModule],
  templateUrl: './edit-student.html',
  styleUrl: './edit-student.css',
})
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
