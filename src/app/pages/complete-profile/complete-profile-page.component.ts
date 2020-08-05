import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { pick } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { delay, first, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { AddressFormFactoryProvider } from 'ish-shared/address-forms/configurations/address-form-factory.provider';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

@Component({
  selector: 'ish-complete-profile-page',
  templateUrl: './complete-profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteProfilePageComponent implements OnInit, OnDestroy {
  error$: Observable<HttpError>;

  form = this.fb.group({
    countryCodeSwitch: ['', [Validators.required]],
    preferredLanguage: ['en_US', [Validators.required]],
    termsAndConditions: [false, [Validators.required, Validators.pattern('true')]],
    address: this.afs.getFactory('default').getGroup(),
  });
  submitted = false;
  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade, private fb: FormBuilder, private afs: AddressFormFactoryProvider) {}

  ngOnInit() {
    this.error$ = this.accountFacade.userError$;
    this.accountFacade.user$.pipe(whenTruthy(), first(), delay(500), takeUntil(this.destroy$)).subscribe(user => {
      const val = pick(user, 'firstName', 'lastName');
      this.form.get('address').patchValue(val);
    });
  }

  /**
   * Submits form and throws create event when form is valid
   */
  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    const formValue = this.form.value;

    const address = formValue.address;

    const user: Partial<User> = {
      title: formValue.address.title,
      firstName: formValue.address.firstName,
      lastName: formValue.address.lastName,
      phoneHome: formValue.address.phoneHome,
      preferredLanguage: formValue.preferredLanguage,
    };

    this.accountFacade.completeProfile(user, address);
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
