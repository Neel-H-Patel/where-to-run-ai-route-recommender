import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchRoutesComponent } from './fetch-routes.component';

describe('FetchRoutesComponent', () => {
  let component: FetchRoutesComponent;
  let fixture: ComponentFixture<FetchRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FetchRoutesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FetchRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
