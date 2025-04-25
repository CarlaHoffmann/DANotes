import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { AsyncPipe } from '@angular/common';
import { Firestore, collectionData, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from "rxjs";

// interface Item {
//   name: string,
//   // ...
// };

@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  // item$;
  // item;

  // unsubList;
  // unsubSingle;

  unsubNotes;
  unsubTrash;

  firestore = inject(Firestore);
  // itemCollection = collection(this.firestore, 'items'); // wird nicht gebraucht, wengen Funktion unten
  // item$ = collectionData<Item>(itemCollection); // ersetzt
  

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();


    // this.unsubList = onSnapshot(this.getNotesRef(), (list) => {
    //   list.forEach(element => {
    //     console.log(element.id);
    //     console.log(this.setNoteObject(element.data(), element.id));
    //   });
    // });

    // this.unsubSingle = onSnapshot(this.getSingleDocRef("notes", "Q7a2jVJqlj04WA270x0t"), (element) => {
    //   console.log(element);
    // });

    // this.item$ = collectionData(this.getNotesRef()); // Erstellt Observable, liefert Werte async, oft mehrfach
    // // subscribe abonniert den Datenstrom und führt die Funktion 
    // // immer dann aus, wenn sich die Daten ändern
    // this.item = this.item$.subscribe((list) => { 
    //   list.forEach(element => {
    //     console.log(element);
    //   });
    // })

  }


  ngOnDestroy() {
    // unsubscribe beendet das Abo, damit keine Daten mehr fließen
    // this.item.unsubscribe(); 
    // this.unsubList(); // beendet Abo (wie unsubscribe)
    // this.unsubSingle(); // beendet Abo
    this.unsubNotes();
    this.unsubTrash();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }



  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(collId: string, docId: string) {
    return doc(collection(this.firestore, collId), docId)
  }


  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    }
  }
}
