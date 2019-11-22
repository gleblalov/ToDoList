import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AuthService } from '.';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  databaseObj: SQLiteObject; // Database instance object
  nameModel:string = ""; // Input field model
  rowData: any = []; // Table rows
  readonly databaseName:string = "todo.db"; // DB name
  readonly tableName:string = "tasksTable4"; // Table name

  constructor(
    private sqlite: SQLite,
      ) {
   
   }

  createDB() {
      
    this.sqlite.create({
      name: this.databaseName,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
        this.createTable();
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }
 
   createTable() {
    
    this.databaseObj.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tableName + ' (pid INTEGER PRIMARY KEY, id, title, userID, isDone, describe, position)', [])
      .then(() => {
       
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }
 
  insertRows(task) {
   
   
    const a = JSON.stringify(task.position);
   this.databaseObj.executeSql('INSERT INTO ' + this.tableName + ' (id, title, userID, isDone, describe, position) VALUES (?, ?, ?, ?, ?, ?)', [task.id, task.title, task.userID, task.isDone, task.describe, a])
   .then(() => {
    
     
   })
   .catch(e => {
     console.log("error " + JSON.stringify(e))
   });    
 }

   insertRow(task) {
   
     
     const a = JSON.stringify(task.position);
    this.databaseObj.executeSql('INSERT INTO ' + this.tableName + ' (id, title, userID, isDone, describe, position) VALUES (?, ?, ?, ?, ?, ?)', [task.id, task.title, task.userID, task.isDone, task.describe, a])
    .then((res) => {
      
        
    })
    .catch(e => {
      console.log("error " + JSON.stringify(e))
    });   
    
  }
 
async getRows(userID) {
  
 
   await this.databaseObj.executeSql("SELECT * FROM " + this.tableName + " WHERE userID = " + "'" + userID + "'", [])
      .then((res) => {
        this.rowData = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.rowData.push(res.rows.item(i));
          }
        }
        console.log(this.rowData)
        return this.rowData;
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
     return this.rowData;
  }
 
  deleteRowByUserId(id) {
    this.databaseObj.executeSql("DELETE FROM " + this.tableName + " WHERE userID = " + "'" + id + "'", [])
      .then((res) => {
       
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  deleteRowById(id) {
    
    this.databaseObj.executeSql("DELETE FROM " + this.tableName + " WHERE id = " + "'" + id + "'", [])
      .then((res) => {
        
        
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  deleteRowByPrimaryId(id) {
   
    this.databaseObj.executeSql("DELETE FROM " + this.tableName + " WHERE pid = " + "'" + id + "'", [])
      .then((res) => {
        console.log(res,"Row Deleted!");
        
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  updateRow(task){
    
   
    this.databaseObj.executeSql("UPDATE " + this.tableName + " SET describe = " + "'" + task.describe + "'" + ", isDone = " + "'" + task.isDone + "'" + " WHERE id = " + "'" + task.id + "'", [])
      .then((res) => {
        console.log("Row Deleted!");
        
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  dropDB() {
    this.databaseObj.executeSql('DROP TABLE ' + this.tableName, []);
  }
}
