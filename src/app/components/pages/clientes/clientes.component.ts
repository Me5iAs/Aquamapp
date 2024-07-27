import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

import { gQueryService } from "../../../services/g-query.service";
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import { clienteI } from "../../../models/cliente.interface";

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.styl'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class ClientesComponent implements OnInit {

  columnasTabla: string[] = ['Rate', 'Clientes', 'Pos', 'Del'];
  dataSource = new MatTableDataSource();  // Tipo any para dataSource
  filtroCategoria: string = '';
  filtroRiesgo: string = '';
  filtroTexto: string = '';
  esRoot = false;
  public Segmentos  = {A: 0, B:0, C:0, D:0, E:0}
  public Riesgos = {Normal:0, 'Dudoso':0, 'Riesgo':0, 'Perdida':0 }
  public Total =0;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('GrupoBotonesCategoria') grupoBotonesCategoria: MatButtonToggleGroup;
  @ViewChild('GrupoBotonesRiesgo') grupoBotonesRiesgo: MatButtonToggleGroup;

  constructor(
    private gQuery: gQueryService,
    public dialog: MatDialog, 
    private router: Router, 
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const usuario = JSON.parse(sessionStorage.getItem("dataUser"));
    this.esRoot = usuario.CodTipo === "0";
    this.cargarClientes();
  }

  cargarClientes() {
    const target = document.getElementById('cargando_principal');
    target.style.display = "block";
    const usuario = JSON.parse(sessionStorage.getItem("dataUser"));

    this.gQuery.sql("sp_clientes_devolver", usuario.Id).subscribe(data => {
      target.style.display = "none";

      if (!data) {
        this.dataSource.data = [];
      } else {
        this.dataSource = new MatTableDataSource(<any>data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.crearFiltro();

        for (var x = 0; x < Object.values(data).length; x++) {
          this.Segmentos[data[x].Segmento]++;
          this.Riesgos[data[x].EstadoRecencia]++;
        }
        this.Total = Object.values(data).length;
      }
    });
  }

  aplicarFiltroTexto(evento: Event) {
    this.filtroTexto = (evento.target as HTMLInputElement).value.trim().toLowerCase();
    this.aplicarFiltro();
  }

  eliminarCliente(evento: clienteI) {
    if (Number(evento.Id) === 0) {
      this.snackBar.open("No se puede eliminar el cliente anónimo", "ok", { duration: 2000 });
      return;
    }

    if (!confirm("Esta acción eliminará al cliente, desea continuar")) {
      return;
    }

    const target = document.getElementById('cargando_principal');
    target.style.display = "block";

    this.gQuery.sql("sp_cliente_delete", evento.Id).subscribe(res => {
      target.style.display = "none";
      this.snackBar.open("Cliente eliminado con éxito", "ok", { duration: 2000 });
      this.cargarClientes();
    });
  }

  abrirPosCliente(evento: clienteI) {
    this.router.navigate([`/pos_cli/${evento.Id}/${evento.Nombre}`]);
  }

  aplicarFiltroCategoria(evento: any) {
    this.filtroCategoria = evento.value;
    this.aplicarFiltro();
  }

  aplicarFiltroNivelRiesgo(evento: any) {
    this.filtroRiesgo = evento.value;
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    const valorFiltro = {
      texto: this.filtroTexto,
      categoria: this.filtroCategoria,
      nivelRiesgo: this.filtroRiesgo
    };

    this.dataSource.filter = JSON.stringify(valorFiltro);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  crearFiltro(): (data: any, filtro: string) => boolean {
    return (data, filtro): boolean => {
      const criterio = JSON.parse(filtro);

      const coincideTexto = criterio.texto ? data.Nombre.toLowerCase().includes(criterio.texto) : true;
      const coincideCategoria = criterio.categoria ? data.Segmento.toLowerCase() === criterio.categoria.toLowerCase() : true;
      const coincideNivelRiesgo = criterio.nivelRiesgo ? data.EstadoRecencia.toLowerCase() === criterio.nivelRiesgo.toLowerCase() : true;

      return coincideTexto && coincideCategoria && coincideNivelRiesgo;
    };
  }

  limpiarFiltros() {
    this.filtroCategoria = '';
    this.filtroRiesgo = '';
    this.filtroTexto = '';
    this.grupoBotonesCategoria.value = null;
    this.grupoBotonesRiesgo.value = null;
    this.aplicarFiltro();
  }

  mostrarMensaje() {
    alert("Los Segmentos se calculan por la compra promedio, dependiendo del tipo de cliente (consumidor, minorista o mayorista), cada segmento tiene aprox. 20% de clientes. \n \n" +
      "El Estado por los Días desde su Ultima Compra(DUC) : \n " +
      "1. Normal: Si DUC < Prom(dias entre compras). \n" +
      "2. Dudoso: Si DUC > Prom(dias entre compras) y < Max(dias entre compras). \n" +
      "3. Riesgo: Si DUC > Max(Dias entre compras) y < Max(Dias entre compras) x 2. \n" +
      "4. Pérdida: Si DUC > Max(Dias entre compras) x 2. \n"
    );
  }
}
