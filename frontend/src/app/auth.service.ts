import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { EMPTY, Observable, catchError, share, shareReplay, tap, throwError } from 'rxjs'; //rxjs/operators

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webService: WebRequestService, private router: Router, private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.webService.login(email, password).pipe(
      tap((res: HttpResponse<any>) => {
        const accessToken = res.headers.get('x-access-token') ?? '';
        const refreshToken = res.headers.get('x-refresh-token') ?? '';
        // the auth tokens will be in the header of this response
        this.setSession(res.body._id, accessToken, refreshToken)
        console.log("Logged in successfully!");
      }),
      catchError(this.handleError)
    );
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  signup(email: string, password: string): Observable<any> {
    return this.webService.signup(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        const accessToken = res.headers.get('x-access-token') ?? '';
        const refreshToken = res.headers.get('x-refresh-token') ?? '';
        // the auth tokens will be in the header of this response
        this.setSession(res.body._id, accessToken, refreshToken);
        console.log("Successfully signed up and now logged in!");
      }),
      catchError(this.handleError)
    );
  }

  signOut(): Observable<any> {
    const userId = this.getUserId();
    const refreshToken = this.getRefreshToken();

    if (!userId || !refreshToken) {
      return EMPTY;
    }

    return this.http.delete(`${this.webService.ROOT_URL}/users/session`, {
      headers: {
        '_id': userId,
        'x-refresh-token': refreshToken
      }
    }).pipe(
      tap(() => {
        this.removeSession();
        console.log("Signed out successfully!");
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('x-refresh-token');
  }

  getUserId(): string | null {
    return localStorage.getItem('user-id');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken);
  }

  private setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    this.setAccessToken(accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  private removeSession(): void {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    const userId = this.getUserId();

    if (!refreshToken || !userId) {
      return EMPTY;
    }

    return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': refreshToken,
        '_id': userId
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        const accessToken = res.headers.get('x-access-token');
        if (accessToken) {
          this.setAccessToken(accessToken);
        }
      }),
      catchError((error) => {
        console.error('Error refreshing access token:', error);
        this.logout();
        return EMPTY;
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occured:', error);
    return throwError(error);
  }
}
