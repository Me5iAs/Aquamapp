export interface UsuarioI {
  Id: Number,
  Usuario: string,
  Clave: string,
  Tipo: string,
  CodTipo: string,
  Nombre: string,
  FechaNac: string,
  Telefono: string,
  Direccion: string,
  FechaInicio: string,
  Accion: "Nuevo" | "Edit";
}
