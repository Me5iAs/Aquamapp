// const base = "http://localhost/aquamapp/";
const base = "backend/";
// 
export class api {    

  // Service 
  public static gServiceUrl : string =  base +  "gQuery.php";
  
  // Autenticidad
  public static gAuthUrl: string = base + "gSesions.php"

  // subir
  public static gSubirUrl: string = base +  "subirArchivo.php";

  // imagenes base de las fachadas de los clientes
  public static gImagenesClientes: string = base +  "imagenes/";
  

} 
