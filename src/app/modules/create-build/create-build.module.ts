import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateBuildComponent } from './create-build.component';
import { MatCardModule, MatButtonModule, MatProgressSpinnerModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { DataService } from '../../services/data.service';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  declarations: [CreateBuildComponent],
  exports: [CreateBuildComponent],
  providers: [DataService]
})
export class CreateBuildModule { }
