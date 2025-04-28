import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { AsyncPipe } from '@angular/common';
import { Firestore, collectionData, collection, doc, onSnapshot, addDoc } from '@angular/fire/firestore';
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
  }


  async addNote(item: Note) {
    await addDoc(this.getNotesRef(), item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => { console.log("Document written with ID: ", docRef?.id) }
    )
    
  }

  ngOnDestroy() {
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

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    }
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
}
