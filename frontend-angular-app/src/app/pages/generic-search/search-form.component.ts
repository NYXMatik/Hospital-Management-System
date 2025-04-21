import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-form.component.html',
  styleUrls: ['../components-styles/search.component.css']
})
export class SearchFormComponent {
  @Input() fields: { name: string; label: string; placeholder: string; value: string }[] = [];
  @Output() search = new EventEmitter<any>();

  onSearch() {
    const searchValues = this.fields.reduce((acc: { [key: string]: string }, field) => {
      acc[field.name] = field.value; // Adiciona campo ao objeto acumulador
      return acc;
    }, {}); // Inicia com um objeto vazio
    this.search.emit(searchValues); // Emite os valores para o componente pai
  }
  
}
