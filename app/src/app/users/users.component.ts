import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { User } from '../../models/User.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  userGroups: any = [];
  backupGroups: any = [];
  areVotesShown = false;
  users: User[] = [];
  votesShownBy: User;

  constructor(private appService: AppService) {
    this.backupGroups = this.appService.allowedVotes
      .map(vote => { return { voteValue: vote.name || vote.value, members: [] } })
      .concat([{ voteValue: '?', members: [] }]);
    this.resetUserGroups();

    this.appService.state$.currentItem$.subscribe(newItem => {
      //console.log('current item changed');
      if (newItem.areVotesShown) {
        //console.log('showing votes');
        this.votesShownBy = newItem.votesShownBy;
        this.areVotesShown = true;
        this.updateUserGroups(this.users);
      } else {
        //console.log('hiding votes');
        this.areVotesShown = false;
      }
    });
    this.appService.state$.connectedUsers$.subscribe(users => {
      //console.log('users users updated', users);
      this.users = users;
      this.updateUserGroups(users);
    });
  }

  showVotes() {
    //console.log('showVotes()');
    this.areVotesShown = true;
    this.appService.showVotes();
  }

  private updateUserGroups(users: User[]) {
    this.resetUserGroups();
    this.sortUsersIntoGroups(users);
    //console.log('sorted', this.userGroups);
    this.filterAndSortGroups();
    //console.log('filtered', this.userGroups);
  }

  private resetUserGroups() {
    this.userGroups = JSON.parse(JSON.stringify(this.backupGroups));
  }

  private sortUsersIntoGroups(users: User[]) {
    users.forEach(user => {
      //console.log(user);
      if (user.vote) {
        const groupIndex = this.userGroups.findIndex(group => group.voteValue === user.vote.value);
        this.userGroups[groupIndex].members.push(user);
      } else {
        this.userGroups[this.userGroups.length - 1].members.push(user);
      }
    });
  }

  private filterAndSortGroups() {
    this.userGroups = this.userGroups
      .filter(group => group.members.length > 0)
      .sort((a, b) => {
        const sizeDiff = b.members.length - a.members.length;
        return sizeDiff != 0 ? sizeDiff : a.voteValue - b.voteValue;
      });

  }
}
