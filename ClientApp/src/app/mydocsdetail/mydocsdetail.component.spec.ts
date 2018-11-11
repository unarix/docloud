import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MydocsdetailComponent } from './mydocsdetail.component';

describe('MydocsdetailComponent', () => {
  let component: MydocsdetailComponent;
  let fixture: ComponentFixture<MydocsdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MydocsdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MydocsdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
