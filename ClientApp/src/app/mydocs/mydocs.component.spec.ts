import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MydocsComponent } from './mydocs.component';

describe('MydocsComponent', () => {
  let component: MydocsComponent;
  let fixture: ComponentFixture<MydocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MydocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MydocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
