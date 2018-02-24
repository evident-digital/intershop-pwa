import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ViewType } from '../../../../models/types';
import { SelectOption } from '../../../../shared/components/form-controls/select/select-option.interface';

@Component({
  selector: 'ish-product-list-toolbar',
  templateUrl: './product-list-toolbar.component.html'
})

export class ProductListToolbarComponent implements OnInit, OnChanges {

  @Input() itemCount: number;
  @Input() viewType: ViewType = 'grid';
  @Input() sortBy: 'default';
  @Output() viewTypeChange = new EventEmitter<string>();
  @Output() sortByChange = new EventEmitter<string>();

  sortForm: FormControl;

  // TODO: comes from a REST call or has to go somewhere else
  sortOptions: SelectOption[] = [
    { value: 'default', label: 'Default Sorting' },
    { value: 'name-asc', label: 'Name asc' },
    { value: 'name-desc', label: 'Name desc' },
    { value: 'SalesRankUnitsIndex-desc', label: 'Topsellers' },
    { value: 'ArrivalDate-desc', label: 'Newest Arrivals' },
  ];

  ngOnInit() {
    this.sortForm = new FormControl(this.sortBy);
    this.sortForm.valueChanges.subscribe(this.sortByChange);
  }

  ngOnChanges(c: SimpleChanges) {
    if (c.sortBy && this.sortForm) {
      this.sortForm.setValue(this.sortBy, { emitEvent: false });
    }
  }

  get listView() {
    return this.viewType === 'list';
  }

  get gridView() {
    return this.viewType === 'grid';
  }

  setViewType(mode: ViewType) {
    this.viewType = mode;
    this.viewTypeChange.emit(mode);
  }
}