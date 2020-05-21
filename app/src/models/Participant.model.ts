import { Vote } from './Vote.model';

export class Participant {
    id: number;
    preferredName: String;
    lastName: String;
    vote?: Vote;
    voteHistory?: Vote[] = [];
    voteHistoryDisplay?: String;

    constructor(id: number, preferredName: String, lastName: String) {
        this.id = id;
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
