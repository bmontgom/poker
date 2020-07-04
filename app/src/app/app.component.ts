import { Component, OnInit } from '@angular/core';
// import { WorkItem } from 'src/models/WorkItem.model';
import { AppService } from './app.service';
import { Vote } from 'src/models/Vote.model';
import { User } from 'src/models/User.model';
import { WorkItem } from 'src/models/WorkItem.model';
// import { ChatMessage } from 'src/models/ChatMessage.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    // workItems: WorkItem[] = [];
    // pointedItems: WorkItem[] = [];
    currentItem: WorkItem = null;
    allowedVotes: Vote[] = [];
    // chatMessages: ChatMessage[] = [];
    isSignedIn = false;
    isConnected = false;
    shouldShowModal = false;
    user: User = null;
    currentVote

    constructor(private appService: AppService) {
        // this.appService.chatMessages$.subscribe(messages => this.chatMessages = messages);
        // this.appService.state$.workItems$.subscribe(items => this.workItems = this.workItems);
        this.appService.state$.currentItem$.subscribe(item => {
            if (!this.currentItem || this.currentItem.itemNumber !== item.itemNumber) {
                this.currentVote = null;
                this.shouldShowModal = false;
            }
            this.currentItem = item;
        });
        this.appService.state$.connected$.subscribe(connected => this.isConnected = connected);
    }

    ngOnInit() {
        this.allowedVotes = this.appService.allowedVotes;
    }

    castVote(vote: Vote) {
        if (!this.appService.user.vote || vote.value != this.appService.user.vote.value) {
            this.currentVote = vote.value;
            this.appService.castVote(vote);
        }
    }

    showModal() {
        this.shouldShowModal = true;
    }

    hideModal() {
        this.shouldShowModal = false;
    }

    submitNewItem(newItem: number) {
        this.appService.switchItem(newItem);
        return true;
    }

    // https://jbhunt.visualstudio.com/EngAndTech/_workitems/edit/539506

    signIn(firstName: String, lastName: String) {
        // @Todo check for previous socket connections and reconnect with same info
        if (firstName && lastName) {
            this.isSignedIn = true;
            // @Todo wait for the socket to say yeah ok you're in
            this.appService.signIn(firstName, lastName);
        }
    }

    // sendChat(message: String) {
    //     this.appService.sendChat(message);
    // }
}
