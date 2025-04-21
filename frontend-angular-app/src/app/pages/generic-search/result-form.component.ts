import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DisplayConfig {
  title: (item: any) => string;
  subtitle?: (item: any) => string;
  details?: (item: any) => string;
}

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-form.component.html',
  styleUrls: ['../components-styles/search.component.css']
})
export class ResultListComponent {
  @Input() items: { code: string; designation: string }[] = [];
  @Input() actions: { label: string; action: string; class?: string }[] = [];
  @Input() displayConfig?: DisplayConfig;
  @Output() actionClick = new EventEmitter<{ action: string; item: any }>();

  getTitle(item: any): string {
    return this.displayConfig ? 
      this.displayConfig.title(item) : 
      `${item.code} - ${item.designation}`;
  }

  getSubtitle(item: any): string | null {
    return this.displayConfig?.subtitle ? 
      this.displayConfig.subtitle(item) : 
      null;
  }

  getDetails(item: any): string | null {
    return this.displayConfig?.details ? 
      this.displayConfig.details(item) : 
      null;
  }

  triggerAction(action: string, item: any) {
    this.actionClick.emit({ action, item });
  }
}