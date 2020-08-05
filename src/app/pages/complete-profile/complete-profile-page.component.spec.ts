import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AddressFormContainerComponent } from 'ish-shared/address-forms/components/address-form-container/address-form-container.component';
import { AddressFormFactory } from 'ish-shared/address-forms/components/address-form/address-form.factory';
import { AddressFormFactoryProvider } from 'ish-shared/address-forms/configurations/address-form-factory.provider';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';
import { TacCheckboxComponent } from 'ish-shared/forms/components/tac-checkbox/tac-checkbox.component';

import { CompleteProfilePageComponent } from './complete-profile-page.component';

describe('Complete Profile Page Component', () => {
  let component: CompleteProfilePageComponent;
  let fixture: ComponentFixture<CompleteProfilePageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const addressFormFactory = mock(AddressFormFactory);
    when(addressFormFactory.getGroup(anything())).thenReturn(new FormGroup({}));

    const addressFormFactoryProvider = mock(AddressFormFactoryProvider);
    when(addressFormFactoryProvider.getFactory(anything())).thenReturn(addressFormFactory);

    const accountFacade = mock(AccountFacade);
    when(accountFacade.user$).thenReturn(EMPTY);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        CompleteProfilePageComponent,
        MockComponent(AddressFormContainerComponent),
        MockComponent(CheckboxComponent),
        MockComponent(ErrorMessageComponent),
        MockDirective(TacCheckboxComponent),
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AddressFormFactoryProvider, useFactory: () => instance(addressFormFactoryProvider) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteProfilePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
