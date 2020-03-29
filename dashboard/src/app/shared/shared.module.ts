import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartTableComponent } from './components/smart-table.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [SmartTableComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule
  ],
  exports: [SmartTableComponent, Ng2SmartTableModule]
})
export class SharedModule { }
