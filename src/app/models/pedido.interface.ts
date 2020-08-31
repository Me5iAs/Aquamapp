export interface PedidoI {
  Id: Number,
  IdCliente: number,
  Cliente: string,
  Fecha: string,
  Tipo: string,
  Precio: number,
  BotVendidos: number,
  BotNewPrestado: number,
  BotOldPrestado: number,
  Promocion: boolean
}
