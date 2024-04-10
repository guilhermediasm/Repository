import axios, {AxiosRequestConfig} from 'axios';

// Configuração padrão do Axios
const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.10:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const get = async <T>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(path, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const post = async <T>(
  path: string,
  data: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await axiosInstance.post<T>(path, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Adicione outras funções para outros métodos HTTP, se necessário
