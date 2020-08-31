export interface clienteI {
  Id: string;
  Nombre: string;
  RUC: string;
  DNI: string;
  Direccion: string;
  Referencia: string;
  Telefono: string;  
  Accion: "Info"|"Editar"|"Eliminar"|"Nuevo";
  Contrato: string;
}