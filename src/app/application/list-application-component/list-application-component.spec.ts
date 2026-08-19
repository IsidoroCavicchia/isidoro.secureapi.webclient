import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApplicationComponent } from './list-application-component';

describe('ListApplicationComponent', () => {
  let component: ListApplicationComponent;
  let fixture: ComponentFixture<ListApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListApplicationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListApplicationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
