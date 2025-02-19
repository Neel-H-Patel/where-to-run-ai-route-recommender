import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FetchRoutesComponent} from "./components/fetch-routes/fetch-routes.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FetchRoutesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'route-recommender-frontend';
}
