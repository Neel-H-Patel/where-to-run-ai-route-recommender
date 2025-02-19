import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'http://localhost:8000'; // Change this when deploying

  async getRankedRoutes(location: string, preferences: any) {
    try {
      const response = await axios.post(`${this.BASE_URL}/get-ranked-routes`, {
        location,
        preferences
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ranked routes:', error);
      return [];
    }
  }
}
