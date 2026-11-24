import { HttpInterceptorFn } from '@angular/common/http';

export const csrfTokenInterceptor: HttpInterceptorFn = (req, next) => {
    let options = document.cookie.split('; ').map(c => c.split('=')).find(arr => arr[0] === 'csrftoken');
    const csrfToken = (options) ? options[1] : '';
    // Clone the request and attach the new header(s)
    const clonedReq = req.clone({
        setHeaders: {
            'X-CSRFToken': csrfToken
        }
    });

    // Pass the cloned request to the next handler
    return next(clonedReq);
};