import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MydocsAddComponent } from './mydocs-add.component';

describe('MydocsAddComponent', () => {
  let component: MydocsAddComponent;
  let fixture: ComponentFixture<MydocsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MydocsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MydocsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
