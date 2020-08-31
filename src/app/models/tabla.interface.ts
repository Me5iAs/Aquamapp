export interface tablaI {
  Titulo?:string;
  Subtitulo?:string;
  Filtro:boolean;
  Procedimiento: string;
  Datos: string;
  Columnas: string[];
  Opciones?:opcionestablaI[];
}

export interface opcionestablaI{
  Icono: string;
  Funcion: any;
}
