import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

export function useAuthCheck(requiredRole) {
  try {
    const cookie = Cookies.get("token");
    if (cookie) {
      const decoded = jwtDecode(cookie);
      if (decoded.role !== requiredRole) {
        throw new Error("Invalid token");
      }
      return decoded;
    } else {
      throw new Error("Invalid Token");
    }
  } catch (err) {
    console.log("Illegal Access")
    window.location.href = "/auth";
  }
}
