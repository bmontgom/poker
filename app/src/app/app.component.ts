import { Component, OnInit } from '@angular/core';
import { WorkItem } from 'src/models/WorkItem.model';
import { AppService } from './app.service';
import { Vote } from 'src/models/Vote.model';
// import { ChatMessage } from 'src/models/ChatMessage.model';

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
    // chatMessages: ChatMessage[] = [];
    votesForCurrentItem: String[] = [];
    isSignedIn: boolean = false;

    constructor(private appService: AppService) {
        // this.appService.chatMessages$.subscribe(messages => this.chatMessages = messages);
    }

    ngOnInit() {
        this.itemsToPoint = [
            { itemNumber: 106832 },
            { itemNumber: 257198 },
            { itemNumber: 348624 },
            { itemNumber: 458163 }
        ];
        this.currentItem = this.itemsToPoint.shift();
        this.allowedVotes = this.appService.allowedVotes;
    }

    castVote(vote: Vote) {
        if (!this.appService.user.vote || vote.value != this.appService.user.vote.value) {
            this.appService.castVote(vote);
        }
    }

    lockInVotes() {
        this.appService.lockInVote(this.currentItem, 1);
        this.pointedItems.push(this.currentItem);
        this.currentItem = this.itemsToPoint.shift();
    }

    onSignInKey(key) {
        console.log(key);
    }

    signIn(firstName: String, lastName: String) {
        //todo check for previous socket connections and reconnect with same info
        if (firstName && lastName) {
            this.isSignedIn = true;
            //todo wait for the socket to say yeah ok you're in
            this.appService.signIn(firstName, lastName);
        }
    }

    // sendChat(message: String) {
    //     this.appService.sendChat(message);
    // }
}
