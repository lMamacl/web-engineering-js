import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Student } from '../student';

@Component({
  selector: 'app-add-student',
  imports: [FormsModule],
  templateUrl: './add-student.html',
  styleUrl: './add-student.css',
})
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
