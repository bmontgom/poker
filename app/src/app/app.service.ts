import { Injectable } from '@angular/core';
import { Participant } from 'src/models/Participant.model';
import { Vote } from 'src/models/Vote.model';
import { WorkItem } from 'src/models/WorkItem.model';
import { ReplaySubject, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import * as uuid from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private participants: Participant[] = [];
    private votesForCurrentItem: String[] = [];
    private chatMessages: String[] = [];
    chatMessages$: Subject<String[]> = new Subject<String[]>();
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
        this.socket.on('confirm', newUserID => {
            console.log('confirm', newUserID);
            if (!this.user) {
                this.user = new Participant(null, null);
                this.user.id = newUserID
            } else if (!this.user.id) {
                this.user.id = newUserID;
            } else {
                this.socket.emit('reconnection', this.user);
            }
        });
        this.socket.on('user reconnect', user => {
            console.log('user reconnect', user);
        });
        // this.socket.on('init', data => {
        //     data.forEach(user => {
        //         this.participants.push(new Participant(user.preferredName, user.lastName));
        //     });
        //     console.log(this.participants);
        //     this.participants.forEach((participant, index) => participant.castVote(this.allowedVotes[index % this.allowedVotes.length]));
        //     this.participants$.next(this.participants);
        // });
        this.socket.on('chat', data => {
            console.log('chat', data);
            this.chatMessages.push(data);
            this.chatMessages$.next(this.chatMessages);
        })
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

    signIn(firstName: String, lastName: String) {
        if (this.user) {
            this.user.preferredName = firstName;
            this.user.lastName = lastName;
        } else {
            this.user = new Participant(firstName, lastName);
            this.participants.push(this.user);
        }
        this.socket.emit('sign in', this.user);
    }

    sendChat(message: String) {
        this.chatMessages.push(message);
        this.chatMessages$.next(this.chatMessages);
        this.socket.emit('chat', message);
    }
}
