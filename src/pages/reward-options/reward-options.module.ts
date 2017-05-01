import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RewardOptions } from './reward-options';

@NgModule({
  declarations: [
    RewardOptions,
  ],
  imports: [
    IonicPageModule.forChild(RewardOptions),
  ],
  exports: [
    RewardOptions
  ]
})
export class RewardOptionsModule {}
