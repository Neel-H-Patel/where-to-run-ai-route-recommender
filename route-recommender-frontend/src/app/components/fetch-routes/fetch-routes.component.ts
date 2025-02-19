import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {NgForOf, NgIf} from "@angular/common";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatList, MatListItem} from "@angular/material/list";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-fetch-routes',
  templateUrl: './fetch-routes.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    MatProgressBar,
    MatList,
    MatListItem,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardHeader,
    MatButton
  ],
  styleUrls: ['./fetch-routes.component.scss']
})
export class FetchRoutesComponent {
  routes: any[] = [];
  isLoading = false;

  constructor(private apiService: ApiService) {}

  async fetchRoutes() {
    this.isLoading = true;
    const location = "Dallas, TX";
    const preferences = {
      distance: 5,
      safety: "high",
      elevation: 200,
      terrain: "road"
    };

    const params = new URLSearchParams({
        location: location,
        distance: preferences.distance.toString(),
        safety: preferences.safety,
        elevation: preferences.elevation.toString(),
        terrain: preferences.terrain
    });

    this.routes = await this.apiService.getRankedRoutes(params);
    this.isLoading = false;
  }
}
