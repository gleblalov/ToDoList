import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';

import { Task, Position } from '../../model';
import { TodoService, SqliteService, } from '../../shared';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  LocationService,
  MyLocation,
  GoogleMapsAnimation,
} from '@ionic-native/google-maps';



@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.page.html',      
  styleUrls: ['./edit-task.page.scss'],
})
export class EditTaskPage implements OnInit {

  task: Task;
  placeholderText: String;
  map: GoogleMap;
  position: Position;
  test: any;
  mapOptions: GoogleMapOptions

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private todo: TodoService,
    private sql: SqliteService,
    ) {  
      
     }

   ngOnInit() {
    this.getParamsFromHomePage();
    
    
  }

  private getParamsFromHomePage() {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.task = JSON.parse(params.special);
        this.loadmap();
        console.log(this.task);
      }
     }); 
  }

  

  saveEditTask(){
    this.todo.changeTask(this.task).subscribe(() => {
      this.updateTask();
    },
    (err) => {
      this.updateTask();
    });
  }

  updateTask(){
    this.sql.updateRow(this.task);
      let navigationExtras: NavigationExtras = {
        queryParams: {
          editTask: JSON.stringify(this.task)
        }
      };
      this.router.navigate(['home'], navigationExtras);
  }
  
  changeIsDone(){
    this.task.isDone = !this.task.isDone;
  }

  placeholderInputDescribe(){
    if(!this.task.describe){
      return this.placeholderText = 'Enter a description...';;
    }
  }

  loadmap() {
    LocationService.getMyLocation().then((myLocation: MyLocation) => {
          
      this.mapOptions = {
        controls: {
              compass: true,
              myLocation: true,
              myLocationButton: true,
            },
        camera: {
          zoom: 15,
          target: this.task.position,
        // tilt: 30,
        },
      };
        if(this.task.position === undefined){
          this.mapOptions = {
            controls: {
                  compass: true,
                  myLocation: true,
                  myLocationButton: true,
                },
            camera: {
              zoom: 15,
              target: myLocation.latLng,
            // tilt: 30,
            },
          };
        }     
         console.log(this.task); 
      this.map = GoogleMaps.create('map_canvas', this.mapOptions);
      if(this.task.position !== undefined){
        this.map.addMarker({
          position: this.task.position,
          animation: GoogleMapsAnimation.DROP,
          draggable: true,
        }); 
      }
      
    });
  }
}





// loadmap() {
//   console.log(this.task.position);
//   LocationService.getMyLocation().then((myLocation: MyLocation) => {
//     console.log(this.task.position);
  
//     let mapOptions: GoogleMapOptions = {
//       controls: {
//             compass: true,
//             myLocation: true,
//             myLocationButton: true,
//           },
//       camera: {
//         target: this.task.position,
//         zoom: 15,
//       // tilt: 30,
//       },
      
//     };
//     debugger;
//     this.map = GoogleMaps.create('map_canvas', mapOptions);
//     this.map.addMarker({
//       position: this.task.position,
//       animation: GoogleMapsAnimation.DROP,
//       draggable: true,
//     }); 
//   });
// }