import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';

import { Task, Position } from '../../model';
import { TodoService, SqliteService, } from '../../shared';


import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  LocationService,
  MyLocation,
  LatLng,
  GoogleMapsAnimation,
} from '@ionic-native/google-maps';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {

  inputTitle: string;
  inputDescribe: string;
  map: GoogleMap;
  position: Position;
  onMapClick: any;
  userID: any;
  task: Task;

  constructor(
    private router: Router,
    private todo: TodoService,
    private auth: AuthService,
    private sql: SqliteService,
    ) { 
    this.inputTitle = '';
    this.inputDescribe = '';
    this.userID = '';
  }

  ngOnInit() {
    this.loadmap();
    this.addTask();
  }

  public async addTask() {
    this.userID = await this.auth.getUserID();
    this.task = {
      title: this.inputTitle,
      userID: this.userID,
      isDone: false,
      describe: this.inputDescribe,
      position: this.position,
    }
    
    if (this.task.title !== '') {
      this.todo.postTask(this.task).subscribe(response => {
        this.sql.insertRow(response);
        let navigationExtras: NavigationExtras = {
          queryParams: {
            special: JSON.stringify(response)
          }
        };
        this.inputTitle = '';
        this.inputDescribe = '';
        this.router.navigate(['/home'], navigationExtras);
      },
      (err) => {
        this.sql.insertRow(this.task);
        let navigationExtras: NavigationExtras = {
          queryParams: {
            special: JSON.stringify(this.task)
          }
        };
        this.inputTitle = '';
        this.inputDescribe = '';
        this.router.navigate(['/home'], navigationExtras);
      });
    }
  }

  private loadmap() {

    LocationService.getMyLocation().then((myLocation: MyLocation) => {
      
      let mapOptions: GoogleMapOptions = {
        controls: {
              compass: true,
              myLocation: true,
              myLocationButton: true,
            },
        camera: {
          target: myLocation.latLng,
          zoom: 15,
        // tilt: 30,
        },
      };
      
      this.map = GoogleMaps.create('map_canvas', mapOptions);
      this.position = myLocation.latLng;

      this.map.on(GoogleMapsEvent.MY_LOCATION_BUTTON_CLICK).subscribe(() => {
        this.map.clear(); 
        this.position = myLocation.latLng;
      });

      this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((params: any[]) => {
        this.map.clear();
        let latLng: LatLng = params[0];
    
        this.map.addMarker({
          position: latLng,
          animation: GoogleMapsAnimation.DROP,
          draggable: true,
        });
        this.position = latLng;
      });
    });
  }  
}







// private addTask() {
  //   const task: Task = {
  //     title: this.inputTitle,
  //     isDone: false,
  //     describe: this.inputDescribe,
  //   }
    
  //   if (task.title !== '') {
  //     let navigationExtras: NavigationExtras = {
  //       queryParams: {
  //         special: JSON.stringify(task)
  //       }
  //     };

  //     this.router.navigate([''], navigationExtras);
  //   }
  // }

  // private addTask() {
  //   const task: Task = {
  //     id: -1,
  //     title: this.inputTitle,
  //     isDone: false,
  //     describe: this.inputDescribe,
  //   };

  //   if (task.title !== '') {
  //     let navigationExtras: NavigationExtras = {
  //       queryParams: {
  //         special: JSON.stringify(task)
  //       }
  //     };
  //     this.router.navigate([''], navigationExtras);
  //   }
  // }