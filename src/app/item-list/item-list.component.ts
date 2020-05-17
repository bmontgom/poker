import { Component, Input } from '@angular/core';
import { WorkItem } from 'src/models/WorkItem.model';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent {
    @Input() workItems: WorkItem[] = [];
}
