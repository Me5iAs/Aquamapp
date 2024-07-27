/*
quiero que las lineas de las rutas sean de diferentes colores
*/

import { Component, ViewChild, AfterViewInit, OnInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
// import "leaflet-arrowheads";


import { gQueryService } from 'src/app/services/g-query.service';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioI } from 'src/app/models/usuario.interface';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import { api } from 'src/app/services/g-constantes.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mapapedidos',
  templateUrl: './mapapedidos.component.html',
  styleUrls: ['./mapapedidos.component.css']
})

export class MapapedidosComponent implements AfterViewInit {

  // Variables de mapa
  private map: L.Map;
  private clientes = [];
  private routeControl: any;
  private intervalId: any;
  private markers: L.Marker[] = [];
  routeData: any[][] = [];
  public TodoMostrado = false;
  rutas = [];
  ruta = {}
  instructions: [] = [];



  // Variables de la tabla 
  displayedColumns: string[] = ['Nro', 'Cliente', 'Borrar'];
  dataSource = new MatTableDataSource();


  // ViewChild
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('mapContainer') mapContainer;
  public userData: UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));


  constructor(
    private gQuery: gQueryService,
    private router: Router,
    public dialog: MatDialog,
    private location: Location
  ) { }

  ngOnInit(): void {
    (window as any).mostrarImagen = this.mostrarImagen.bind(this);
  }

  ngAfterViewInit() {
    // Cargar el mapa cuando el tab está listo
    this.intervalId = setInterval(() => {
      const el: HTMLElement = document.querySelector("mat-tab-body");
      if (el) {
        clearInterval(this.intervalId);
        this.initMap();
      }
    }, 500);
  }

  private addPlantaMarker() {
    this.clientes.push({
      Id: -1,
      Idcliente: -1,
      Cliente: "Planta",
      Direccion: "Petroperú H17",
      Referencia: "Participación Cdra.10",
      Latitud: -3.7722102000000004,
      Longitud: -73.26553229999999,
      Bot: 0,
      Paq: 0,
      Estado: -1
    });
  }

  private initMap(): void {
    const target = document.getElementById('cargando_principal');
    target.style.display = "block";
    const UsuarioI = JSON.parse(sessionStorage.getItem("dataUser"));

    this.addPlantaMarker();

    this.gQuery.sql("sp_pedidos_enviados_no_reportados", UsuarioI.Id).subscribe((data: any[]) => {
      target.style.display = "none";
      if (data == null) {
        this.dataSource = null;
        alert("no se encuentran pedidos");
        this.location.back();
        return;
      }
      this.setupTable(data);
      this.setupMap();
      // this.addMarkers();
      // this.setupRouting();
      this.optimizeAndSetupRouting();
      // this.addMarkerClickEvents();  
    });
  }

  // setup tabla
  private setupTable(data: any[]): void {
    if (data == null) {
      this.dataSource = null;
      alert("no se encuentran pedidos");
      this.location.back();

    } else {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // console.log(this.dataSource);

      data.forEach(item => {
        this.clientes.push({
          Id: item.Id,
          IdCliente: item.IdCliente,
          Cliente: item.Cliente,
          Direccion: item.Direccion,
          Referencia: item.Referencia,
          Latitud: item.Latitud,
          FechaPide: item.FechaPide,
          HoraEnvio: item.HoraEnvio,
          Longitud: item.Longitud,
          Bot: item.Cantidad,
          Paq: item.CantidadPaq,
          Estado: item.EstadoPedido
        });
      });
      this.addPlantaMarker();
      // console.log(this.clientes);
    }
  }

  // SetupMap
  private setupMap(): void {
    this.map = L.map('map', { center: [this.clientes[0].Latitud, this.clientes[0].Longitud], zoom: 10 });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.off('click'); // Desactivar el evento de clic en el mapa
  }

  // Agregar marcadores
  private addMarkers(): void {
    const existingMarkers = new Map();

    this.clientes.forEach((cliente, index) => {

      const markerKey = `${cliente.Latitud}-${cliente.Longitud}`;

      if (!existingMarkers.has(markerKey)) {
        const homeIcon = L.icon({
          iconUrl: '../../../assets/marker_home.png',
          iconSize: [25.5, 35],
          iconAnchor: [12, 25],
          popupAnchor: [1, -24],
          shadowSize: [41, 41]
        })
        const pendingIcon = L.icon({
          iconUrl: '../../../assets/marker_pend'+ index + '.png', // Ruta al icono de pendientes
          iconSize: [25.5, 35],
          iconAnchor: [12, 32],
          popupAnchor: [1, -24],
          shadowSize: [41, 41]
        });
        const visitedIcon = L.icon({
          iconUrl: '../../../assets/marker_ok' + index +'.png', // Ruta al icono de visitados
          iconSize: [25.5, 35],
          iconAnchor: [12, 32],
          popupAnchor: [-4, -20],
          shadowSize: [41, 41]
        });
        const rejectIcon = L.icon({
          iconUrl: '../../../assets/marker_error' + index +  '.png', // Ruta al icono de visitados
          iconSize: [25.5, 35],
          iconAnchor: [12, 21],
          popupAnchor: [-4, -20],
          shadowSize: [41, 41]
        });

        // Let icon;
        let icon;
        if (cliente.Estado == "-1") {
          icon = homeIcon;
        } else if (cliente.Estado == "3") {
          icon = pendingIcon;
        } else if (cliente.Estado == "4") {
          icon = visitedIcon;
        } else if (cliente.Estado == "5") {
          icon = rejectIcon;
        }


        // let icon = cliente.Estado === 'visitado' ? visitedIcon : pendingIcon;
        let marker = L.marker([cliente.Latitud, cliente.Longitud], { icon, draggable: false }).addTo(this.map);

        const popupContent = this.createPopupContent(cliente, index);
        marker.bindPopup(popupContent, {
          // closeOnClick: false,
          autoClose: false
        })

        marker.on("click", (e) => {

          const clickedMarker = e.target;
    
         
          if (clickedMarker.isPopupOpen()) {
            clickedMarker.closePopup();
          } else {
            clickedMarker.openPopup();
          }
        });

        this.markers.push(marker);
      }

    });
    this.addMarkerClickEvents(); 
  }

  private createPopupContent(cliente: any, index: number): HTMLElement {
    const div = document.createElement('div');
    div.style.fontSize = '11px';

    const clienteInfo = document.createElement('b');
    
    const icon = document.createElement('img');
    icon.style.width ="10px"
    icon.style.left = "5px"
    
    if(cliente.Estado ==4){
      icon.src = "assets/check.png";
    }else if(cliente.Estado ==5){
      icon.src = "assets/error.png";
    }

    clienteInfo.textContent =  cliente.Cliente;
    clienteInfo.appendChild(icon)

    div.appendChild(clienteInfo);

    if (cliente.Bot > 0 && cliente.Paq > 0) {
      const botPaqInfo = document.createElement('div');
      botPaqInfo.textContent = ` ${cliente.Bot} Bot y ${cliente.Paq} Paq`;
      div.appendChild(botPaqInfo);
    } else if (cliente.Bot > 0) {
      const botInfo = document.createElement('div');
      botInfo.textContent = ` ${cliente.Bot} Bot`;
      div.appendChild(botInfo);
    } else if (cliente.Paq > 0) {
      const paqInfo = document.createElement('div');
      paqInfo.textContent = ` ${cliente.Paq} Paq`;
      div.appendChild(paqInfo);
    }
    if(cliente.Estado != 5 && cliente.Estado !=4){
      const direccionInfo = document.createElement('div');
      direccionInfo.textContent = ` ${cliente.Direccion}- ${cliente.Referencia}`;
      div.appendChild(direccionInfo);
    }




    if (cliente.Id != "-1" && cliente.Estado != 5 && cliente.Estado !=4) {
      const imageLink = document.createElement('a');
      imageLink.href = '#';
      imageLink.innerHTML = `<img src='../../../../assets/foto_icon.png' style='width: 20px; height:20px' />`;
      imageLink.style.display = "inline-block";
      imageLink.style.width = "33%";
      imageLink.style.textAlign = "center";
      imageLink.style.marginTop = "5px"
      imageLink.onclick = (event) => {
        event.preventDefault();
        this.mostrarImagen(cliente.IdCliente);
      };
      div.appendChild(imageLink);

      const atenderLink = document.createElement('a');
      // imageLink.innerHTML = `<img src='../../../../assets/foto_icon.png' style='width: 20px; height:20px' />`;

      atenderLink.href = `#/atencion/${cliente.Id}`;
      atenderLink.innerHTML = `<img src='../../../../assets/atender_icon.png' style='width: 20px; height:20px' />`;
      atenderLink.style.display = "inline-block";
      atenderLink.style.width = "33%";
      atenderLink.style.textAlign = "center";
      atenderLink.style.marginTop = "5px"

      div.appendChild(atenderLink);

      const cancelLink = document.createElement("a");
      cancelLink.href = "#";
      cancelLink.textContent = "Cancelar"
      cancelLink.innerHTML = `<img src='../../../../assets/cancelar_icon.png' style='width: 20px; height:20px' />`;
      cancelLink.style.display = "inline-block";
      cancelLink.style.width = "33%";
      cancelLink.style.textAlign = "center";
      cancelLink.style.marginTop = "5px"
      cancelLink.onclick = (event) => {
        event.preventDefault();
        this.onDelPedido(cliente.Id);
      };
      div.appendChild(cancelLink);
    }

    return div;
  }

  // optimizar ruta 
  private optimizeAndSetupRouting(): void {
    const waypoints = this.clientes.map(cliente => `${cliente.Longitud},${cliente.Latitud}`).join(';').replace(/\s+/g, '');
    const osrmUrl = `https://router.project-osrm.org/trip/v1/driving/${waypoints}?source=first&destination=last&roundtrip=false`;
  
    console.log(osrmUrl);
  
    fetch(osrmUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Response data:', data);
  
        if (!data.trips || data.trips.length === 0) {
          throw new Error('No trips found in the response');
        }
  
        if (!data.waypoints || data.waypoints.length === 0) {
          throw new Error('No waypoints found in the response');
        }
  
        // Helper function to calculate the distance between two points (Haversine formula)
        function getDistance(lat1, lon1, lat2, lon2) {
          const R = 6371e3; // metres
          const φ1 = lat1 * Math.PI/180;
          const φ2 = lat2 * Math.PI/180;
          const Δφ = (lat2 - lat1) * Math.PI/180;
          const Δλ = (lon2 - lon1) * Math.PI/180;
  
          const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
          return R * c; // in metres
        }
  
        // Reorganizar los clientes según los waypoints optimizados
        const sortedClientes = data.waypoints
          .sort((a, b) => a.waypoint_index - b.waypoint_index)
          .map(waypoint => {
            const location = waypoint.location;
            if (!location || location.length < 2) {
              throw new Error('Invalid waypoint location data');
            }
            // Find the closest matching client
            let closestClient = null;
            let minDistance = Infinity;
            this.clientes.forEach(cliente => {
              const distance = getDistance(location[1], location[0], parseFloat(cliente.Latitud), parseFloat(cliente.Longitud));
              if (distance < minDistance) {
                minDistance = distance;
                closestClient = cliente;
              }
            });
            return closestClient;
          });
  
        // Actualizar this.clientes con el orden reorganizado
        this.clientes = sortedClientes;
  
        // Configurar la ruta con los waypoints optimizados
        const optimizedWaypoints = sortedClientes.map(cliente => L.latLng(cliente.Latitud, cliente.Longitud));
  
        this.routeControl = L.Routing.control({
          waypoints: optimizedWaypoints,
          routeWhileDragging: false,
          plan: new L.Routing.Plan(optimizedWaypoints, {
            createMarker: function () { return null; },
            routeWhileDragging: false,
          }),
          router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
          }),
          show: false
        }).on('routesfound', (e) => {
          // this.processRouteInstructions(e.routes[0].instructions);
          let Num_ruta = 1;
          let DistanciaRuta = 0;
          let TiempoRuta = 0;
          let Ruta = [];
          let Desde = "Planta";
         
          e.routes[0].instructions.forEach((item) => {
            let tiempo = "";
            if (item.time == 0) {
              TiempoRuta += 10 * 60; //10 min descarga
            }
            TiempoRuta += item.time;
            DistanciaRuta += item.distance;
            if (item.time == 0) {
              if (item.type == "WaypointReached") {
                tiempo = "10 min.";
              } else {
                tiempo = "0 min.";
              }
            } else if (item.time <= 60) {
              tiempo = (item.time).toFixed(0) + " seg."
            } else if (item.time <= 3600) {
              tiempo = (item.time / 60).toFixed(2) + " min."
            } else {
              tiempo = ((item.time / 60) / 60).toFixed(2) + " hr."
            }
  
            let distancia = "";
            if (item.distance < 1000) {
              distancia = item.distance + " m.";
            } else {
              distancia = (item.distance / 1000).toFixed(2) + " km."
            }
  
            let velocidad = "";
            if (item.distance == 0) {
              velocidad = "0 km/h";
            } else {
              velocidad = ((item.distance / 1000) / (item.time / 3600)).toFixed(0) + " km/h";
            }
  
            let instruccion = item.text
              .replace(' onto ', ' por ')
              .replace('Continue ', 'Continúe ')
              .replace('Go straight ', 'Vaya recto ')
              .replace('Keep straight ', 'Continúe recto ')
              .replace('Make a U-turn ', 'Da una vuelta en U ')
              .replace('Make a slight ', 'Gire ligeramente a la ')
              .replace(' straight ', ' recto ')
              .replace(' to stay on ', ' permanezca ')
              .replace('Enter ', 'Entre en ')
              .replace('Exit ', 'Salga de ')
              .replace('Head ', 'Dirígete hacia el ')
              .replace('northeast', 'noreste')
              .replace('northwest', 'noroeste')
              .replace('southeast', 'sureste')
              .replace('southwest', 'suroeste')
              .replace('north', 'norte')
              .replace('south', 'sur')
              .replace('East', 'este')
              .replace('west', 'oeste')
              .replace('Keep right ', 'Mantén la derecha ')
              .replace('Keep left ', 'Mantén la izquierda ')
              .replace('Make a sharp ', 'Gira en U a la ')
              .replace('left', 'izquierda')
              .replace('right', 'derecha')
              .replace('Turn', 'Gira a la')
              .replace('You have arrived at your ', 'Has llegado a tu ')
              .replace('destination', 'destino')
              .replace('on the ', 'a la ')
              .replace('on ', 'por ')
              .replace("1st", "1°")
              .replace("2nd", "2°")
              .replace("3rd", "3°")
              .replace("th", "°")
              .replace("exit", "salida")
              .replace("Keep", "Continúa")
              .replace("take the ", "toma el ")
              .replace("and ", "y ")
              .replace('the traffic circle ', 'la rotonda ');
  
            Ruta.push({
              instruccion: instruccion,
              distancia: distancia,
              tiempo: tiempo,
              velocidad: velocidad
            });
  
            if (item.type == "WaypointReached" || item.type == "DestinationReached") {
              let TiempoRutaStr = "";
              if (TiempoRuta <= 60) {
                TiempoRutaStr = (TiempoRuta).toFixed(0) + " seg."
              } else if (TiempoRuta <= 3600) {
                TiempoRutaStr = (TiempoRuta / 60).toFixed(2) + " min."
              } else {
                TiempoRutaStr = ((TiempoRuta / 60) / 60).toFixed(2) + " hr."
              }
  
              let DistanciaRutaStr = "";
              if (DistanciaRuta < 1000) {
                DistanciaRutaStr = DistanciaRuta + " m.";
              } else {
                DistanciaRutaStr = (DistanciaRuta / 1000).toFixed(2) + " km."
              }
  
              this.rutas.push({
                Ruta: "Ruta " + Num_ruta,
                Desde: Desde,
                Hasta: this.clientes[Num_ruta]["Cliente"],
                Instrucciones: Ruta,
                TiempoStr: TiempoRutaStr,
                DistanciaStr: DistanciaRutaStr,
                Tiempo: TiempoRuta,
                Distancia: DistanciaRuta
              });
              TiempoRuta = 0;
              DistanciaRuta = 0;
              Desde = this.clientes[Num_ruta]["Cliente"];
              Num_ruta++;
              Ruta = [];
            }
          });

        }).addTo(this.map);
        this.addMarkers()
        const el: HTMLElement = document.querySelector(".leaflet-routing-container");
        if (el) {
          el.style.display = "none";
        }
  
        this.map.invalidateSize();
      })
      .catch(error => console.error('Error fetching optimized route:', error));
  }
  
  // agregar eventos
  addMarkerClickEvents() {
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        layer.on("click", (e) => {
          const clickedLatLng = (e.target as L.Marker).getLatLng();

          this.map.eachLayer(mark => {
            if (mark instanceof L.Marker) {
              if (mark.getLatLng().equals(clickedLatLng)) {
                if (mark.isPopupOpen()) {
                  mark.closePopup();
                } else {
                  mark.openPopup();
                }
              }
            }
          });
        });
      }
    });
  }

  toggleRouteDetails() {
    this.markers.forEach((marker, index) => {
      if (this.TodoMostrado == false) {
        // Abre el popup solo si no es el primer o el último marcador
        if (index !== 0 && index !== this.markers.length - 1) {
          marker.openPopup();
        }
      } else {
        marker.closePopup();
      }
    });
    this.TodoMostrado = !this.TodoMostrado;
  }

  // ACCIONES
  onAtenderPedido(Id) {
    if (this.userData.CodTipo == '2') {
      return;
    } else {
      this.router.navigate(["/atencion/" + Id]);
    }

  }

  onDelPedido(Id) {

    if (!confirm("Seguro que quieres registrar el rechazo del pedido")) {
      return;
    }

    var com = window.prompt("ingrese un comentario respecto al rechazo", "");
    // console.log(com);

    if (com == null) {
      return;
    }

    var target = document.getElementById('cargando_principal');
    target.style.display = "block"


    this.gQuery
      .sql("sp_pedido_rechazar", Id + "|" + com)
      .subscribe(res => {
        // console.log(res);
        target.style.display = "none"
        alert("Rechazo registrado")
        location.reload();
        // this.initMap();
        // this.CargarPedidos()
      });
  }

  mostrarImagen(IdCliente) {
    const imageUrl = api.gImagenesClientes + IdCliente + ".jpg";

    fetch(imageUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          const dialogRef = this.dialog.open(DialogUsuario, {
            data: imageUrl,
            disableClose: false,
            panelClass: 'image-dialog'
          });

          dialogRef.afterClosed().subscribe(result => { });
        }
        else {
          alert("este cliente no tiene foto registrada")
        }
      });
  }

  mostrarInstrucciones() {
    
    const dialogRef = this.dialog.open(DialogInstrucciones, {
      // obtener la hora de salida
      
      data: [this.rutas,this.clientes[1].HoraEnvio  ],
      height: "90%",
      width: "100%",
      maxHeight: "90vh",
      maxWidth: "800px",
      disableClose: false,
      panelClass: 'instruciones-dialog'
    });

    dialogRef.afterClosed().subscribe(result => { });
  }
}

