export interface movimientoI {
  // atributos
  Id: string;
  Fecha: Date;
  Usuario: string;
  IdCat:string;
  Categoria: string;
  Glosa: string;
  Tipo: string;
  Monto: number;  
  // metodos y data
  Accion: "Nuevo" | "Info";
  Categorias: [];
  
}