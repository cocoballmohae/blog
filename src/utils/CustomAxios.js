import axios from "axios";
import jwtDecode from "jwt-decode";
import { BASE_URL } from "../config/Constants";

class CustomAxios {
  // 인스턴스화 : 클래스에서 객체를 만들어서 메모리에 주입
  static _instance = new CustomAxios();
  static instance = () => {
    return CustomAxios._instance;
  };

  constructor() {
    this.publicAxios = axios.create({ baseURL: BASE_URL });
    this.privateAxios = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
    });
    this.privateAxios.interceptors.request.use(this._requestPrivateInterceptor);
  }
  _requestPrivateInterceptor = async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken == null) {
      throw new axios.Cancel("토큰이 없습니다.");
    }
    // Date.now() -> ms / exp -> sec
    // 토큰이 만료됐다.
    if (jwtDecode(accessToken).exp < Date.now() / 1000) {
      localStorage.removeItem("accessToken");
      throw new axios.Cancel("토큰이 만료되었습니다.");
    } else {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  };
}

export const customAxios = CustomAxios.instance();
