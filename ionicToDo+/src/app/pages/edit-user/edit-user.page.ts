import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { TodoService, AuthService } from '../../shared';
import { SocialUser } from 'src/app/model';
import { FormGroup } from '@angular/forms';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {

  userID: string;
  login: string;
  image: string;
  quantityTasksAll: number;
  quantityTasksCompleted: number;
  capturedSnapURL:string; 
  user: SocialUser;
  readonly tableName:string = "tasksTable4"; // Table name
  databaseObj: SQLiteObject; // Database instance object
  cameraOptions: CameraOptions = {
    quality: 70,
    destinationType: this.cam.DestinationType.DATA_URL,
    sourceType: this.cam.PictureSourceType.CAMERA,
    encodingType: this.cam.EncodingType.JPEG,
  }

  libraryOptions: CameraOptions = {
    quality: 70,
    destinationType: this.cam.DestinationType.DATA_URL,
    sourceType: this.cam.PictureSourceType.PHOTOLIBRARY,
    encodingType: this.cam.EncodingType.JPEG,
    mediaType: this.cam.MediaType.PICTURE
  }
  

  constructor(
    private router: Router,
    private storage: Storage,
    private todo: TodoService,
    private auth: AuthService,
    private cam: Camera,
    private sqlite: SQLite,
    ) { }

  async ngOnInit() {
    this.quantityTasksAll = this.todo.quantityTasksAll;
    this.quantityTasksCompleted = this.todo.quantityTasksCompleted;
    this.userID = await this.auth.getUserID();
    this.auth.getUser().subscribe(response => {
      
      this.login = response.login;
      if(response.imageUrl.includes('uploads')){
        this.image = `http://10.10.3.185:3333/uploads/${response.imageUrl}`
      } else {
        this.image = response.imageUrl;
      }
      
      if(response.imageUrl === undefined){
        this.image = 'https://www.pokecommunity.com/customavatars/avatar151701_11.gif';
      } 
    });
    
  }  
  camera(){
  
    this.cam.getPicture(this.cameraOptions).then((imageData) => {      
      
      const blob = this.base64toBlob(imageData, 'image/jpeg');
      const fd = new FormData();
      fd.append('image', blob);
      this.auth.uploadImage(fd).subscribe((res) => {
      });
    }, (err) => {
      console.log(err);
    });
  }

  gallery(){
    this.cam.getPicture(this.libraryOptions).then( imageData => {
    
      const blob = this.base64toBlob(imageData, 'image/jpeg');
      const fd = new FormData();
      fd.append('image', blob);
      this.auth.uploadImage(fd).subscribe((res) => {
      });
    }, (err) => {
      console.log(err);
    });
  }

  private base64toBlob(b64Data: string, contentType: string, sliceSize: number = 512) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  // saveEditUser(){
  //     this.user.name = 'gleb';
  //     this.user.imageUrl = this.image;
  //     console.log(this.user);
  //     this.auth.changeUser(this.user).subscribe((test) =>{
  //     console.log(test);
  //   });    
  // }


  logout(){
    this.storage.remove('userID');
    this.storage.remove('token');
    this.router.navigate(['']);
    // this.dropDB();
  }

  dropDB() {
    this.databaseObj.executeSql('DROP TABLE ' + this.tableName, []);
  }
 
}


// public getParamsFromHomePage() {
// if (params && params.userID && params.quantityTasksAll && params.quantityTasksCompleted) {
//   // this.userID = JSON.parse(params.userID);
//   // this.login = JSON.parse(params.login);
  
//   this.userID = params.userID;
//   this.quantityTasksAll = params.quantityTasksAll;
//   this.quantityTasksCompleted = params.quantityTasksCompleted;
// }
// }