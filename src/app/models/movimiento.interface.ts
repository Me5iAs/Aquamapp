export interface movimientoI {
  // atributos
  Id: string;
  Fecha: Date;
  Usuario: string;
  IdCat:string;
  IdRef:string;
  Categoria: string;
  Glosa: string;
  Tipo: string;
  Monto: number;  
  CajaGeneral: boolean | string;
  // metodos y data
  Accion: "Nuevo" | "Info";
  Categorias: [];
  
}

export interface cantidadesI{
  Id: string,
  Cantidad: number,
  Precio: string,
  CantidadPaq: number,
  PrecioPaq: string,
  Comentario: string
}