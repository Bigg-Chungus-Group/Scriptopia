import { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

export function useAuthCheck(requiredRole) {
  useEffect(() => {
    try {
      const cookie = Cookies.get('token');
      const decoded = jwtDecode(cookie);
      if (decoded.role !== requiredRole) {
        throw new Error('Invalid token');
      }
    } catch (err) {
      window.location.href = '/auth';
    }
  }, [requiredRole]);
}
