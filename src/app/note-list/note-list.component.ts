import { Component } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoteComponent } from './note/note.component';



@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NoteComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss'
})
export class NoteListComponent {
  noteList: Note[] = [];
  favFilter: "all" | "fav" = "all";
  status: "notes" | "trash" = "notes";

  constructor(private noteService: NoteListService) { // private macht das die Daten im HTML nicht verwendbar sind
    // this.noteList = this.getDummyData()
  }

  // getList(): Note[] {
  //   return this.noteService.normalNotes;
  // }
  getList(): Note[] {
    if(this.status == 'notes') {
      if(this.favFilter == 'all') {
        return this.noteService.normalNotes;
      } else {
        return this.noteService.normalMarkedNotes;
      }
    } else {
      return this.noteService.trashNotes;
    }
    
  }

  // getTrashList(): Note[] {
  //   return this.noteService.trashNotes;
  // }

  changeFavFilter(filter:"all" | "fav"){
    this.favFilter = filter;
  }

  changeTrashStatus(){
    if(this.status == "trash"){
      this.status = "notes";
    } else {
      this.status = "trash";
      this.favFilter = "all";
    }
  }




  // getDummyData(): Note[] {
  //   return [
  //     {
  //       id: "21sasd561dd4sdf",
  //       type: "note",
  //       title: "Block, Inline, and Inline-Block",
  //       content: "https://www.youtube.com/watch?v=x_i2gga-sYg",
  //       marked: true,
  //     },
  //     {
  //       id: "25sd4f561w54sdf",
  //       type: "note",
  //       title: "css selector",
  //       content: `kind p > b   (direktes kind) 
  //       nachfahren p b  (alle nachfahren)
  //       geschwister p ~ b (auf gleicher ebene ist VOR dem p ein b)`,
  //       marked: true,
  //     },
  //     {
  //       id: "54a4s6d546ff",
  //       type: "note",
  //       title: "aufräumen",
  //       content: "Wohnzimmer saugen",
  //       marked: false,
  //     },
  //     {
  //       id: "2a35s4d654a6s4d",
  //       type: "note",
  //       title: "links",
  //       content: `Reihenfolge: a:visited 
  //       a:focus 
  //       a:hover 
  //       a:active
  //       merkspruch: LoVe HAte`,
  //       marked: true,
  //     }
  //   ];
  // }

}
