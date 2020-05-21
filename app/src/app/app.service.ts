import { Injectable } from '@angular/core';
import { Participant } from 'src/models/Participant.model';
import { Vote } from 'src/models/Vote.model';
import { WorkItem } from 'src/models/WorkItem.model';
import { ReplaySubject, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private participants: Participant[] = [];
    private votesForCurrentItem: String[] = [];
    participants$: ReplaySubject<Participant[]> = new ReplaySubject<Participant[]>();
    votesForCurrentItem$: Subject<String[]> = new Subject<String[]>();
    user: Participant;

    readonly allowedVotes: Vote[] = [
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 5 },
        { value: 8 }
    ];

    constructor(private socket: Socket) {
        this.socket.emit('system status', 'initializing service');
        this.socket.on('init data', data => {
            data.forEach(user => {
                this.participants.push(new Participant(user.id, user.preferredName, user.lastName));
            });
            console.log(this.participants);
            this.participants.forEach((participant, index) => participant.castVote(this.allowedVotes[index % this.allowedVotes.length]));
            this.participants$.next(this.participants);
        });
    }

    castVote(user: Participant, vote: Vote) {
        user.castVote(vote);
        this.participants$.next(this.participants);
    }

    lockInVote(workItem: WorkItem, points: number) {
        this.participants.forEach(participant => participant.resetForNewItem());
        this.participants$.next(this.participants);
        this.votesForCurrentItem$.next([]);
    }

    signIn(user: Participant) {
        this.user = user;
        this.participants.push(this.user);
        this.socket.emit('sign in', this.user);
    }
}
