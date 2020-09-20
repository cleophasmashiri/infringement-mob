import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ProcessDefinition } from './schemas/process-definition.schema';
import { Task } from './schemas/task.model';
import { ApiService } from 'src/app/services/api/api.service';
import { environment } from 'src/environments/environment';

const httpOptions = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

@Injectable({
  providedIn: 'root',
})
export class CamundaRestService {
  
  private engineRestUrl = `${environment.taskApiUrl}/services/infringementapi/api/engine-rest/`;

  constructor(private http: HttpClient) {}

  // getTasks(): Observable<Task[]> {
  //   const endpoint = `${this.engineRestUrl}task?sortBy=created&sortOrder=desc&maxResults=10`;
  //   return this.http.get<any>(endpoint, httpOptions).pipe(
  //     tap(form => this.log(`fetched tasks`)),
  //     catchError(this.handleError('getTasks', []))
  //   );
  // }

  getTasksByAssignee(assignee: string): Observable<Task[]> {
    const endpoint = `${this.engineRestUrl}task?assignee=${assignee}&sortBy=created&sortOrder=desc&maxResults=10`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched tasks`)),
      catchError(this.handleError('getTasks', []))
    );
  }
  getTasksByGroup(group: string): Observable<Task[]> {
    const endpoint = `${this.engineRestUrl}task?candidateGroup=${group}&sortBy=created&sortOrder=desc&maxResults=10`;
    return this.http.get<any>(endpoint);
    // return this.http.get<any>(endpoint, httpOptions).pipe(
    //   tap(form => this.log(`fetched tasks`)),
    //   catchError(this.handleError('getTasks', []))
    // );
  }

  getGroups(username: string): Observable<string[]> {
    const endpoint = `${this.engineRestUrl}identity/groups?userId=${username}`;
    return this.http.get<any>(endpoint, httpOptions).pipe(
      tap(group => this.log(`fetched groups`)),
      catchError(this.handleError('getGroups', []))
    );
  }

  getTaskFormKey(taskId?: string): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form`;
    return this.http.get<any>(endpoint, httpOptions).pipe(
      tap(form => this.log(`fetched taskform`)),
      catchError(this.handleError('getTaskFormKey', []))
    );
  }

  getVariablesForTask(taskId: string, variableNames: string): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form-variables?variableNames=${variableNames}`;
    return this.http.get<any>(endpoint, httpOptions).pipe(
      tap(form => this.log(`fetched variables`)),
      catchError(this.handleError('getVariablesForTask', []))
    );
  }

  postCompleteTask(taskId: string, variables: any): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/complete`;
    return this.http.post<any>(endpoint, variables, httpOptions).pipe(
      tap(tasks => this.log(`posted complete task`)),
      catchError(this.handleError('postCompleteTask', []))
    );
  }

  getProcessDefinitionTaskKey(processDefinitionKey?: string): Observable<any> {
    const url = `${this.engineRestUrl}process-definition/key/${processDefinitionKey}/startForm`;
    return this.http.get<any>(url).pipe(
      tap(form => this.log(`fetched formkey`)),
      catchError(this.handleError('getProcessDeifnitionFormKey', []))
    );
  }

  getProcessDefinitions(): Observable<ProcessDefinition[]> {
    return this.http.get<ProcessDefinition[]>(this.engineRestUrl + 'process-definition?latestVersion=true', httpOptions).pipe(
      tap(processDefinitions => this.log(`fetched processDefinitions`)),
      catchError(this.handleError('getProcessDefinitions', []))
    );
  }

  postProcessInstance(processDefinitionKey: string, variables: any): Observable<any> {
    const endpoint = `${this.engineRestUrl}process-definition/key/${processDefinitionKey}/start`;
    return this.http.post<any>(endpoint, variables, httpOptions).pipe(
      tap(processDefinitions => this.log(`posted process instance`)),
      catchError(this.handleError('postProcessInstance', []))
    );
  }

  deployProcess(fileToUpload: File): Observable<any> {
    const endpoint = `${this.engineRestUrl}deployment/create`;
    const formData = new FormData();

    formData.append('fileKey', fileToUpload, fileToUpload.name);

    return this.http.post(endpoint, formData, httpOptions);
  }

  private handleError<T>(operation = 'operation', result?: T): any {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string): void {
    // console.log(message);
  }
}
