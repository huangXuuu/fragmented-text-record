import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RestService, RestError, ApiOption } from './rest.service';
import { environment } from '../../environments/environment';
import { NzModalService } from 'ng-zorro-antd';
import * as _ from 'lodash';

export enum RestType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  DOWNLOAD = 'DOWNLOAD',
  UPLOAD = 'UPLOAD'
}

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private restService: RestService,
    private modalService: NzModalService,
  ) {
  }

  doRequest(method: RestType, apiOpt: ApiOption): Observable<any> {
    let apiObservable: Observable<any>;

    if (!apiOpt) {
      throw new Error('apiOption is empty.');
    }

    if (!apiOpt.apiKey) {
      return Observable.create(observer => {
        observer.next('');
        observer.complete();
      });
    }

    const apiKey = environment.useJson ? apiOpt.apiKey + '_json' : apiOpt.apiKey;

    apiOpt.apiKey = apiKey;

    apiOpt.headers = this.createHeader(apiOpt.contentType);

    switch (method) {
      case RestType.GET:
        apiObservable = this.doGet(apiOpt);
        break;
      case RestType.PUT:
        apiObservable = this.doPut(apiOpt);
        break;
      case RestType.POST:
        apiObservable = this.doPost(apiOpt);
        break;
      case RestType.DELETE:
        apiObservable = this.doDelete(apiOpt);
        break;
      case RestType.UPLOAD:
        apiObservable = this.doUpload(apiOpt);
        break;
      case RestType.DOWNLOAD:
        apiObservable = this.doDownload(apiOpt);
        break;
      default:
        throw new Error('requestWrapp mehod not supported.');
    }
    return apiObservable;
  }

  doGet(apiOption: ApiOption): Observable<any> {
    return this.restService.get(apiOption).pipe(map((res: Object) => {
      if (res) {
        return res['body'] ? res['body'] : {};
      }
      return null;
    }),
      catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  doPut(apiOption: ApiOption): Observable<any> {
    return this.restService.put(apiOption).pipe(map((res: Object) => {
      if (res) {
        return res['body'] ? res['body'] : {};
      }
      return null;
    }),
      catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  doPost(apiOption: ApiOption): Observable<any> {
    return this.restService.post(apiOption).pipe(map((res: Object) => {
      if (res) {
        return res['body'] ? res['body'] : {};
      }
      return null;
    }),
      catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  doDelete(apiOption: ApiOption): Observable<any> {
    return this.restService.delete(apiOption).pipe(map((res: Object) => {
      if (res) {
        return res['body'] ? res['body'] : {};
      }
      return null;
    }),
      catchError((error: HttpErrorResponse) => this.handleError(error)));
  }


  doUpload(apiOption: ApiOption): Observable<any> {
    const options = this.createHeader('multipart/form-data');
    apiOption.headers = options;

    return this.restService.upload(apiOption).pipe(map((res: Object) => {
      if (res) {
        return res['body'] ? res['body'] : {};
      }
      return null;
    }),
      catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  doDownload(apiOption: ApiOption): Observable<any> {

    apiOption.headers = apiOption.headers.append('X-Requested-With', 'XMLHttpRequest');

    return this.restService.download(apiOption).pipe(map((res: Object) => {
      if (res) {
        const data = res;
        const headers = <HttpHeaders>res['headers'];
        const contentType = headers.get('Content-Type');

        if (contentType.startsWith('application/octet-stream')) {
          const contentDisposition = headers.getAll('Content-Disposition');
          let filename = '';
          if (contentDisposition) {
            const matches = /filename=(.*?)/g.exec(contentDisposition[0]);
            filename = matches && matches.length > 1 ? decodeURIComponent(matches[1]) : '';
          }

          const file = {
            fileName: filename,
            data: data['body']
          };

          return file;
        }
        if (!data) {
          throw new RestError();
        }
      }
      return null;
    }),
      catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private createHeader(contentType?: string): HttpHeaders {
    const ct = {
      'Content-Type': 'application/json; charset=UTF-8'
    };

    if (contentType) {
      ct['Content-Type'] = contentType ? contentType : 'application/json; charset=UTF-8';
    } else {
      ct['Content-Type'] = 'application/json; charset=UTF-8';
    }
    const header = new HttpHeaders(ct);

    return header;
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error.error && error.error.error.type === 'cluster_block_exception') {
      this.modalService.error({
        nzTitle: '错误',
        nzContent: '数据库已锁定，请点击确定以解除锁定状态',
        nzOnOk: () => {
          const apiOpt = <ApiOption>{
            apiKey: 'release',
            body: {
              index: {
                blocks: {
                  read_only_allow_delete: false
                }
              }
            }
          };
          this.doRequest(RestType.PUT, apiOpt).subscribe(val => {
            if (val) {}
          });
          this.modalService.closeAll();
        }
      });
    } else {
      this.modalService.error({
        nzTitle: '错误',
        nzContent: error.error.error.reason,
        nzOnOk: () => this.modalService.closeAll()
      });
      throw new RestError(error);
    }

  }

}
