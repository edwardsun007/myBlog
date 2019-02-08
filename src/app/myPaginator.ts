import {MatPaginatorIntl} from '@angular/material';

export function MyPaginator() {
  const MyPaginatorIntl = new MatPaginatorIntl();

  MyPaginatorIntl.itemsPerPageLabel = 'Posts To Display Per Page'; // customize item per page label

  return MyPaginatorIntl;
}
