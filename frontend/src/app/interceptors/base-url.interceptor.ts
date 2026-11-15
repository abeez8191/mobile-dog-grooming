import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Only prepend if the URL is relative (doesn't start with http/https)
  if (!req.url.startsWith('http')) {
    const apiReq = req.clone({
      url: `${environment.baseUrl}/${req.url.replace(/^\//, '')}`
    });
    return next(apiReq);
  }
  return next(req);
};