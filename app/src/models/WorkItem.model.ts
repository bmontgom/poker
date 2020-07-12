import { User } from './User.model';

export class WorkItem {
    itemNumber: number;
    areVotesShown: boolean;
    votesShownBy?: User;
}
