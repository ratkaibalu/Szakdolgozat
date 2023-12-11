import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SharedModule } from '../shared/shared.module';


export const AUTH_PROVIDERS = [
  AuthService,
  AuthGuard,
  AuthInterceptor
];

export const COMPONENTS = [
  LoginComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    ...AUTH_PROVIDERS
  ],
  exports: [...COMPONENTS],
})
export class AuthModule {

  constructor(@Optional() @SkipSelf() parentModule: AuthModule) {
    if (parentModule) {
        throw new Error(`${parentModule} has already been loaded. Import auth module in the AppModule only.`);
    }
  }

  static forRoot(): ModuleWithProviders<AuthModule> {
    return <ModuleWithProviders<AuthModule>>{
      ngModule: AuthModule,
      providers: [
        ...AUTH_PROVIDERS,
      ],
    };
  }
  
}
