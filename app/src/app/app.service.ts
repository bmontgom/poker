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
    user: Participant;

    readonly allowedVotes = [
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 5 },
    ];

    constructor() {
        this.participants = [
            new Participant("Barrett", "Montgomery"),
            new Participant("Brent", "Nelson"),
            new Participant("Sarah", "Brittain"),
            new Participant("Justin", "Tullos"),
            new Participant("Cory", "Steudeman"),
            new Participant("James", "Brooks"),
            new Participant("Saikiran", "Muthyala"),
            new Participant("Jason", "Ellis"),
            new Participant("Andrew", "Corsini"),
            new Participant("Gaurav", "Chawla"),
            new Participant("Alec", "Winebrenner"),
            new Participant("Sai", "Katram"),
            new Participant("Manideep", "Kama"),
            new Participant("Abhinav", "Kagithapu"),
            new Participant("Heather", "Guyll"),
            new Participant("Lingareddy", "Gopavarapu"),
            new Participant("Megan", "McKinney"),
            new Participant("Mounika", "Keesara"),
            new Participant("Phani", "Kandi"),
            new Participant("Praneeth", "Chilumula"),
            new Participant("Sai Ram", "Geetla"),
            new Participant("Sandeep", "Bainddla")
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
