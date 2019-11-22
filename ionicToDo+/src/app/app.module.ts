import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite/ngx';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { InterceptorProvider } from './shared/interceptor.service';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { Facebook } from '@ionic-native/facebook/ngx';

import { Camera } from '@ionic-native/camera/ngx';
import { Network } from '@ionic-native/network/ngx';




export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('token');
    },
    whitelistedDomains: ['localhost:5000']
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyBSmJjmRvsMihTgmo5_YFTAPGUkhD4g4gU",
  authDomain: "todo-1571749503676.firebaseapp.com",
  databaseURL: "https://todo-1571749503676.firebaseio.com",
  projectId: "todo-1571749503676",
  storageBucket: "todo-1571749503676.appspot.com",
  messagingSenderId: "956153456177",
  appId: "1:956153456177:web:829bd5b768b513f4769710"
};


@NgModule({
  declarations: [
    AppComponent,
    
  ],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage],
      }
    }),
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
   ],
   
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    Facebook,
    Camera,
    Network,
    { 
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorProvider,
      multi: true 
    },
    SQLite,
    NativeGeocoder,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


// JwtModule.forRoot({
//   jwtOptionsProvider: {
//     provide: JWT_OPTIONS,
//     useFactory: jwtOptionsFactory,
//     deps: [Storage],
//   }
// })


