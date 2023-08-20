import { createMiddleware } from './translations/create-middleware';

export default createMiddleware();
export const config = {
  matcher: ['/((?!api|_next|translate|.*\\..*).*)'],
};
