import { Vote } from './Vote.model';

export class User {
    id: String;
    firstName: String;
    lastName: String;
    vote?: Vote;
    voteHistory?: Vote[] = [];
    voteHistoryDisplay?: String;

    constructor(firstName: String, lastName: String) {
        this.firstName = firstName;
        this.lastName = lastName;
    }


    castVote(newVote: Vote) {
        this.voteHistory.push(newVote);
        this.voteHistoryDisplay = this.voteHistory
            .map(vote => vote.name || vote.value)
            .join(', ');
        this.vote = newVote;
    }

    resetForNewItem() {
        this.vote = null;
        this.voteHistory = [];
        this.voteHistoryDisplay = '';
    }
}
