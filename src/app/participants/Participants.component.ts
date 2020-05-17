import { Component, OnInit } from '@angular/core';
import { Participant } from 'src/models/Participant.model';
import { AppService } from '../app.service';

@Component({
    selector: 'app-participants',
    templateUrl: './participants.component.html',
    styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {
    participantGroups: Participant[][] = [];

    constructor(private appService: AppService) { }

    ngOnInit(): void {
        this.appService.participants$.subscribe(participants => {
            console.log('got new participants');
            this.participantGroups = [];
            this.appService.allowedVotes.forEach((vote, index) => {
                let newGroup = [];
                //@ts-ignore
                newGroup.voteValue = this.appService.allowedVotes[index].value;
                this.participantGroups.push(newGroup);
            });
            let newGroup = [];
            //@ts-ignore
            newGroup.voteValue = '?';
            this.participantGroups.push(newGroup);
            participants.forEach(participant => {
                if (participant.vote) {
                    let groupIndex = this.appService.allowedVotes.indexOf(participant.vote);
                    this.participantGroups[groupIndex].push(participant);
                    //@ts-ignore
                    this.participantGroups[groupIndex].voteValue = participant.vote.value;
                } else {
                    this.participantGroups[this.participantGroups.length - 1].push(participant);
                }
            });

            this.participantGroups = this.participantGroups.filter(group => group.length > 0);
        });
    }

}
