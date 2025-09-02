import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PullRequestInDatabaseService } from '../../services/pull-request-in-database.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-request',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './edit-request.html',
  styleUrls: ['./edit-request.css'],
  providers: [PullRequestInDatabaseService]
})
export class EditRequest {
  criteria = '';
  result: any = null;

  constructor(private pullRequestService: PullRequestInDatabaseService) {}

  searchRequest() {
    this.pullRequestService.searchRequest(this.criteria).subscribe(data => {
      this.result = data;
    });
  }

}
