import { Injectable } from '@angular/core';
import { User } from 'src/models/User.model';
import { Vote } from 'src/models/Vote.model';
import { WorkItem } from 'src/models/WorkItem.model';
import { ReplaySubject, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { ChatMessage } from 'src/models/ChatMessage.model';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    chatMessages$: Subject<ChatMessage[]> = new Subject<ChatMessage[]>();
    users$: ReplaySubject<User[]> = new ReplaySubject<User[]>();
    votesForCurrentItem$: Subject<String[]> = new Subject<String[]>();
    user: User;

    private state: State = {
        connectedUsers: {},
        disconnectedUsers: {},
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
        this.socket.on('user disconnect', data => {
            console.log('user disconnect', data.userID);
            this.updateState(data.state);
        });
        this.socket.on('user reconnect', data => {
            console.log('user reconnect', data.userID);
            this.updateState(data.state);
        });
        this.socket.on('user sign in', data => {
            console.log('user sign in', data.user);
            this.updateState(data.state);
        });
        this.socket.on('init', data => {
            console.log('init', data);
            this.updateState(data.state);
        })
        this.socket.on('user vote', data => {
            console.log('user vote', data.userID, data.vote);
            this.updateState(data.state);

        });
        this.socket.on('user chat', data => {
            console.log('user chat', data.userID, data.message);
            this.updateState(data.state)
        })
    }

    updateState(newState: State) {
        const oldState = this.state;
        if (this.areJsonDifferent(newState, oldState)) {
            if (this.areJsonDifferent(newState.connectedUsers, oldState.connectedUsers)) {
                this.users$.next(Object.values(newState.connectedUsers));
            }
            if (this.areJsonDifferent(newState.chatHistory, oldState.chatHistory)) {
                this.chatMessages$.next(newState.chatHistory);
            }
            if (this.areJsonDifferent(newState.workItems, oldState.workItems)) {
                // emit workItems
            }
            if (this.areJsonDifferent(newState.currentItem, oldState.currentItem)) {
                // emit currentItem
            }

            this.state = newState;
        }
    }

    private areJsonDifferent(a: any, b: any) {
        return JSON.stringify(a) !== JSON.stringify(b);
    }

    castVote(vote: Vote) {
        this.socket.emit('user vote', vote);
        this.users$.next(Object.values(this.state.connectedUsers));
    }

    lockInVote(workItem: WorkItem, points: number) {
        this.state.connectedUsers.forEach(user => user.resetForNewItem());
        this.users$.next(Object.values(this.state.connectedUsers));
        this.votesForCurrentItem$.next([]);
    }

    signIn(firstName: String, lastName: String) {
        if (this.user) {
            this.user.firstName = firstName;
            this.user.lastName = lastName;
        } else {
            this.user = new User(firstName, lastName);
            this.state.connectedUsers.push(this.user);
        }
        this.socket.emit('user sign in', this.user);
    }

    sendChat(message: String) {
        this.state.chatHistory.push({
            userID: this.user.id,
            message,
            timestamp: Date.now()
        });
        this.chatMessages$.next(this.state.chatHistory);
        this.socket.emit('user chat', message);
    }
}

class State {
    connectedUsers: any = null;
    disconnectedUsers: any = null;
    workItems: WorkItem[] = [];
    currentItem: WorkItem = null;
    chatHistory: ChatMessage[] = [];
}
