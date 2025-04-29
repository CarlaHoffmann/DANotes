import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { AsyncPipe } from '@angular/common';
import { Firestore, collectionData, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where } from '@angular/fire/firestore';
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
  normalMarkedNotes: Note[] = [];

  // item$;
  // item;

  // unsubList;
  // unsubSingle;

  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;

  firestore = inject(Firestore);
  // itemCollection = collection(this.firestore, 'items'); // wird nicht gebraucht, wengen Funktion unten
  // item$ = collectionData<Item>(itemCollection); // ersetzt
  

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
    this.unsubTrash = this.subTrashList();
  }


  async deleteNote(collId: "notes" | "trash", docId: string) {
    await deleteDoc(this.getSingleDocRef(collId, docId)).catch(
      (err) => { console.error(err) }
    )
  }

  async updateNote(note: Note) {
    if(note.id) { // evtl. Option Id leer berücksichtigen
      let docRef = this.getSingleDocRef(this.getCollIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.log(err); }
      );
    }
  }

  // da das note(jetzt: this.getCleanJson(note)) in updateNote(), updateDoc() 
  // nicht genau definiert werden darf, 
  // es dies aber für zB. note.id sein muss, 
  // hier eine Hilfsfunktion um dies zu umgehen.
  // Typisierung Json: any
  getCleanJson(note: Note):{} { 
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  getCollIdFromNote(note: Note):string {
    if(note.type == 'note') {
      return 'notes'
    } else {
      return 'trash'
    }
  }

  async addNote(item: Note, collId: "notes" | "trash") {
    let Ref = this.chooseRef(collId);

    await addDoc(Ref, item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => { console.log("Document written with ID: ", docRef?.id) }
    )
  }

  chooseRef(collId: "notes" | "trash") {
    if(collId == 'notes') {
      return this.getNotesRef();
    } else {
      return this.getTrashRef();
    }
  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubMarkedNotes();
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
    const q = query(this.getNotesRef(), limit(100));
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subMarkedNotesList() {
    const q = query(this.getNotesRef(), where("marked", "==", true), limit(100));
    return onSnapshot(q, (list) => {
      this.normalMarkedNotes = [];
      list.forEach(element => {
        this.normalMarkedNotes.push(this.setNoteObject(element.data(), element.id));
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
