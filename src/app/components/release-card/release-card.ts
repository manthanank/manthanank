import { Component, Input } from '@angular/core';
import { OttRelease } from '../../services/ott';

@Component({
  selector: 'app-release-card',
  imports: [],
  templateUrl: './release-card.html',
  styleUrl: './release-card.scss',
})
export class ReleaseCard {
  @Input() release: OttRelease = {
    title: '',
    platform: '',
    genre: '',
    release_date: '',
  };
}
