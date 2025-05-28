import {jwtDecode} from 'jwt-decode';
export const auth = {
    isAuthenticated() {
      return this.getUserInfo();
    },
    storeToken(token:string) {
      this.clear();
      localStorage.setItem('token', token);
    },
    getToken() {
      return localStorage.getItem('token');
    },
    getExpiration() {
      const token = this.getToken();
      if (token) {
        const decodedData = this.decode(token);
        return decodedData.exp;
      }
      return 0;
    },
    getRole() {
      const token = this.getToken();
      if (token) {
        const decodedData = this.decode(token);
        return decodedData.role;
      }
      return null;
    },
    getUserInfo():any{
      const token = this.getToken();
      if (token) {
        const decodedData = jwtDecode(token); 
        return decodedData;
      }
      return null;
    },
    decode(token:string) {
      let base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    },
    clear() {
      localStorage.clear();
      window.location.reload();
    },
  };
  
  