import { Component, OnInit } from '@angular/core';
import { WorkItem } from 'src/models/WorkItem.model';
import { AppService } from './app.service';
import { Vote } from 'src/models/Vote.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    itemsToPoint: WorkItem[] = [];
    pointedItems: WorkItem[] = [];
    currentItem: WorkItem = null;
    allowedVotes: Vote[] = [];

    constructor(private appService: AppService) { }

    ngOnInit() {
        this.itemsToPoint = [
            { itemNumber: 106832 },
            { itemNumber: 257198 },
            { itemNumber: 348624 },
            { itemNumber: 458163 },
        ];
        this.currentItem = this.itemsToPoint.shift();
        this.allowedVotes = this.appService.allowedVotes;
    }

    castVote(vote: Vote) {
        this.appService.castVote(vote);
    }

    lockInVotes() {
        this.appService.lockInVote(this.currentItem, 1);
    }
}
