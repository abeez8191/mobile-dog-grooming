import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PublicGroomer } from 'src/app/groomer/model/groomer.model';
import { GroomerService } from 'src/app/groomer/service/groomer-service';
import { BannerService } from 'src/app/shared/components/banner/banner.service';
import { SelectGroomer } from './select-groomer';

describe('SelectGroomer', () => {
  let component: SelectGroomer;
  let fixture: ComponentFixture<SelectGroomer>;
  let groomerServiceMock: {
    getPublicGroomers: ReturnType<typeof vi.fn>;
  };
  let bannerServiceMock: {
    open: ReturnType<typeof vi.fn>;
  };

  // Cast as PublicGroomer[] so the test compiles regardless of extra model fields
  const mockGroomers = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ] as unknown as PublicGroomer[];

  beforeEach(async () => {
    groomerServiceMock = {
      getPublicGroomers: vi.fn().mockReturnValue(of(mockGroomers)),
    };

    bannerServiceMock = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SelectGroomer],
      providers: [
        { provide: GroomerService, useValue: groomerServiceMock },
        { provide: BannerService, useValue: bannerServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectGroomer);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize groomers signal with an empty array before ngOnInit', () => {
    expect(component.groomers()).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('should fetch public groomers and populate the groomers signal', () => {
      fixture.detectChanges(); // Triggers ngOnInit

      expect(groomerServiceMock.getPublicGroomers).toHaveBeenCalledOnce();
      expect(component.groomers()).toEqual(mockGroomers);
      expect(bannerServiceMock.open).not.toHaveBeenCalled();
    });

    it('should handle an empty list returned from getPublicGroomers', () => {
      groomerServiceMock.getPublicGroomers.mockReturnValue(of([]));

      fixture.detectChanges();

      expect(groomerServiceMock.getPublicGroomers).toHaveBeenCalledOnce();
      expect(component.groomers()).toEqual([]);
      expect(bannerServiceMock.open).not.toHaveBeenCalled();
    });

    it('should open a warning banner when getPublicGroomers fails', () => {
      groomerServiceMock.getPublicGroomers.mockReturnValue(
        throwError(() => new Error('HTTP 500 Server Error'))
      );

      fixture.detectChanges();

      expect(groomerServiceMock.getPublicGroomers).toHaveBeenCalledOnce();
      expect(component.groomers()).toEqual([]);
      expect(bannerServiceMock.open).toHaveBeenCalledOnce();
      expect(bannerServiceMock.open).toHaveBeenCalledWith(
        'Unable to retrieve available groomers. Please try again later.',
        {
          icon: 'warning_outline',
          warning: true,
          timeout: 10000,
        }
      );
    });
  });

  describe('Output Emissions', () => {
    it('should emit the selected groomer ID when selectGroomer is called', () => {
      const selectSpy = vi.spyOn(component.select, 'emit');

      component.selectGroomer(42);

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy).toHaveBeenCalledWith(42);
    });
  });
});