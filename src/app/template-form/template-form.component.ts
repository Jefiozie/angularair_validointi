import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ValidatorDirective, VldntiControlDirective } from '@validointi/core';
import { SampleData, SampleDataService } from '../sample-data.service';
import { ValidationErrorHookUpDirective } from '../util/hookup.directive';
import { ContactsComponent } from './contacts/contacts.component';
import { TagsComponent } from './tags-component/tags.component';


@Component({
  standalone: true,
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ValidatorDirective,
    VldntiControlDirective,
    ValidationErrorHookUpDirective,
    TagsComponent,
    ContactsComponent,
  ],
})
export class TemplateFormComponent  {
  #sds = inject(SampleDataService);
  data$ = this.#sds.getById('1');
  fieldValidation = true;

  submit(data: SampleData) {
    console.table(data)
    this.#sds
      .save(data)
      .catch((e): void => { })
      .then(() => console.info('Yes!'));
  }

  async inspect(data: SampleData, form: NgForm, ev: Event) {
    Object.entries(form.controls).forEach(([key, control]) => {
      control.updateValueAndValidity();
    });
    ev.preventDefault();
  }

  async clear(data: SampleData, form: NgForm, ev: Event) {
    clearObject(data);
    Object.entries(form.controls).forEach(([key, control]) => {
      control.clearAsyncValidators();
      control.clearValidators();
      control.markAsUntouched();
      control.updateValueAndValidity();
    });
    ev.preventDefault();
  }

  async reset(data: SampleData, form: NgForm) {
    this.data$ = this.#sds.getById('1');
  }
}
























export const clearObject = (obj: any) => {
  for (const key of Object.keys(obj)) {
    if (key === 'id')
      continue;
    if (Array.isArray(obj[key])) {
      obj[key].forEach((item: any, index: number, a: any[]) => { a[index] = undefined; });
      obj[key].length = 0; // throw away all the items
      obj[key] = []; // replace with a new reference to a new array
    } else if (obj[key] instanceof Object) {
      clearObject(obj[key]);
    } else {
      obj[key] = undefined;
    }
  }
};