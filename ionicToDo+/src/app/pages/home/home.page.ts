import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NavigationExtras } from '@angular/router';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Storage } from '@ionic/storage';

import { Task, } from '../../model';
import { TodoService, AuthService, SqliteService } from '../../shared';

import { Network } from '@ionic-native/network/ngx';





@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 
  tasks: Task[];
  task: Task;
  tasksFilter: Task[];
  jwt: object;
  userID: string;
  login:string;
  inputSearch:string;
  inputTitle:string;
  inputDescribe:string;
  isOpenInputSearch: boolean;
  isChangeSQLite:boolean;

  databaseObj: SQLiteObject; // Database instance object
  nameModel:string = ""; // Input field model
  rowData: any = []; // Table rows
  readonly databaseName:string = "todo.db"; // DB name
  readonly tableName:string = "tasksTable4"; // Table name
  
  constructor(
    private router: Router,
    private navCntr: NavController,
    private route: ActivatedRoute,
    private todo: TodoService,
    private auth: AuthService,
    private sql: SqliteService,
    private storage: Storage,
    private network: Network,
      ){
      this.tasks = [];
      this.tasksFilter = this.tasks;
      this.jwt = {};
      this.userID = '';
      this.login = '';
      this.inputSearch = '';
      this.inputTitle= '';
      this.inputDescribe = '';
      this.isOpenInputSearch = false;      
    }
  
  async ngOnInit() {
    this.sql.createDB();
    this.userID = await this.auth.getUserID();
    this.isChangeSQLite = await this.storage.get('isChangeSQLite');
    console.log(this.isChangeSQLite)
    if (this.isChangeSQLite === true){
      debugger;
      this.tasks = await this.sql.getRows(this.userID);
      await this.todo.synchronizeTask(this.tasks).subscribe(() => {
        this.isChangeSQLite = false;
        this.storage.set('isChangeSQLite', this.isChangeSQLite);
        console.log(this.isChangeSQLite)
      });
      
    }
    await this.todo.getTasks().subscribe(async (response) => {
      this.tasks = response
      this.tasksFilter = this.tasks; 
      this.sql.deleteRowByUserId(this.userID);
      this.tasksFilter.forEach(task => {
        this.sql.insertRows(task)
      })
    },
    async (err) => {  
      this.tasks = await this.sql.getRows(this.userID);
      this.tasksFilter = this.tasks; 
    });

     this.getData();
  }

  private getData(){
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.task = JSON.parse(params.special);      
        this.tasks.push(this.task);
        this.tasksFilter = this.tasks;
      }
  
      if (params && params.editTask) {
        this.task = JSON.parse(params.editTask);
        this.tasks.forEach((item, index) =>{
          if(item.id === this.task.id){
            this.tasks[index] = this.task;
            this.tasksFilter = this.tasks;
          }
        })
      }
     }); 
  }

  doRefresh(event) {
    setTimeout(() =>{
      this.todo.getTasks().subscribe((response) => {
        this.tasks = response;
        this.tasksFilter = this.tasks;
        this.sql.deleteRowByUserId(this.userID);
        this.tasksFilter.forEach(task => {
          this.sql.insertRows(task)
        })
        event.target.complete(); 
      },
      async (err) => {     
        this.tasks = await this.sql.getRows(this.userID);
        this.tasksFilter = this.tasks; 
        event.target.complete(); 
      });
    }, 500)  
  }
 
  async addTask(){
    
  // this.userID = await this.auth.getUserID();
  
    const task: Task = {
      title: this.inputTitle,
      userID: this.userID,
      isDone: false,
    }
    console.log(this.isChangeSQLite)
    if (task.title !== '') {
      this.todo.postTask(task).subscribe((response) => {
        this.task = response;
        this.sql.insertRow(this.task);
        this.tasks.push(this.task);
        this.tasksFilter = this.tasks;
        this.inputTitle = '';          
      },
     async (err) => {
        this.sql.insertRow(task);
        this.tasks = await this.sql.getRows(this.userID);
        this.tasksFilter = this.tasks; 
        this.inputTitle = '';
        this.storage.set('isChangeSQLite', true);
        this.isChangeSQLite = true;
        console.log(this.isChangeSQLite)
       
      });
      
    }
  }
  
  deleteTask(task){
    this.todo.deleteTask(task.id).subscribe(() => {
      if( task.id !== null){
        this.sql.deleteRowById(task.id);
      }
    this.tasks = this.tasks.filter(t => t.id !==task.id);
    this.tasksFilter = this.tasks.filter(task =>  task.title.toLowerCase().includes(this.inputSearch.toLowerCase()));
    if(this.tasksFilter.length === 0){
      this.tasksFilter = this.tasks;
      this.inputSearch = '';
    }
    },
    () => {
      debugger;
      if( task.id !== null){
        this.sql.deleteRowById(task.id);
      }
        this.sql.deleteRowByPrimaryId(task.pid);
      
    this.tasks = this.tasks.filter(t => t.pid !==task.pid);
    this.tasksFilter = this.tasks.filter(task =>  task.title.toLowerCase().includes(this.inputSearch.toLowerCase()));
    if(this.tasksFilter.length === 0){
      this.tasksFilter = this.tasks;
      this.inputSearch = '';
    }
    this.isChangeSQLite = true;
    });
    
  }

  changeStateDone(task){
    task.isDone = !task.isDone;
    this.todo.changeTask(task).subscribe();
    this.sql.updateRow(task);
  }
 
  filterTasksByTitle(){
    this.tasksFilter = this.tasks.filter(task => task.title.toLowerCase().includes(this.inputSearch.toLowerCase()));
  }

  openInputSearch(){
    this.isOpenInputSearch = !this.isOpenInputSearch;
    if(this.isOpenInputSearch === false){
      this.tasksFilter = this.tasks;
      this.inputSearch = '';
    }
  }

  openAddTaskPage() {
    this.navCntr.navigateForward('/add-task');
  }

  openDetails(task){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(task)
      }
    };
    this.router.navigate(['edit-task/:id'], navigationExtras);
    }
  
 async openUserDetails(){
    const tasksCompleted = this.tasks.filter(task => task.isDone === true);
    this.todo.quantityTasksCompleted = tasksCompleted.length;
    this.todo.quantityTasksAll = this.tasks.length;
    
    this.router.navigate(['/edit-user']);
    }

    networkTest(){
      let a = this.network.type;
      
      
      console.log(a);
     
    }

  //   createDB() {
      
  //     this.sqlite.create({
  //       name: this.databaseName,
  //       location: 'default'
  //     })
  //       .then((db: SQLiteObject) => {
  //         this.databaseObj = db;
  //         console.log('freaky_datatable Database Created!');
  //         this.createTable();
  //       })
  //       .catch(e => {
  //         console.log("error " + JSON.stringify(e))
  //       });
  //   }
   
  //    createTable() {
      
  //     this.databaseObj.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tableName + ' (id PRIMARY KEY, title, userID, isDone, describe, position)', [])
  //       .then(() => {
  //         console.log('Table Created!');
  //       })
  //       .catch(e => {
  //         console.log("error " + JSON.stringify(e))
  //       });
  //   }
   
  //   insertRow() {
  //    this.tasks.forEach(task => {
  //      console.log(task);
  //      const a = JSON.stringify(task.position);
  //     this.databaseObj.executeSql('INSERT INTO ' + this.tableName + ' (id, title, userID, isDone, describe, position) VALUES (?, ?, ?, ?, ?, ?)', [task.id, task.title, task.userID, task.isDone, task.describe, a])
  //     .then(() => {
  //       console.log('Row Inserted!');
  //       this.getRows();
  //     })
  //     .catch(e => {
  //       console.log("error " + JSON.stringify(e))
  //     });
  //    })
      
  //   }
   
  // async getRows() {
  //   console.log(this.userID);
  //   console.log("SELECT * FROM " + this.tableName + " WHERE userID = " + "'" + this.userID + "'");
  //    await this.databaseObj.executeSql("SELECT * FROM " + this.tableName + " WHERE userID = " + "'" + this.userID + "'", [])
  //       .then((res) => {
  //         this.rowData = [];
  //         if (res.rows.length > 0) {
  //           for (var i = 0; i < res.rows.length; i++) {
  //             this.rowData.push(res.rows.item(i));
  //           }
  //         }
  //         console.log(this.rowData)
  //         return this.rowData;
  //       })
  //       .catch(e => {
  //         console.log("error " + JSON.stringify(e))
  //       });
  //      return this.rowData;
  //   }
   
  //   deleteRow(id) {
  //     this.databaseObj.executeSql("DELETE FROM " + this.tableName + " WHERE id = " + "'" + id + "'", [])
  //       .then((res) => {
  //         console.log("Row Deleted!");
  //         this.getRows();
  //       })
  //       .catch(e => {
  //         console.log("error " + JSON.stringify(e))
  //       });
  //   }

  //   dropDB() {
  //     this.databaseObj.executeSql('DROP TABLE ' + this.tableName, []);
  //   }
  

}


  