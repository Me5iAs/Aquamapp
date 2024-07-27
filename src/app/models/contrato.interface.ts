export interface contratoI {
  // atributos
  Id?: string;
  Fecha: string;
  Numero: string;
  IdVendedor: string;
  Vendedor: string;
  IdCliente: string;
  Cliente: string;
  TotalGarantia: string;
  TotalBotellones: string;
  Garantia?:garantiaI[];
  Botellones?: botellonesI[];
}

export interface garantiaI{
  IdGarantia?: string;
  IdVendedor?: string;
  Vendedor?:String;
  Recibo: string;
  Fecha: string;
  Garantia: string;
}

export interface botellonesI{
  Fecha: string; 
  Glosa: String;
  Prestamo: string;
  Total: string;
}