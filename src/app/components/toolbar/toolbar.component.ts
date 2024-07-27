import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.styl']
})
export class ToolbarComponent implements OnInit {
  public appName = "Aquam";
  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  onLogout(){
    this.auth.logout();
    
  }

}
