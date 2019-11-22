import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

import { Task } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
    quantityTasksCompleted:number
    quantityTasksAll:number
    userId:string
    url = 'http://192.168.0.101:3333/todo';
  constructor(private http: HttpClient) { 

  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url);
  }

  postTask(task): Observable<Task> {
    return this.http.post<Task>(this.url, task);
  }

  deleteTask(id: number): Observable<Task> {
    return this.http.delete<Task>(`${this.url}/${id}`);
  }

  changeTask(task): Observable<Task> {
    console.log(task.id, 'changeTask')
    return this.http.put<Task>(`${this.url}/${task.id}`, task);
  }

  synchronizeTask(tasks) : Observable<Task> {
    debugger;
    return this.http.post<Task>(`${this.url}/synchronize`, tasks);
  }
}