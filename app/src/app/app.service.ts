import { Injectable } from '@angular/core';
import { User } from 'src/models/User.model';
import { Vote } from 'src/models/Vote.model';
// import { WorkItem } from 'src/models/WorkItem.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { WorkItem } from 'src/models/WorkItem.model';
// import { ChatMessage } from 'src/models/ChatMessage.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  // chatMessages$: Subject<ChatMessage[]> = new Subject<ChatMessage[]>();
  readonly state$: StateSubjects = {
    connectedUsers$: new Subject<User[]>(),
    disconnectedUsers$: new Subject<User[]>(),
    // workItems$: new Subject<WorkItem[]>(),
    currentItem$: new Subject<WorkItem>(),
    connected$: new BehaviorSubject<boolean>(false)
  };
  user: User;
  socketId: string;

  private state: State = {
    connectedUsers: {},
    disconnectedUsers: {},
    // chatHistory: [],
    // workItems: [],
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
    this.socket.on('confirm', data => {
      //console.log('confirm', newUserID);
      if (!this.user) {
        this.user = new User(null, null);
        this.user.id = data.userId;
      } else if (!this.user.id) {
        this.user.id = data.userId;;
      } else {
        this.socket.emit('reconnection', this.user);
      }

      this.state$.connected$.next(true);
    });
    this.socket.on('disconnect', data => {
      //console.log('disconnected');
      this.state$.connected$.next(false);
    });
    this.socket.on('user disconnect', data => {
      //console.log('user disconnect', data.userID);
      this.updateState(data.state);
    });
    this.socket.on('user reconnect', data => {
      //console.log('user reconnect', data.userID);
      this.updateState(data.state);
    });
    this.socket.on('user sign in', data => {
      //console.log('user sign in', data.user);
      this.updateState(data.state);
    });
    this.socket.on('init', data => {
      //console.log('init', data);
      this.updateState(data.state);
    });
    this.socket.on('user vote', data => {
      //console.log('user vote', data.userID, data.vote);
      this.updateState(data.state);
    });
    this.socket.on('switch work item', data => {
      //console.log('switch work item', data.userID, data.newItem);
      this.updateState(data.state);
    });
    this.socket.on('show votes', data => {
      this.updateState(data.state);
    });
    // this.socket.on('user chat', data => {
    ////     console.log('user chat', data.userID, data.message);
    //     this.updateState(data.state)
    // });
  }

  updateState(newState: State) {
    const oldState = this.state;
    if (this.areDifferent(newState, oldState)) {
      if (this.areDifferent(newState.connectedUsers, oldState.connectedUsers)) {
        this.state$.connectedUsers$.next(Object.values(newState.connectedUsers));
      }
      if (this.areDifferent(newState.disconnectedUsers, oldState.disconnectedUsers)) {
        this.state$.disconnectedUsers$.next(Object.values(newState.disconnectedUsers));
      }
      // if (this.areJsonDifferent(newState.chatHistory, oldState.chatHistory)) {
      //     this.chatMessages$.next(newState.chatHistory);
      // }
      // if (this.areJsonDifferent(newState.workItems, oldState.workItems)) {
      //   this.state$.workItems$.next(newState.workItems);
      // }
      if (this.areDifferent(newState.currentItem, oldState.currentItem)) {
        this.state$.currentItem$.next(newState.currentItem);
      }
      this.state = newState;
    }
  }

  private areDifferent(a: any, b: any) {
    return JSON.stringify(a) !== JSON.stringify(b);
  }

  castVote(vote: Vote) {
    this.socket.emit('user vote', vote);
    // this.state$.connectedUsers$.next(Object.values(this.state.connectedUsers));
  }

  switchItem(newItem: number) {
    this.socket.emit('switch work item', newItem);
  }

  showVotes() {
    this.socket.emit('show votes');
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

  // sendChat(message: String) {
  //     this.state.chatHistory.push({
  //         userID: this.user.id,
  //         message,
  //         timestamp: Date.now()
  //     });
  //     this.chatMessages$.next(this.state.chatHistory);
  //     this.socket.emit('user chat', message);
  // }
}

class State {
  connectedUsers: any = null;
  disconnectedUsers: any = null;
  // workItems: WorkItem[] = [];
  currentItem: WorkItem = null;
  // chatHistory: ChatMessage[] = [];
}

type StateSubjects = {
  connectedUsers$: Subject<User[]>,
  disconnectedUsers$: Subject<User[]>,
  // workItems$: Subject<WorkItem[]>,
  currentItem$: Subject<WorkItem>,
  connected$: Subject<boolean>
};
