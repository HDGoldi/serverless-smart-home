import { Component, Input, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-smart-table',
  template: `
      <ng2-smart-table [settings]="settings" [source]="source"></ng2-smart-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartTableComponent implements AfterViewInit {
  @Input() settings;
  @Input() source;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    /**
     * There is an issue with change detection in ng2-smart-table's.
     * We need to trigger it manually for the correct first time render.
     */
    Promise.resolve().then(() => this.cd.detectChanges());
  }
}
