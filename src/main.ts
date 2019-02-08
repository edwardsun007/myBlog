import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

/* starts Angular application in the browser
and launch the app with 'AppModule' included ( pass from app.module.ts)
*/
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
