import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AvailabilityDay } from './availability-day';

describe('AvailabilityDay', () => {
  let component: AvailabilityDay;
  let fixture: ComponentFixture<AvailabilityDay>;

  // Sample 30-minute interval slots for a future date
  const mockTimes: string[][] = [
    ['09:00:00', ''],
    ['09:30:00', ''],
    ['10:00:00', ''],
    ['10:30:00', 'X'], // Blocked
    ['11:00:00', ''],
    ['11:30:00', ''],
    ['12:00:00', ''],
    ['12:30:00', ''],
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityDay],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailabilityDay);
    component = fixture.componentInstance;

    // Set default required inputs
    fixture.componentRef.setInput('day', 'Monday');
    fixture.componentRef.setInput('availability', {
      date: '2099-05-15',
      times: mockTimes,
    });
    fixture.componentRef.setInput('duration', 30);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit and Date Validation', () => {
    it('should return empty times array if the availability date is in the past', () => {
      fixture.componentRef.setInput('availability', {
        date: '2000-01-01',
        times: mockTimes,
      });

      fixture.detectChanges();

      expect(component.isPastDate()).toBe(true);
      expect(component.filteredAvailability()).toEqual({
        date: '2000-01-01',
        times: [],
      });
    });

    it('should treat today as a past date due to end-of-day comparison', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 4, 15, 10, 0, 0)); // May 15, 2026 10:00 AM

      fixture.componentRef.setInput('availability', {
        date: '2026-05-15',
        times: mockTimes,
      });

      expect(component.isPastDate()).toBe(true);
    });

    it('should populate filteredAvailability when the date is in the future', () => {
      fixture.detectChanges();

      expect(component.isPastDate()).toBe(false);
      expect(component.filteredAvailability()?.date).toBe('2099-05-15');
      expect(component.filteredAvailability()?.times.length).toBeGreaterThan(0);
    });

    it('should populate filteredAvailability when the date is at least tomorrow', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2099, 4, 14, 23, 59, 59)); // May 14, 2099 11:59:59 PM

      fixture.detectChanges();

      expect(component.isPastDate()).toBe(false);
      expect(component.filteredAvailability()?.date).toBe('2099-05-15');
      expect(component.filteredAvailability()?.times.length).toBeGreaterThan(0);
    });
  });

  describe('filterAvailability & getNextAvailableWindow', () => {
    it('should filter valid start times for a 30-minute duration (2 slots required)', () => {
      // Duration 30 => Math.ceil(30 / 30) + 1 = 2 consecutive free slots required
      fixture.componentRef.setInput('duration', 30);
      fixture.detectChanges();

      // Valid windows of 2 free slots:
      // 09:00 (09:00 & 09:30 free)
      // 09:30 (09:30 & 10:00 free)
      // 11:00 (11:00 & 11:30 free)
      // 11:30 (11:30 & 12:00 free)
      // 12:00 (12:00 & 12:30 free)
      expect(component.filteredAvailability()?.times).toEqual([
        '09:00:00',
        '09:30:00',
        '11:00:00',
        '11:30:00',
        '12:00:00'
      ]);
    });

    it('should filter valid start times for a 60-minute duration (3 slots required)', () => {
      // Duration 60 => Math.ceil(60 / 30) + 1 = 3 consecutive free slots required
      fixture.componentRef.setInput('duration', 60);
      fixture.detectChanges();

      // Valid windows of 3 free slots:
      // 09:00 (09:00, 09:30, 10:00 free)
      // 11:00 (11:00, 11:30, 12:00 free)
      // 11:30 (11:30, 12:00, 12:30 free)
      expect(component.filteredAvailability()?.times).toEqual([
        '09:00:00',
        '11:00:00',
        '11:30:00',
      ]);
    });

    it('should return test', () => {
      const availability = {
        "date":"2026-11-27",
        "times":[
          ["08:00:00",""],["08:30:00",""],["09:00:00",""],["09:30:00",""],
          ["10:00:00","X"],["10:30:00","X"],["11:00:00",""],["11:30:00",""],
          ["12:00:00",""],["12:30:00",""],["13:00:00",""],["13:30:00",""],
          ["14:00:00",""],["14:30:00",""],["15:00:00",""],["15:30:00",""],
          ["16:00:00",""],["16:30:00",""],["17:00:00",""]
        ]
      };

      fixture.componentRef.setInput("availability", availability);
      fixture.componentRef.setInput("duration", 30);

      fixture.detectChanges();
      expect(component.filteredAvailability()?.times).toEqual([
        "08:00:00", "08:30:00", "09:00:00", "11:00:00", "11:30:00",
        "12:00:00", "12:30:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00", 
        "15:00:00", "15:30:00", "16:00:00", "16:30:00"
      ])
    })

    it('should check nextAvailabileWindow', () => {
      let times = [
        ['1', ''],
        ['2', 'X'],
        ['3', ''],
        ['4', ''],
        ['5', 'X'],
        ['6', ''],
        ['7', ''],
        ['8', ''],
        ['9', 'X']
      ];

      expect(component.getNextAvailableWindow(times, 0, 2)).toEqual(3)
      expect(component.getNextAvailableWindow(times, 0, 3)).toEqual(7)
      expect(component.getNextAvailableWindow(times, 5, 3)).toEqual(7);
      expect(component.getNextAvailableWindow(times, 0, 1)).toEqual(0);
      expect(component.getNextAvailableWindow(times, 0, 4)).toBeUndefined();
    })

    it('should return an empty array if no contiguous window is large enough', () => {
      // Duration 120 => 5 consecutive slots required (none exist in mockTimes)
      fixture.componentRef.setInput('duration', 120);
      fixture.detectChanges();

      expect(component.filteredAvailability()?.times).toEqual([]);
    });

    it('should handle all slots being unavailable', () => {
      fixture.componentRef.setInput('availability', {
        date: '2099-05-15',
        times: [
          ['09:00:00', 'X'],
          ['09:30:00', 'X'],
          ['10:00:00', 'X'],
        ],
      });
      fixture.detectChanges();

      expect(component.filteredAvailability()?.times).toEqual([]);
    });
  });

  describe('Formatting and Helper Methods', () => {
    it('should format morning, noon, and afternoon times properly', () => {
      expect(component.formatTime('09:05:00')).toBe('09:05 AM');
      expect(component.formatTime('11:30:00')).toBe('11:30 AM');
      expect(component.formatTime('12:00:00')).toBe('12:00 PM');
      expect(component.formatTime('13:45:00')).toBe('1:45 PM');
      expect(component.formatTime('23:00:00')).toBe('11:00 PM');
    });

    it('should format calendar day with short month name and zero-padded day', () => {
      fixture.componentRef.setInput('availability', {
        date: '2099-03-05',
        times: [],
      });
      expect(component.getCalendarDay()).toBe('Mar 05');

      fixture.componentRef.setInput('availability', {
        date: '2099-12-25',
        times: [],
      });
      expect(component.getCalendarDay()).toBe('Dec 25');
    });
  });

  describe('Output Emissions', () => {
    it('should emit a valid Date object when chooseTime is called', () => {
      const selectSpy = vi.spyOn(component.select, 'emit');

      component.chooseTime('2099-05-15', '14:30:00');

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy).toHaveBeenCalledWith(
        new Date(2099, 4, 15, 14, 30, 0) // Month is 0-indexed (4 = May)
      );
    });
  });
});