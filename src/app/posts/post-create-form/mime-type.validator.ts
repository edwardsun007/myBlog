import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of} from 'rxjs';

/* async function return either Promise or Observable type
  Promise will have property which is string type
  value of the property will be anything
*/
export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
  if (typeof(control.value) === 'string') {
    // of is a quick and easy way to emit object in rxjs
    return of(null); // when its string , this means its valid to us developer, so we simply want the validator to be valid.
  }
  const file = control.value as File;  // cast as File type
  const fileReader = new FileReader();
  const fileObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
    // create our file observable with the create method， argument is observer which has string type property with value of anything
    fileReader.addEventListener('loadend', () => {
      console.log('loadend listener starts...');
      const arr = new Uint8Array(<ArrayBuffer>fileReader.result).subarray(0, 4); // type casting to avoid ts error
      console.log(arr);
      let header = '';
      let isValid = false; // flag
      for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16); // convert it to hex decimal string
          // this is hex value of file extention
          // eg FFD8FFE0 stands for JPE, https://www.filesignatures.net/index.php?page=search&search=FFD8FFE0&mode=SIG
      }
      switch (header) {
        case '89504e47':
          isValid = true;
          break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }
      if (isValid) {
        observer.next(null); // is file valid, emit null / return null
      } else {
        observer.next({invalidMimeType: true }); // you can emit any type
      }
      observer.complete(); // tell observer we are done with mime-type validate
      // 8 bit unsigned interger because user might upload type like pdf, and we
      // have to look into the file to infer the file type
    });
    console.log('before convert to arrayBuffer');
    fileReader.readAsArrayBuffer(file); // need to readAsArrayBuffer for mime type
  });
  return fileObs; // return our validated file Observerable
};
