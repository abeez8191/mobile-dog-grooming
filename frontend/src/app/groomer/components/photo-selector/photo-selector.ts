import { Component, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-photo-selector',
  imports: [MatButtonModule],
  templateUrl: './photo-selector.html',
  styleUrl: './photo-selector.scss',
})
export class PhotoSelector {
  selectedFile: WritableSignal<File|undefined> = signal(undefined);
  imagePreview: WritableSignal<ArrayBuffer|string|null> = signal(null);

  photoUpload: OutputEmitterRef<string|ArrayBuffer> = output();
  
  onFileSelected($event: Event): void {
    const input = $event.target as HTMLInputElement;

    if( input.files && input.files[0] ) {
      this.selectedFile.set(input.files[0]);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result);
        this.photoUpload.emit(reader.result!);
      };

      reader.readAsDataURL(input.files[0]);
    }
  }
}
