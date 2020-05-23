import { Injectable } from '@angular/core';
import { User } from 'src/models/User.model';
import { Vote } from 'src/models/Vote.model';
import { WorkItem } from 'src/models/WorkItem.model';
import { ReplaySubject, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    chatMessages$: Subject<String[]> = new Subject<String[]>();
    users$: ReplaySubject<User[]> = new ReplaySubject<User[]>();
    votesForCurrentItem$: Subject<String[]> = new Subject<String[]>();
    user: User;

    private state: State = {
        users: {
            connectedUsers: {},
            disconnectedUsers: {}
        },
        chatHistory: [],
        workItems: [],
        currentItem: null
    };

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
                this.user = new User(null, null);
                this.user.id = newUserID
            } else if (!this.user.id) {
                this.user.id = newUserID;
            } else {
                this.socket.emit('reconnection', this.user);
            }
        });
        this.socket.on('user reconnect', (state: State) => {
            console.log('user reconnect');
            this.state.users.connectedUsers = state.users;
        });
        this.socket.on('user sign in', user => {
            console.log('user sign in', user);
            this.state.users.connectedUsers.push(user);
            this.users$.next(this.state.users.connectedUsers);
        });
        this.socket.on('chat', message => {
            console.log('chat', message);
            this.state.chatHistory.push(message);
            this.chatMessages$.next(this.state.chatHistory);
        })
    }

    castVote(user: User, vote: Vote) {
        user.castVote(vote);
        this.users$.next(this.state.users.connectedUsers);
    }

    lockInVote(workItem: WorkItem, points: number) {
        this.state.users.connectedUsers.forEach(user => user.resetForNewItem());
        this.users$.next(this.state.users.connectedUsers);
        this.votesForCurrentItem$.next([]);
    }

    signIn(firstName: String, lastName: String) {
        if (this.user) {
            this.user.firstName = firstName;
            this.user.lastName = lastName;
        } else {
            this.user = new User(firstName, lastName);
            this.state.users.connectedUsers.push(this.user);
        }
        this.socket.emit('user sign in', this.user);
    }

    sendChat(message: String) {
        this.state.chatHistory.push(message);
        this.chatMessages$.next(this.state.chatHistory);
        this.socket.emit('chat', message);
    }
}

class State {
    users: Users = null;
    workItems: WorkItem[] = [];
    currentItem: WorkItem = null;
    chatHistory: String[] = [];
}

class Users {
    connectedUsers: any = null;
    disconnectedUsers: any = null;
}
