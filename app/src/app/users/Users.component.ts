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

    constructor(private appService: AppService) { }

    ngOnInit(): void {
        this.appService.users$.subscribe(users => {
            this.userGroups = [];
            this.appService.allowedVotes.forEach(vote => {
                let newGroup = [];
                //@ts-ignore
                newGroup.voteValue = vote.value;
                this.userGroups.push(newGroup);
            });
            let newGroup = [];
            //@ts-ignore
            newGroup.voteValue = '?';
            this.userGroups.push(newGroup);
            users.forEach(user => {
                if (user.vote) {
                    let groupIndex = this.appService.allowedVotes.indexOf(user.vote);
                    this.userGroups[grouaIndex].push(user);
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

}
