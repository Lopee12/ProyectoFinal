import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/Producto.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  urlApi: string = 'http://localhost:3000/productos';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.urlApi);
  }

  postProductos(prod: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.urlApi, prod);
  }

  deleteProductos(id: string): Observable<Producto> {
    return this.http.delete<Producto>(`${this.urlApi}/${id}`);
  }

  getProductoById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.urlApi}/${id}`);
  }

  getProductoByNombre(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlApi}?nombre=${nombre}`);
  }

  getProductoOrderByDiferenciaMayor(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlApi}?diferencia_gt=0`);
  }

  getProductoOrderByDiferenciaMenor(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlApi}?diferencia_lt=0`);
  }

  getProductoOrderByDiferencia(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlApi}?diferencia_ne=0`);
  } // no funciona traer solo los que tengan diferencia

  putProducto(prod: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.urlApi}/${prod.id}`, prod);
  }
  putProductos(prod: Producto[]): Observable<Producto[]> {
    return this.http.put<Producto[]>(`${this.urlApi}`, prod);
  }
}
