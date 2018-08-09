import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { MomentModule } from 'ngx-moment';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ChatPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
    MomentModule,
    PipesModule
  ],
})
export class ChatPageModule {}
