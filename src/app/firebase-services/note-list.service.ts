import { Injectable, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Firestore, collectionData, collection, doc } from '@angular/fire/firestore';

// interface Item {
//   name: string,
//   // ...
// };

@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  // trashNotes: Note[] = [];
  // normalNotes: Note[] = [];

  firestore = inject(Firestore);
  // itemCollection = collection(this.firestore, 'items'); // wird nicht gebraucht, wengen Funktion unten
  // item$ = collectionData<Item>(itemCollection); // ersetzt
  item$;

  constructor() {
    this.item$ = collectionData(this.getNotesRef());
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
