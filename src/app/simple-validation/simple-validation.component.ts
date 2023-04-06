import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule,ValidationErrors } from "@angular/forms";
import {
  ValidatorDirective,
  ValidatorRegistryService,
  VldntiControlDirective,
  createVestAdapter
} from "@validointi/core";
import { create, enforce, test } from "vest";
import { ValidationErrorHookUpDirective } from "../util/hookup.directive";

interface Model {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}


@Component({
  selector: "app-template-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ValidatorDirective,
    VldntiControlDirective,
    ValidationErrorHookUpDirective,
  ],
  templateUrl: "./simple-validation.component.html",
  styleUrls: ["./simple-validation.component.css"],
})
export class SimpleValidationComponent {
  model = { name: "", email: "", password: "", confirmPassword: "" };
  validator = async () => {
    let result:ValidationErrors = {}
    const m = this.model;
    if (m.name.length<3) {
      result['name'] = 'name must be at east 3 tokens';
    }
    if (m.password.length<3) {
      result['password'] ='pasword should have at least 3 letters';
    }

    if (m.password !== m.confirmPassword) {
      result['confirmPassword'] = 'Does not match password'
    }

    return result
  }
  #vr = inject(ValidatorRegistryService);
  validate = this.#vr.registerValidator(
    "sim[",
    // this.validator
    createVestAdapter(suite)
  );


  async onSubmit(data: any) {
    const validationResult = await this.validate(data);
    console.dir(validationResult);
  }
}


const suite = create((data: Model = {} as Model, field?: string) => {
  test("name", "Name is required", () => {
    enforce(data.name).isNotBlank();
  });

  test("name", "Name must be at least 3 characters long", () => {
    enforce(data.name).longerThan(2);
  });

  test("email", "Email is required", () => {
    enforce(data.email).isNotBlank();
  });
  test("email", () => {
    enforce(data.email)
      .message("Not an valid email address")
      .matches(/^[^@]+@[^@]+$/);
  });

  test("password", "Password is required", () => {
    enforce(data.password).isNotEmpty();
  });
  test("password", "Password is too short", () => {
    enforce(data.password).longerThan(2);
  });
  test("password", "Password is weak. maybe add a number", () => {
    enforce(data.password).matches(/[0-9]/);
    enforce(data.password).longerThanOrEquals(6);
  });

  test("confirmPassword", "Passwords do not match", () => {
    enforce(data.confirmPassword).equals(data.password);
  });
});
