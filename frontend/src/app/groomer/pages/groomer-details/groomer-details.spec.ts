import { Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GroomerDetails } from './groomer-details';
import { AvailabilityDay } from '../../components/availability-day/availability-day';
import { PhotoSelector } from '../../components/photo-selector/photo-selector';
import { LoadingButton } from 'src/app/shared/components/loading-button/loading-button';
import { GroomerService } from '../../service/groomer-service';
import { AuthenticationService } from 'src/app/authentication/service/authentication-service';
import { BannerService } from 'src/app/shared/components/banner/banner.service';
import { Groomer } from '../../model/groomer.model';
import { FormControl } from '@angular/forms';

// Lightweight child component stubs to isolate GroomerDetails
@Component({ selector: 'app-availability-day', template: '' })
class MockAvailabilityDay {
  readonly day = input('day');
  form = input.required<FormControl>();
}

@Component({ selector: 'app-photo-selector', template: '' })
class MockPhotoSelector {
  photoUpload = output<string|ArrayBuffer>();
  initialPhoto = input<string|undefined>(undefined);
}

@Component({ selector: 'app-loading-button', template: '' })
class MockLoadingButton {
  isLoading = input<boolean>();
}

describe('GroomerDetails', () => {
  let component: GroomerDetails;
  let fixture: ComponentFixture<GroomerDetails>;

  let locationMock: { back: ReturnType<typeof vi.fn> };
  let routerMock: {
    currentNavigation: ReturnType<typeof vi.fn>;
    navigate: ReturnType<typeof vi.fn>;
  };
  let activatedRouteMock: Partial<ActivatedRoute>;
  let groomerServiceMock: {
    getGroomer: ReturnType<typeof vi.fn>;
    addGroomer: ReturnType<typeof vi.fn>;
    updateGroomer: ReturnType<typeof vi.fn>;
  };
  let authServiceMock: {
    createGroomer: ReturnType<typeof vi.fn>;
  };
  let bannerServiceMock: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockExistingGroomer = {
    id: 7,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    phoneNumber: '5551234567',
    biography: 'Experienced pet stylist.',
    photoData: 'data:image/png;base64',
    photo: 'abc123base64',
    availability: {
      mon: { start: '09:00', end: '17:00' },
      wed: { start: '12:30', end: '18:15' },
    },
  } as unknown as Groomer;

  beforeEach(async () => {
    locationMock = { back: vi.fn() };
    routerMock = {
      currentNavigation: vi.fn().mockReturnValue(null),
      navigate: vi.fn(),
    };
    activatedRouteMock = {};
    groomerServiceMock = {
      getGroomer: vi.fn().mockReturnValue(of(mockExistingGroomer)),
      addGroomer: vi.fn().mockReturnValue(of({ ...mockExistingGroomer, id: 99 })),
      updateGroomer: vi.fn().mockReturnValue(of(mockExistingGroomer)),
    };
    authServiceMock = {
      createGroomer: vi.fn().mockReturnValue(of({})),
    };
    bannerServiceMock = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [GroomerDetails],
      providers: [
        { provide: Location, useValue: locationMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: GroomerService, useValue: groomerServiceMock },
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: BannerService, useValue: bannerServiceMock },
      ],
    })
      .overrideComponent(GroomerDetails, {
        remove: { imports: [AvailabilityDay, PhotoSelector, LoadingButton] },
        add: { imports: [MockAvailabilityDay, MockPhotoSelector, MockLoadingButton] },
      })
      .compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(GroomerDetails);
    component = fixture.componentInstance;
  }

  describe('Initialization (Create vs. Edit Mode)', () => {
    it('should initialize in create mode with empty form when no router state is present', () => {
      createComponent();
      fixture.detectChanges(); // triggers ngOnInit

      expect(component.isEdit()).toBe(false);
      expect(component.groomerId).toBeUndefined();
      expect(groomerServiceMock.getGroomer).not.toHaveBeenCalled();
      expect(component.formReady()).toBe(true);
      expect(component.groomerForm.get('firstName')?.value).toBe('');
      expect(component.groomerForm.valid).toBe(false);
    });

    it('should initialize in edit mode and populate form when router navigation state has an id', () => {
      routerMock.currentNavigation.mockReturnValue({
        extras: { state: { id: 7 } },
      });

      createComponent();
      fixture.detectChanges();

      expect(component.isEdit()).toBe(true);
      expect(component.groomerId).toBe(7);
      expect(groomerServiceMock.getGroomer).toHaveBeenCalledWith(7);
      expect(component.formReady()).toBe(true);

      // Verify mapped form values
      expect(component.groomerForm.get('firstName')?.value).toBe('Jane');
      expect(component.groomerForm.get('email')?.value).toBe('jane@example.com');
      expect(component.groomerForm.get('photo')?.value).toBe('data:image/png;base64,abc123base64');
      expect(component.groomerForm.get('availability.mon')?.value).toEqual(['9:00 AM', '5:00 PM']);
      expect(component.groomerForm.get('availability.wed')?.value).toEqual(['12:30 PM', '6:15 PM']);
      expect(component.groomerForm.get('availability.sun')?.value).toEqual([]);
    });
  });

  describe('Form Validation & Helpers', () => {
    beforeEach(() => {
      createComponent();
      fixture.detectChanges();
    });

    it('should require firstName, lastName, email, phoneNumber, bio, and photo', () => {
      expect(component.groomerForm.valid).toBe(false);

      component.groomerForm.patchValue({
        firstName: 'Sam',
        lastName: 'Smith',
        email: 'sam@example.com',
        phoneNumber: '4025551234',
        bio: 'Loves dogs',
        photo: 'data:image/jpeg;base64,xyz987',
      });

      expect(component.groomerForm.valid).toBe(true);
    });

    it('should invalidate malformed email addresses', () => {
      const emailCtrl = component.getFormControl('email');
      emailCtrl.setValue('not-an-email');
      expect(emailCtrl.valid).toBe(false);

      emailCtrl.setValue('valid@example.com');
      expect(emailCtrl.valid).toBe(true);
    });

    it('should update photo control via updatePhoto()', () => {
      component.updatePhoto('data:image/png;base64,newPhotoData');
      expect(component.groomerForm.get('photo')?.value).toBe('data:image/png;base64,newPhotoData');
    });

    it('should navigate back via Location when cancelAdd() is called', () => {
      component.cancelAdd();
      expect(locationMock.back).toHaveBeenCalledOnce();
    });

    it('should return typed FormControl via getFormControl()', () => {
      const ctrl = component.getFormControl('firstName');
      expect(ctrl).toBe(component.groomerForm.get('firstName'));
    });
  });

  describe('Time Conversion Helpers', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should convert 24-hour times to 12-hour format', () => {
      expect(component.convert24HourTo12Hour('00:30')).toBe('12:30 AM');
      expect(component.convert24HourTo12Hour('09:15')).toBe('9:15 AM');
      expect(component.convert24HourTo12Hour('12:00')).toBe('12:00 PM');
      expect(component.convert24HourTo12Hour('15:45')).toBe('3:45 PM');
    });

    it('should convert 12-hour times to 24-hour format', () => {
      expect(component.convert12HourTo24Hour('9:15 AM')).toBe('9:15');
      expect(component.convert12HourTo24Hour('12:00 PM')).toBe('12:00');
      expect(component.convert12HourTo24Hour('3:45 PM')).toBe('15:45');
    });

    it('should convert availability map to 24-hour format with resolved timezone', () => {
      const result = component.updateAvailabilityTimesTo24Hr({
        mon: { start: '8:00 AM', end: '4:30 PM' },
      });

      expect(result.timezone).toBe(Intl.DateTimeFormat().resolvedOptions().timeZone);
      expect(result.mon).toEqual({ start: '8:00', end: '16:30' });
      expect(result.tue).toBeUndefined();
    });
  });

  describe('submitForm() - Create Mode', () => {
    beforeEach(() => {
      createComponent();
      fixture.detectChanges();
    });

    it('should not submit if the form is invalid', () => {
      component.submitForm();

      expect(component.isLoading()).toBe(false);
      expect(groomerServiceMock.addGroomer).not.toHaveBeenCalled();
    });

    it('should call addGroomer then authenticationService.createGroomer and navigate on success', () => {
      component.groomerForm.patchValue({
        firstName: 'Alex',
        lastName: 'Smith',
        email: 'alex@example.com',
        phoneNumber: '4025559876',
        bio: 'Cat specialist',
        photo: 'data:image/png;base64,imgPayload',
        password: 'SecretPassword123',
      });
      component.groomerForm.get('availability.tue')?.setValue(['10:00 AM', '2:00 PM']);

      component.submitForm();

      expect(groomerServiceMock.addGroomer).toHaveBeenCalledOnce();
      const submittedGroomer = groomerServiceMock.addGroomer.mock.calls[0][0];
      expect(submittedGroomer).toMatchObject({
        firstName: 'Alex',
        lastName: 'Smith',
        email: 'alex@example.com',
        phoneNumber: '4025559876',
        biography: 'Cat specialist',
        photoData: 'data:image/png;base64',
        photo: 'imgPayload',
      });
      expect(submittedGroomer.availability.tue).toEqual({ start: '10:00', end: '14:00' });

      expect(authServiceMock.createGroomer).toHaveBeenCalledWith({
        email: 'jane@example.com', // from addGroomer response
        groomer: 99,
        password: 'SecretPassword123',
      });

      expect(routerMock.navigate).toHaveBeenCalledWith(['..'], {
        relativeTo: activatedRouteMock,
      });
    });

    it('should reset isLoading and open error banner when creation fails', () => {
      groomerServiceMock.addGroomer.mockReturnValue(
        throwError(() => new Error('Create failed'))
      );

      component.groomerForm.patchValue({
        firstName: 'Alex',
        lastName: 'Smith',
        email: 'alex@example.com',
        phoneNumber: '4025559876',
        bio: 'Cat specialist',
        photo: 'data:image/png;base64,imgPayload',
      });

      component.submitForm();

      expect(component.isLoading()).toBe(false);
      expect(bannerServiceMock.open).toHaveBeenCalledWith(
        'Unable to create groomer account',
        {
          icon: 'error_outline',
          error: true,
          timeout: 10000,
        }
      );
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });

  describe('submitForm() - Edit Mode', () => {
    beforeEach(() => {
      routerMock.currentNavigation.mockReturnValue({
        extras: { state: { id: 7 } },
      });
      createComponent();
      fixture.detectChanges();
    });

    it('should call updateGroomer with id and navigate on success', () => {
      component.groomerForm.patchValue({
        firstName: 'Janet',
      });

      component.submitForm();

      expect(groomerServiceMock.updateGroomer).toHaveBeenCalledOnce();
      const updatedPayload = groomerServiceMock.updateGroomer.mock.calls[0][0];
      expect(updatedPayload.id).toBe(7);
      expect(updatedPayload.firstName).toBe('Janet');
      expect(authServiceMock.createGroomer).not.toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['..'], {
        relativeTo: activatedRouteMock,
      });
    });

    it('should reset isLoading and open error banner when updateGroomer fails', () => {
      groomerServiceMock.updateGroomer.mockReturnValue(
        throwError(() => new Error('Update failed'))
      );

      component.submitForm();

      expect(component.isLoading()).toBe(false);
      expect(bannerServiceMock.open).toHaveBeenCalledWith(
        'Unable to update groomer',
        {
          icon: 'error_outline',
          error: true,
          timeout: 10000,
        }
      );
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });
});