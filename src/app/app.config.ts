import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"danotes-53ae1","appId":"1:242333954270:web:e2907f806e2160defcd24f","storageBucket":"danotes-53ae1.firebasestorage.app","apiKey":"AIzaSyBHm0wVRpO7GRG7jwdt4ARYoq-sL50N32k","authDomain":"danotes-53ae1.firebaseapp.com","messagingSenderId":"242333954270"}))), 
    importProvidersFrom(provideFirestore(() => getFirestore()))
  ]
};