// mostrar imagen
@Component({
  selector: 'dialog-imagen',
  templateUrl: 'dialog-imagen.html',
  styleUrls: ['./mapapedidos.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class DialogUsuario implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogUsuario>,
    @Inject(MAT_DIALOG_DATA) public imageUrl: string
  ) { }

  ngOnInit(): void { }

  onCancel(): void {

    this.dialogRef.close();
  }
}


// mostrar instrucciones
@Component({
  selector: 'dialog-instrucciones',
  templateUrl: 'dialog-instrucciones.html',
  styleUrls: ['./mapapedidos.component.css']
})

export class DialogInstrucciones implements OnInit {

  public Distancia ;
  public Tiempo;
  public Rutas
  public estadoExp = true;
  public HoraLlegada;
  public HoraSalida;
  
  constructor(
    public dialogRef: MatDialogRef<DialogUsuario>,
    @Inject(MAT_DIALOG_DATA) public Data
  ) { }
  
  ngOnInit(): void {
    this.Rutas = this.Data[0];
    console.log(this.Data[1]);

    const [horas, minutos, segundos] = this.Data[1].split(':').map(Number);
    const date = new Date();
    date.setHours(horas, minutos, segundos);

    this.HoraSalida = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLocaleLowerCase();    
    let t = 0;
    let d = 0;
    let v = 0;
    this.Rutas.forEach((item) => {
      t += item["Tiempo"];
      d += item["Distancia"];
    })
    // console.log("tiempo: " + t + ", distancia: " + d );
    
    this.HoraLlegada = this.calcularHoraLlegada(this.Data[1], t)
    const hours = Math.floor(t / 3600);
    const minutes = Math.floor((t % 3600) / 60);
    const secs = t % 60;

    if (hours > 0) {
      this.Tiempo = `${Math.floor(hours).toString().padStart(2, '0')}:${Math.floor(minutes).toString().padStart(2, '0')} h`;
  } else {
      this.Tiempo = `${Math.floor(minutes).toString().padStart(2, '0')}:${Math.floor(secs).toString().padStart(2, '0')} min`;
  }
  

    this.Distancia = (d / 1000).toFixed(2) + " km."
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  calcularHoraLlegada(horaSalida: string, tiempoEnSegundos: number): string {
    const [horas, minutos, segundos] = horaSalida.split(':').map(Number);  
    const salida = new Date();
    salida.setHours(horas, minutos, segundos);
  
    const llegada = new Date(salida.getTime() + tiempoEnSegundos * 1000);
    return llegada.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLocaleLowerCase();
  }

}
