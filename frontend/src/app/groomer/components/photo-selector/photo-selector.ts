import { Component, input, OnInit, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-photo-selector',
  imports: [MatButtonModule],
  templateUrl: './photo-selector.html',
  styleUrl: './photo-selector.scss',
})
export class PhotoSelector implements OnInit {
  imagePreview: WritableSignal<ArrayBuffer|string|null> = signal(null);

  photoUpload: OutputEmitterRef<string|ArrayBuffer> = output();
  initialPhoto = input<string|undefined>(undefined);
  
  ngOnInit(): void {
    if( this.initialPhoto() ) {
      console.log('Has an initial photo');
      console.log(this.initialPhoto() );
      this.imagePreview.set(this.initialPhoto()!);
    }
  }

  onFileSelected($event: Event): void {
    const input = $event.target as HTMLInputElement;

    if( input.files && input.files[0] ) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result);
        this.photoUpload.emit(reader.result!);
      };

      reader.readAsDataURL(input.files[0]);
    }
  }
}
