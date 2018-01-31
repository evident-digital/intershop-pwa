import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomFormsModule } from 'ng2-validation';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { USE_SIMPLE_ACCOUNT, USER_REGISTRATION_LOGIN_TYPE } from '../../../../core/configurations/injection-keys';
import { AccountLoginService } from '../../../../core/services/account-login/account-login.service';
import { FormUtilsService } from '../../../../core/services/utils/form-utils.service';
import { Customer } from '../../../../models/customer/customer.model';
import { SimpleRegistrationComponent } from './simple-registration.component';

describe('Simple Registration Component', () => {
  let fixture: ComponentFixture<SimpleRegistrationComponent>;
  let component: SimpleRegistrationComponent;
  let accountLoginServiceMock: AccountLoginService;
  let location: Location;

  beforeEach(async(() => {
    accountLoginServiceMock = mock(AccountLoginService);

    when(accountLoginServiceMock.createUser(anything())).thenReturn(of(new Customer()));

    TestBed.configureTestingModule({
      declarations: [SimpleRegistrationComponent],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        CustomFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: SimpleRegistrationComponent }
        ])
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: USE_SIMPLE_ACCOUNT, useValue: true },
        { provide: USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' },
        FormUtilsService
      ]
    }).overrideComponent(SimpleRegistrationComponent, {
      set: {
        providers: [
          { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) }
        ]
      }
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleRegistrationComponent);
    component = fixture.componentInstance;
    location = TestBed.get(Location);
    fixture.autoDetectChanges(true);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set isDirty to true when form is invalid', async(() => {
    expect(location.path()).toBe('');

    component.simpleRegistrationForm.controls['email'].setValue('invalid@email');
    component.simpleRegistrationForm.controls['password'].setValue('12121');

    expect(component.simpleRegistrationForm.valid).toBeFalsy();
    expect(component.simpleRegistrationForm.controls['email'].errors.email).toBeTruthy();
    expect(component.simpleRegistrationForm.controls['password'].errors.minlength).toBeTruthy();

    component.createAccount();

    fixture.whenStable().then(() => {
      verify(accountLoginServiceMock.createUser(anything())).never();
      expect(location.path()).toBe('');
    });
  }));

  it('should navigate to homepage when user is created', async(() => {
    expect(location.path()).toBe('');

    component.simpleRegistrationForm.controls['email'].setValue('valid@email.com');
    component.simpleRegistrationForm.controls['password'].setValue('aaaaaa1');
    component.simpleRegistrationForm.controls['confirmPassword'].setValue('aaaaaa1');

    expect(component.simpleRegistrationForm.valid).toBeTruthy();

    component.createAccount();

    fixture.whenStable().then(() => {
      verify(accountLoginServiceMock.createUser(anything())).once();
      expect(location.path()).toBe('/home');
    });
  }));
});
