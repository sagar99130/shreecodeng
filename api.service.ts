import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
// import { AppHelperService } from './../app-helper/app-helper.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalService } from './local.service';
import { Router } from '@angular/router';
import { AppHelperService } from './app-helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
}) 
export class ApiService {
 
  API_enviorment = 'test' // test,uat,live
  is_master_user=false;
  isInfoPopupShow = false;
  product_listing = false;
  globalpopup: any;
  API_CRM_URL = "";
  userDetail: any;
  API_VERSION = '1.2.6';
  RAZORPAY_KEY_ID = "";
  RAZORPAY_KEY_SECRET = "";
  //Type for show/hide BUYER/SELLER DETAILS 
  USER_TYPE_TITLE="";
  //seller details for product list category wise
  arrProductData:any;
  constructor( public snackBar: MatSnackBar,public appHelper:AppHelperService,
    public router:Router,public http: HttpClient,
    public localService:LocalService) {
      
    if (this.API_enviorment == 'test') {
      this.API_CRM_URL = "<api url here>";      
      if(window){
        window.console.log=function(){};
      }
      
    }
    if (this.API_enviorment == 'uat') {
      this.API_CRM_URL = "<api url here>";  
    }
    if (this.API_enviorment == 'live') {
      this.API_CRM_URL = "<api url here>";  
      if(window){
        // window.console.log=function(){};
      }
    }
    
  }

  // New
  // Using Observable Method
  callapi(requestUrl, requestParams, requestType, loadingText, isShowLoading, serverName): Observable<any> {
    if (isShowLoading) {
      //this.apphelper.showLoaderMessage(loadingText)
    }
    let headers = new HttpHeaders();
    if (this.localService.getJsonValue('access_token') != null) {
      headers = headers.append('Authorization', 'Bearer ' + 
      this.localService.getJsonValue('access_token'));
    }
    
    let API_URL_CALL = this.API_CRM_URL + requestUrl;
    if (requestType == 'GET') {
      let rand = Math.random();
      return this.http.get<any>(API_URL_CALL, { headers: headers })
        .pipe(
          map(res => {
           // this.apphelper.dismissLoader()
            return res
          }),
          catchError(this.handleError('login', []))
        );
    }
    if (requestType == 'POST') {
      return this.http.post<any>(API_URL_CALL, requestParams, { headers: headers })
        .pipe(
          map(res => {
            //this.apphelper.dismissLoader()
            return res
          }),
          catchError(this.handleError('login', []))
        );
    }
    if (requestType == 'DELETE') {
      return this.http.delete<any>(API_URL_CALL, { headers: headers })
        .pipe(
          map(res => {
           // this.apphelper.dismissLoader()
            return res
          }),
          catchError(this.handleError('login', []))
        );
    }
  }

     // New
  // Using Observable Method
  callapi1(requestUrl, requestParams, requestType, loadingText, isShowLoading, serverName): Observable<any> {
    if (isShowLoading) {
      //this.apphelper.showLoaderMessage(loadingText)
    }
    let headers = new HttpHeaders();
    if (this.localService.getJsonValue('access_token') != null) {
      headers = headers.append('Authorization', 'Bearer ' + this.localService.getJsonValue('access_token'));
    }
    let API_URL_CALL = 'https://testapi.sagar.net/api/v1/' + requestUrl;
    if (requestType == 'GET') {
      let rand = Math.random();
      return this.http.get<any>(API_URL_CALL, { headers: headers })
        .pipe(
          map(res => {
           // this.apphelper.dismissLoader()
            return res
          }),
          catchError(this.handleError('login', []))
        );
    }
    if (requestType == 'POST') {
      return this.http.post<any>(API_URL_CALL, requestParams, { headers: headers })
        .pipe(
          map(res => {
            //this.apphelper.dismissLoader()
            return res
          }),
          catchError(this.handleError('login', []))
        );
    }
    if (requestType == 'DELETE') {
      return this.http.delete<any>(API_URL_CALL, { headers: headers })
        .pipe(
          map(res => {
           // this.apphelper.dismissLoader()
            return res
          }),
          catchError(this.handleError('login', []))
        );
    }
  }


  // Handle Error while api call
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //this.apphelper.dismissLoader()
      var msg = '';
      //error.status==401 for unauthentication
      if (error.status == 401) {
        console.log(error);
        this.snackBar.open(error.statusText, '×', { duration: 2000 });
        this.localService.clearToken();
        this.appHelper.onClickLogout();
        this.appHelper.isLogin=false;
        this.router.navigate(['/']);
      } else {
        if (error.error.errors) {
          msg = this.formatError(error);
          this.snackBar.open(msg, '×', { duration: 1000 });
          //this.apphelper.showAlertOnlyMessage(msg);
        } else {
          if (error.error.message) {
            msg = error.error.message;
            this.snackBar.open(msg, '×', { duration: 1000 });
           // this.apphelper.showAlertOnlyTitle(msg);
          }
        }
      }
      return throwError(error);
    };
  }

  // format api error
  formatError(err) {
    // var error_msg = '<ul>';
    var error_msg = '';
    if (typeof err.error.errors != 'undefined') {
      var errorlist = err.error.errors;
      var keys_array = Object.keys(errorlist);
      if(keys_array.length==1){
        error_msg=errorlist[keys_array[0]]
      }
      else{
      for (var i = 0; i < keys_array.length; i++) {
        var key = keys_array[i]
        // error_msg += '<li>' + errorlist[key] + '</li>';
        error_msg += errorlist[key] + '<br/>'
      }
    }
    }
    // error_msg += '</ul>'
    return error_msg;
  }

  
  public getProducts(type): Observable<any>{
    return this.http.post<any>(this.API_CRM_URL + 'product/list', type );
}
  
  



}