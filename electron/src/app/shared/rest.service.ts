import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { retry } from 'rxjs/internal/operators/retry';
import { catchError } from 'rxjs/internal/operators/catchError';
import { finalize } from 'rxjs/internal/operators/finalize';
import { LoaderService } from './loader.service';
import { environment } from '../../environments/environment';
import { restApi } from '../resources/restapi';

export class HttpError extends Error {
  httpStatus?: number;

  constructor(message?: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class RestError extends HttpError {
  error: HttpErrorResponse;

  constructor(error?: HttpErrorResponse) {
    super(error ? error.message : '');
    this.error = error;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RestError.prototype);
  }
}

export interface ApiOption {
  apiKey: string;
  urlEndpointParams?: Map<string, string>;
  reqParams?: Map<string, string>;
  body?: Object;
  headers?: HttpHeaders;
  contentType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private restApi: any;

  private environment: any;

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService) {

    this.restApi = restApi;

    this.environment = environment;
  }

  getApiUrl(apiOption: ApiOption): string {

    let urlEndpoint = this.restApi[apiOption.apiKey];

    if (apiOption.urlEndpointParams) {
      apiOption.urlEndpointParams.forEach((value: string, key: string) => {
        urlEndpoint = urlEndpoint.replace(`{:${key}}`, value);
      });
    }

    let apiParams = '';

    const reqParams = apiOption.reqParams || new Map();
    reqParams.forEach((value: string, key: string) => {
      if (value) {
        apiParams = apiParams ? `${apiParams}&${key}=${value}` : `?${key}=${value}`;
      }
    });

    return encodeURI(`${this.environment.restBaseUrl}${urlEndpoint}${apiParams}`);
  }

  get(apiOption: ApiOption): Observable<HttpResponse<any>> {

    this.loaderService.showSpinner();

    const options = {
      headers: apiOption.headers,
      observe: 'response' as 'response'
    };

    const apiUrl = this.getApiUrl(apiOption);

    return this.http.get(apiUrl, options)
      .pipe(retry(this.environment.restRetry),
        map((res: HttpResponse<Object>) => this.handleResponse(res)),
        catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
        finalize(() => {
          this.loaderService.hideSpinner();
        }));

  }

  put(apiOption: ApiOption): Observable<HttpResponse<any>> {
    this.loaderService.showSpinner();

    const options = {
      headers: apiOption.headers ? apiOption.headers : new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' }),
      observe: 'response' as 'response'
    };

    const apiUrl = this.getApiUrl(apiOption);

    if (apiOption.body && Object.keys(apiOption.body).length === 0 && apiOption.body.constructor === Object) {
      apiOption.body = undefined;
    }

    return this.http.put(apiUrl, apiOption.body, options)
      .pipe(retry(this.environment.restRetry),
        map((res: HttpResponse<Object>) => this.handleResponse(res)),
        catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
        finalize(() => {
          this.loaderService.hideSpinner();
        }));
  }

  post(apiOption: ApiOption): Observable<HttpResponse<any>> {
    this.loaderService.showSpinner();

    const options = {
      headers: apiOption.headers ? apiOption.headers : new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' }),
      observe: 'response' as 'response'
    };

    const apiUrl = this.getApiUrl(apiOption);

    if (apiOption.body && Object.keys(apiOption.body).length === 0 && apiOption.body.constructor === Object) {
      apiOption.body = undefined;
    }

    return this.http.post(apiUrl, apiOption.body, options)
      .pipe(retry(this.environment.restRetry),
        map((res: HttpResponse<Object>) => this.handleResponse(res)),
        catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
        finalize(() => {
          this.loaderService.hideSpinner();
        }));
  }

  upload(apiOption: ApiOption): Observable<HttpResponse<any>> {
    this.loaderService.showSpinner();

    const apiUrl = this.getApiUrl(apiOption);

    const options = {
      headers: apiOption.headers,
      observe: 'response' as 'response'
    };

    return this.http.post(apiUrl, apiOption.body, options)
      .pipe(retry(this.environment.restRetry),
        map((res: HttpResponse<Object>) => this.handleResponse(res)),
        catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
        finalize(() => {
          this.loaderService.hideSpinner();
        }));
  }

  download(apiOption: ApiOption): Observable<HttpResponse<any>> {
    this.loaderService.showSpinner();

    const apiUrl = this.getApiUrl(apiOption);

    const options = {
      headers: apiOption.headers ? apiOption.headers : new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' }),
      observe: 'response' as 'response',
      responseType: 'blob' as 'blob'
    };

    return this.http.get(apiUrl, options)
      .pipe(retry(this.environment.restRetry),
        map((res: HttpResponse<Blob>) => this.handledownloadResponse(res)),
        catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
        finalize(() => {
          this.loaderService.hideSpinner();
        }));
  }

  delete(apiOption: ApiOption): Observable<any[]> {
    this.loaderService.showSpinner();

    const options = {
      headers: apiOption.headers,
      observe: 'response' as 'response'
    };

    const apiUrl = this.getApiUrl(apiOption);

    return this.http.delete(apiUrl, options)
      .pipe(retry(this.environment.restRetry),
        map((res: HttpResponse<Object>) => this.handleResponse(res)),
        catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
        finalize(() => {
          this.loaderService.hideSpinner();
        }));
  }

  private handledownloadResponse(res: HttpResponse<Blob>): any {
    return { headers: res.headers, body: res.body || '' };
  }


  private handleResponse(res: HttpResponse<Object>): any {
    return { headers: res.headers, body: res.body || '' };
  }

  private handleHttpError(error: HttpErrorResponse): any {
    throw error;
  }
}
