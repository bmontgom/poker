import { Vote } from './Vote.model';

export class Participant {
    preferredName: String;
    lastName: String;
    vote?: Vote;
    voteHistory?: Vote[] = [];
    voteHistoryDisplay?: String;

    constructor(preferredName: String, lastName: String) {
        this.preferredName = preferredName;
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
