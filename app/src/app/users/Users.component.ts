import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/User.model';
import { AppService } from '../app.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    userGroups: User[][] = [];
    backupGroups: User[][] = [];

    constructor(private appService: AppService) {
        this.backupGroups = [];
        this.appService.allowedVotes.forEach(vote => {
            let newGroup = [];
            //@ts-ignore
            newGroup.voteValue = vote.value;
            this.backupGroups.push(newGroup);
        });
        let newGroup = [];
        //@ts-ignore
        newGroup.voteValue = '?';
        this.backupGroups.push(newGroup);
    }

    ngOnInit(): void {
        this.appService.users$.subscribe(users => {
            this.resetUserGroups();
            users.forEach(user => {
                if (user.vote) {
                    let groupIndex = this.appService.allowedVotes
                        .findIndex(vote => vote.value === user.vote.value)
                    this.userGroups[groupIndex].push(user);
                    //@ts-ignore
                    this.userGroups[groupIndex].voteValue = user.vote.value;
                } else {
                    this.userGroups[this.userGroups.length - 1].push(user);
                }
            });

            this.userGroups = this.userGroups
                .filter(group => group.length > 0)
                .sort((a, b) => {
                    let sizeDiff = b.length - a.length;
                    //@ts-ignore
                    return sizeDiff != 0 ? sizeDiff : a.voteValue - b.voteValue;
                });
        });
    }

    private resetUserGroups() {
        console.log(this.backupGroups);
        this.userGroups = JSON.parse(JSON.stringify(this.backupGroups));
    }
}
