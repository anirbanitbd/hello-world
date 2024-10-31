import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient, HttpParams} from "@angular/common/http";
import {CommonResponse, CommonResponseAdmin} from "../types/common-response";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {GasPriceType} from "../types/gas-price-type";


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private skipHttpClient: HttpClient;

  constructor(private _http: HttpClient,
              private handler: HttpBackend
  ) {
    this.skipHttpClient = new HttpClient(handler);
  }


  gasAndEthTracker(): Observable<CommonResponse<GasPriceType[]>> {
    return this._http.get<CommonResponse<GasPriceType[]>>(`${environment.gamePredictionApiOpenUrl}/getLivePrice`,{
      headers: {
        'exclude-interceptor': 'true'
      }
    });
  }

  getUserBalance(userId: number): Observable<CommonResponse<any>> {
    return this._http.get<CommonResponse<any>>(`${environment.transactionUrl}/current-balance/${userId}`);
  }

  addUserBalance(data: any): Observable<CommonResponse<any>> {
    return this._http.post<CommonResponse<any>>(`${environment.transactionUrl}/add-funds`, data);
  }

  withdrawUserBalance(data: any): Observable<CommonResponse<any>> {
    return this._http.post<CommonResponse<any>>(`${environment.transactionUrl}/withdraw-funds`, data);
  }


  getCommunityList(paramData?: any): Observable<CommonResponseAdmin<any>> {
    return this._http.get<CommonResponseAdmin<any>>(`${environment.adminApiUrl}/community`, {params: paramData});
  }
  changeAccessType(data: any): Observable<CommonResponseAdmin<any>> {
    return this._http.post<CommonResponseAdmin<any>>(`${environment.adminApiUrl}/community/change-access-type`, data);
  }
  getTransactionList(paramData?: any): Observable<CommonResponseAdmin<any>> {
    return this._http.get<CommonResponseAdmin<any>>(`${environment.adminApiUrl}/site-commission`, {params: paramData});
  }
  getBalance(): Observable<CommonResponseAdmin<any>> {
    return this._http.get<CommonResponseAdmin<any>>(`${environment.adminApiUrl}/site-commission/balance-amount`);
  }
  withdrawBalance(data: any): Observable<CommonResponseAdmin<any>> {
    return this._http.post<CommonResponseAdmin<any>>(`${environment.adminApiUrl}/site-commission/withdraw`, data);
  }
  getAllUserList(paramData?: any): Observable<CommonResponseAdmin<any>> {
    return this._http.get<CommonResponseAdmin<any>>(`${environment.adminApiUrl}/user`, {params: paramData});
  }
  addBalance(data: any): Observable<CommonResponseAdmin<any>> {
    return this._http.post<CommonResponseAdmin<any>>(`${environment.adminApiUrl}/user/add_balance`, data);
  }
  initMobileMoneyPayment(data: any): Observable<any> {
    return this._http.post<any>(`${environment.adminApiUrl}/mobile-money/init-transaction_admin`, data);
  }
  getTransactionStatus(transaction_id: any): Observable<any> {
      return this._http.get<any>(`${environment.adminApiUrl}/mobile-money/check_status_admin/${transaction_id}`);

  }
}
