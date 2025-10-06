import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-feedback-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback-popup.component.html',
  styleUrls: ['./feedback-popup.component.css'],
})
export class FeedbackPopupComponent implements OnChanges {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | '' = '';

  isVisible: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] && changes['message'].currentValue) {
      this.isVisible = true;

      setTimeout(() => {
        this.isVisible = false;
      }, 3000);
    }
  }
}
