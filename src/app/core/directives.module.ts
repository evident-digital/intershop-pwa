import { NgModule } from '@angular/core';

import { ClickOutsideDirective } from './directives/click-outside.directive';
import { ServerHtmlDirective } from './directives/server-html.directive';
import { IdentityProviderCapabilityDirective } from './utils/identity-provider/identity-provider-capability.directive';

@NgModule({
  declarations: [ClickOutsideDirective, IdentityProviderCapabilityDirective, ServerHtmlDirective],
  exports: [ClickOutsideDirective, IdentityProviderCapabilityDirective, ServerHtmlDirective],
})
export class DirectivesModule {}
