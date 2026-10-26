import { Component, signal} from '@angular/core';
import { Student } from './student';
import { AddStudent } from './add-student/add-student';

@Component({
  imports: [AddStudent],
  selector: 'students',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('zadanie-4');

  tytul_listy = 'Lista wszystkich studentów';

  studenci: Student[] = [
    new Student('Jan', 'Kowalski', 21, [5.0, 4.0, 2.0]),
    new Student('Anna', 'Nowak', 20, [4.5, 5.0, 3.0]),
    new Student('Piotr', 'Wiśniewski', 23, [2.0, 3.5, 4.0]),
    new Student('Maria', 'Wójcik', 19, [5.0, 4.5]),
    new Student('Tomasz', 'Kamiński', 22, [3.0, 2.0, 4.5]),
  ];

  rozwinietyStudent: Student | null = null;

  dodajStudenta(student: Student): void {
    this.studenci.push(student);
  }

  pokazSzczegoly(student: Student): void {
    if (this.rozwinietyStudent === student) {
      this.rozwinietyStudent = null;
    } else {
      this.rozwinietyStudent = student;
    }
  }
}
