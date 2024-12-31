import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private totalElementsSubject = new BehaviorSubject<number>(0);
  private pageSizeSubject = new BehaviorSubject<number>(10);
  private pageIndexSubject = new BehaviorSubject<number>(0);
  private pageSizeOptionsSubject = new BehaviorSubject<number[]>([5, 10, 50, 100]);

  get totalElements$(): Observable<number> {
    return this.totalElementsSubject.asObservable();
  }

  get pageSize$(): Observable<number> {
    return this.pageSizeSubject.asObservable();
  }

  get pageIndex$(): Observable<number> {
    return this.pageIndexSubject.asObservable();
  }

  get pageSizeOptions$(): Observable<number[]> {
    return this.pageSizeOptionsSubject.asObservable();
  }

  getPageIndex(): number {
    return this.pageIndexSubject.getValue();
  }

  getPageSize(): number {
    return this.pageSizeSubject.getValue();
  }

  setTotalElements(totalElements: number): void {
    this.totalElementsSubject.next(totalElements);
  }

  setPageSize(pageSize: number): void {
    this.pageSizeSubject.next(pageSize);
  }

  setPageIndex(pageIndex: number): void {
    this.pageIndexSubject.next(pageIndex);
  }

  setPageSizeOptions(pageSizeOptions: number[]): void {
    this.pageSizeOptionsSubject.next(pageSizeOptions);
  }

  onPageChange(event: PageEvent): void {
    this.setPageIndex(event.pageIndex);
    this.setPageSize(event.pageSize);
  }
}
