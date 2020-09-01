import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-basket-items-summary',
  templateUrl: './basket-items-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketItemsSummaryComponent {
  @Input() basket: BasketView;

  isCollapsed = true;
  collapsedItemsCount = 3;

  constructor(private shoppingFacade: ShoppingFacade) {}

  product$(sku: string) {
    return this.shoppingFacade.product$(sku, ProductCompletenessLevel.List);
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  /**
   * the first (collapsedItemsCount) items are always visible, the other ones only if the summary list is expanded
   */
  isItemVisible(index: number): boolean {
    return index < this.collapsedItemsCount || !this.isCollapsed;
  }

  /**
   * the show all link is visible if the list is collapsed and there are more items to show
   */
  isShowAllLinkVisible(): boolean {
    return this.basket.lineItems.length > this.collapsedItemsCount && this.isCollapsed;
  }

  /**
   * the hide link is visible if the list is expanded and there are more items than collapsedItemsCount
   */
  isHideLinkVisible(): boolean {
    return this.basket.lineItems.length > this.collapsedItemsCount && !this.isCollapsed;
  }
}
