import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PullRequestInDatabaseService } from '../../services/pull-request-in-database.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pull-request',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './pull-request.html',
  styleUrls: ['./pull-request.css'],
  providers: [PullRequestInDatabaseService]
})
export class PullRequest {
  criteria = '';
  result: any = null;

  constructor(private pullRequestService: PullRequestInDatabaseService) {}

  searchRequest() {
    this.pullRequestService.searchRequest(this.criteria).subscribe(data => {
      this.result = data;
    });
  }
}