import { Vote } from './Vote.model';

export class User {
    id: String;
    firstName: String;
    lastName: String;
    vote: Vote;
    voteHistory: Vote[] = [];
    voteHistoryDisplay: String = '';

    constructor(firstName: String, lastName: String) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
