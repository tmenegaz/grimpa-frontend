import { Component, OnInit } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { SharedModule } from '~shared/shared.module';
import { translateInstant } from '~shared/utils';
import { PaginationService } from '~src/app/services/pagination.service';

@Component({
  selector: 'app-tab-footer',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './tab-footer.component.html',
  styleUrls: ['./tab-footer.component.css']
})
export class TabFooterComponent implements OnInit {
  length: number;
  pageSize: number;
  pageIndex: number;
  pageSizeOptions: number[];

  constructor(
    private paginationService: PaginationService,
    private paginatorIntl: MatPaginatorIntl,
    private translate: TranslateService,
  ) {

    paginatorIntl.itemsPerPageLabel = translateInstant("labe_paginacao_quantidade", translate);

    const prep = translateInstant("labe_paginacao_preposocao", translate);

    this.paginatorIntl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length === 0 || pageSize === 0) {
        return `0 ${prep} ${length}`;
      }
      const startIndex = page * pageSize;
      const endIndex = startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} ${prep} ${length}`;
    };
  }

  ngOnInit(): void {
    this.paginationService.totalElements$.subscribe(length => this.length = length);
    this.paginationService.pageSize$.subscribe(pageSize => this.pageSize = pageSize);
    this.paginationService.pageIndex$.subscribe(pageIndex => this.pageIndex = pageIndex);
    this.paginationService.pageSizeOptions$.subscribe(pageSizeOptions => this.pageSizeOptions = pageSizeOptions);
  }

  onPageChange(event: PageEvent): void {
    this.paginationService.onPageChange(event);
  }
}
