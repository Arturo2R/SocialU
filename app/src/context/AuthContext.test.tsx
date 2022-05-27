import { StudentValidation } from "./AuthContext";

describe("Validación De Pertenencia Universitaria con correos", () => {
  test("Con un correo de un estudiante de la cuc", () => {
    expect(StudentValidation("paba@cuc.edu.co")).toBeFalsy();
  });
  test("Con un correo de un estudiante de la norte", () => {
    expect(StudentValidation("jpantojaj@uninorte.edu.co")).toBeTruthy();
  });
  test("Con mi correo arosenstielhl@uninorte.edu.co", () => {
    expect(StudentValidation("arosenstielhl@uninorte.edu.co")).toBeTruthy();
  });
  test("Con un correo de un estudiante de la norte", () => {
    expect(StudentValidation("dlizcano@uninorte.edu.co")).toBeTruthy();
  });
  test("Con un correo de un estudiante de la norte", () => {
    expect(StudentValidation("jcake@uninorte.edu.co")).toBeTruthy();
  });

  test("Con un correo de un estudiante de la norte", () => {
    expect(StudentValidation("valbertom@uninorte.edu.co")).toBeTruthy();
  });

  test("Con un correo de un estudiante de la norte", () => {
    expect(StudentValidation("rodomaestre@uninorte.edu.co")).toBeTruthy();
  });

  test("Con un correo de un estudiante de la norte", () => {
    expect(StudentValidation("laraluna@uninorte.edu.co")).toBeTruthy();
  });
  test("Con un correo de un estudiante de la norte", () => {
    expect(StudentValidation("jaimejaime@uninorte.edu.co")).toBeTruthy();
  });

  test("Con un correo de un estudiante de la cuc", () => {
    expect(StudentValidation("paba@cuc.edu.co")).toBeFalsy();
  });
  test("Con un correo de un estudiante Simon Bolivar", () => {
    expect(StudentValidation("mfarelo@unisimon.edu.co")).toBeFalsy();
  });
  test("Con un correo de un estudiante de la atlantico", () => {
    expect(StudentValidation("hissa@uniatlantico.edu.co")).toBeFalsy();
  });
});
