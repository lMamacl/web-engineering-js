import { Component, signal } from '@angular/core';
import { Student } from './student';
import { AddStudent } from './add-student/add-student';
import { EditStudent } from './edit-student/edit-student';

@Component({
  selector: 'students',
  imports: [AddStudent, EditStudent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly tytul_listy = 'Lista wszystkich studentów';

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

  przelaczDodawanie(): void {
    this.czyPokazacDodawanie.update((widoczny) => !widoczny);
  }

  zamknijDodawanie(): void {
    this.czyPokazacDodawanie.set(false);
  }

  dodajStudenta(nowyStudent: Student): void {
    this.studenci.update((lista) => [...lista, nowyStudent]);
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
}
