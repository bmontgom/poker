import { Injectable } from '@angular/core';
import { Participant } from 'src/models/Participant.model';
import { Vote } from 'src/models/Vote.model';
import { WorkItem } from 'src/models/WorkItem.model';
import { ReplaySubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private participants: Participant[];
    participants$: ReplaySubject<Participant[]> = new ReplaySubject<Participant[]>();
    private user: Participant;

    readonly allowedVotes = [
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
    ];

    constructor() {
        this.participants = [
            new Participant("Barrett", "Montgomery"),
            new Participant("Elaine", "Montgomery"),
            new Participant("Nathan", "Montgomery"),
            new Participant("Lily", "Montgomery"),
            new Participant("Jonathon", "Montgomery"),
            new Participant("Kendall", "Montgomery"),
            new Participant("Evan", "Montgomery"),
            new Participant("Robert", "Montgomery"),
            new Participant("Terry", "Montgomery"),
            new Participant("Anita", "Giezentanner"),
            new Participant("Jonathon", "Montgomery"),
            new Participant("Kendall", "Montgomery"),
            new Participant("Evan", "Montgomery"),
            new Participant("Robert", "Montgomery"),
            new Participant("Terry", "Montgomery"),
            new Participant("Anita", "Giezentanner")
        ];
        this.user = this.participants[0];
        this.participants.forEach((participant, index) => participant.castVote(this.allowedVotes[index % this.allowedVotes.length]));
        this.participants.forEach(p => p.castVote(this.allowedVotes[0]));
        this.participants.push(new Participant("Undecided", "Voter"));
        this.participants$.next(this.participants);
    }

    castVote(vote: Vote) {
        this.user.castVote(vote);
        this.participants$.next(this.participants);
    }

    lockInVote(workItem: WorkItem, points: number) {
        this.participants.forEach(participant => participant.resetForNewItem());
        this.participants$.next(this.participants);
    }
}
