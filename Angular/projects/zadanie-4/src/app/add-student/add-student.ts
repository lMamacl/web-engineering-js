import { Component, effect, signal, output } from '@angular/core';
import {FormsModule } from '@angular/forms';
import { Student } from '../student';

@Component({
  imports: [FormsModule],
  selector: 'app-add-student',
  standalone: true,
  styleUrl: './add-student.css',
  templateUrl: './add-student.html',
})
export class AddStudent {
  imie = signal('');
  nazwisko = signal('');
  wiek = signal(18);
  oceny = signal<string>('');
  studentAdded = output<Student>();

  constructor() {
    effect(() => {
      console.log('Imię:', this.imie());
      console.log('Nazwisko:', this.nazwisko());
      console.log('Wiek:', this.wiek());
      console.log('Oceny:', this.oceny());
    });
  }
  dodajStudenta() {
    const imie = this.imie().trim();
    const nazwisko = this.nazwisko().trim();
    const wiek = this.wiek();
    if (imie === '' || nazwisko === '' || wiek <= 0) {
      alert('Proszę wypełnić wszystkie pola poprawnie.');
      return;
    }
    const student = new Student(imie, nazwisko, wiek, []);

    this.studentAdded.emit(student);
    this.wyczyscFormularz();
  }

  private wyczyscFormularz() {
    this.imie.set('');
    this.nazwisko.set('');
    this.wiek.set(18);
  }

}
