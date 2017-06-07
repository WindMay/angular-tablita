import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RecipesService {
  headers: Headers
  options: RequestOptions
  constructor(private http: Http) {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'q=0.8;application/json;q=0.9' })
    this.options = new RequestOptions({ headers: this.headers });
  }
  get(location:string): Promise<any> {
    return this.http
      .get(location, this.options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  private extractData(res: Response) {
    let body = res.json()
    return body || {}
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error)
    return Promise.reject(error.message || error)
  }
}
